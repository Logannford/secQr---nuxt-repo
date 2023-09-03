import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  //create a new stripe instance
  const stripe = new Stripe(config.private.stripeSecretKey, {
    apiVersion: '2023-08-16',
  });
  
  // params that come from the front end (request body)
  const params = await readBody(event);

  // if the params do not contain a customer email, we need to cancel the flow
  const userEmail = params?.customerEmail;  
  if(!userEmail){
    throw createError({
      statusCode: 400,
      message: 'Missing customer email'
    })
  }

  //            CUSTOMER LOOKUP / CREATION METHODS 

  // do a look up to see if we already have the email address as a customer
  const findCustomer = async (userEmail: string): Promise<Stripe.Customer | Boolean> => {
    try{
      // try to search for the customer via their email address
      const existingCustomer: Stripe.Response<Stripe.ApiList<Stripe.Customer>> = await stripe.customers.list({
        email: userEmail,
        limit: 10
      })

      // if there is no customers, an empty array gets returned
      if(existingCustomer.data.length > 0)
        return existingCustomer.data[0];
      return false;
    }
    catch(error: any){
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
  }

  // create a new customer - pass in params such as an object
  const createNewCustomer = async (customerParams: Stripe.CustomerCreateParams): Promise<Stripe.Customer> => {
    try{
      // create a new customer
      const customer: Stripe.Customer = await stripe.customers.create(
        customerParams
      );
      return customer;
    }
    catch(error: any){
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
  }

  //              PAYMENT INTENT CREATION METHOD

  /**
   * Invoices are statements of amounts owed by a customer, 
   * and are either generated one-off, or generated periodically 
   * from a subscription
   * 
   * @param user 
   * @returns clientSecret OR Null
   */

  const createAnInvoice = async (user: Stripe.Customer):Promise<string | null> => {

    // we need the payment intent and user
    if(!user || !user.email){
      throw createError({
        statusCode: 400,
        message: 'Missing payment intent AND / OR user'
      })
    };

    // try to create the invoice
    try {
      const invoice: Stripe.Invoice = await stripe.invoices.create({
        customer: user?.id,
        description: 'Test Invoice',
        auto_advance: true,

        // automatic_tax: {
        //   enabled: true
        // },
        currency: 'gbp'
      });

      // create an invoice item
      /**
       * Invoice Items represent the component lines of an invoice. An invoice item is added to an 
       * invoice by creating or updating it  with an invoice field, at which point it will be 
       * included as an invoice line item within invoice.lines.
       */
      await stripe.invoiceItems.create({
        invoice: invoice?.id,
        customer: user?.id,
        unit_amount: 1000,
        currency: 'gbp'
      });

      const finalizedInvoice = await stripe.invoices.finalizeInvoice(
        invoice.id,
        {
          auto_advance: true
        }
      );

      const paymentIntentId = finalizedInvoice?.payment_intent;

      if(!paymentIntentId){
        throw createError({
          statusCode: 500,
          message: 'Failed to finalize invoice'
        })
      };

      let paymentIntent: Stripe.PaymentIntent | null;

      // if the payment intent is a string, we need to update it
      if(typeof paymentIntentId === 'string'){
        paymentIntent = await stripe. paymentIntents.retrieve(
          paymentIntentId
        );
      }

      // update the payment intent with the new payment intent id
      paymentIntent = await stripe.paymentIntents.update(
        paymentIntentId as string,
        {
          metadata: {
            email: user?.email,
            amount: 1000
          },
          receipt_email: user?.email
        }
      );

      if(!paymentIntent.client_secret)
        throw createError({
          statusCode: 500,
          message: 'Failed to create payment intent'
        });

      return paymentIntent?.client_secret;
    }
    catch(error: any){
      console.error(error);
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
  };


  //              MAIN FLOW

  // first we will check if the user already exists in stripe
  let currentUser: Stripe.Customer | Boolean | null = null;

  // see if we already have the customer
  currentUser = await findCustomer(userEmail);

  // if the response if false, we need to create a new customer
  // create the new customer 
  if(!currentUser) {
    const newCustomerParams: Stripe.CustomerCreateParams = {
      email: userEmail
    };

    try {
      currentUser = await createNewCustomer(newCustomerParams);

      if(currentUser)
        return currentUser;
    }
    catch(error: any){
      throw createError({
        statusCode: 500,
        message: error.message
      })
    }
  }

  const invoice = await createAnInvoice(
    currentUser as Stripe.Customer 
  );
  
  // get the params from the request body
  return {
    invoice,
    price: 1000,
    paymentEmail: userEmail
  };
});
