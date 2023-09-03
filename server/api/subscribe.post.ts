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

  const paymentIntentCreation = async (customer: Stripe.Customer): Promise<Stripe.PaymentIntent | Boolean> => {
    // we need the customer id in order to create a payment intent in this situation
    if(!customer.id)
      return false;
    /*
       create a payment intent 
        - a payment intent is an api that tracks the lifecycle
          of a checkout flow, it can be used to trigger additional
          authentication steps when required by law or a card issuer.

        will return a client secret.
    */
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
      // this will need to change to a param passed in - this is fine for now
      amount: 1000,
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      customer: customer.id
    });

    // check if we got a client secret back from the payment intent
    const clientSecret = paymentIntent.client_secret;
    if(!clientSecret)
      return false;
    return paymentIntent;
  }

  /**
   * Invoices are statements of amounts owed by a customer, 
   * and are either generated one-off, or generated periodically 
   * from a subscription
   * 
   * @param user 
   * @returns 
   */

  const createAnInvoice = async (user: Stripe.Customer, paymentIntent: Stripe.PaymentIntent):Promise<Stripe.Invoice> => {

    // we need the payment intent and user
    if(!paymentIntent || !user){
      throw createError({
        statusCode: 400,
        message: 'Missing payment intent AND / OR user'
      })
    }

    // try to create the invoice
    try {
      const invoice: Stripe.Invoice = await stripe.invoices.create({
        customer: user?.id,
        description: 'Test Invoice',
        auto_advance: true,
        // automatic_tax: {
        //   enabled: true
        // },
        currency: 'gbp',
        
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
        unit_amount: paymentIntent?.amount,
        currency: 'gbp'
      });

      const finalizedInvoice = stripe.invoices.finalizeInvoice(
        invoice.id,
        {
          auto_advance: true
        }
      );

      return finalizedInvoice;
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

  // create a payment intent for the user
  const paymentIntent = await paymentIntentCreation(currentUser as Stripe.Customer);

  const invoice = await createAnInvoice(
    currentUser as Stripe.Customer, 
    paymentIntent as Stripe.PaymentIntent
  );

  // get the params from the request body
  // @ts-ignore
  return await invoice;
});
