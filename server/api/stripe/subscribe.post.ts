import Stripe from 'stripe';
import type { StripeResponse } from '~/types/StripeResponse';
import type { RuntimeConfig } from 'nuxt/schema';
import { type Option, none, some } from '~/types/Option';

import { createAnInvoice } from '~/server/utils/stripeInvoice';

export default defineEventHandler(async (event) => {
  const config: RuntimeConfig = useRuntimeConfig();

  // params that come from the front end (request body)
  const params = await readBody<Record<string, string>>(event);

  //create a new stripe instance
  const stripe: Stripe = new Stripe(config.private.stripeSecretKey, {
    apiVersion: '2023-08-16',
  });

  let currentUser: Stripe.Customer | null = null;

  //            CUSTOMER LOOKUP / CREATION METHODS

  // do a look up to see if we already have the email address as a customer
  const findCustomer = async (
    userEmail: string
  ): Promise<Option<Stripe.Customer>> => {
    try {
      // try to search for the customer via their email address
      const existingCustomer: Stripe.Response<Stripe.ApiList<Stripe.Customer>> =
        await stripe.customers.list({
          email: userEmail,
          limit: 1,
        });

      // if there is no customers, an empty array gets returned
      if (existingCustomer.data.length > 0)
        return some(existingCustomer.data[0]);

      // else there is no data to be returned, return the none function
      return none();
    } catch (error) {
      if (error instanceof Error) {
        throw createError({
          statusCode: 500,
          message: error.message,
        });
      }
      return Promise.reject(error);
    }
  };

  // create a new customer - pass in params such as an object
  const createNewCustomer = async (
    customerParams: Stripe.CustomerCreateParams
  ): Promise<Stripe.Customer> => {
    try {
      // create a new customer
      return await stripe.customers.create(customerParams);
    } catch (error) {
      if (error instanceof Error) {
        throw createError({
          statusCode: 500,
          message: error.message,
        });
      }
      return Promise.reject(error);
    }
  };

  //              PAYMENT INTENT CREATION METHOD

  //              MAIN FLOW

  const createSubscription = async (): Promise<StripeResponse | null> => {
    console.log(params);
    // if the params do not contain a customer email, we need to cancel the flow
    const userEmail = params?.customerEmail;
    const planType = params?.planType;

    if (!userEmail || !planType) {
      console.log('no email or plan type');
      throw createError({
        statusCode: 400,
        message: 'Missing customer email OR plan type',
      });
    }

    const planTypes: {
      price: number;
      name: string;
    }[] = [
      {
        name: 'single',
        price: 199,
      },
      {
        name: 'monthly',
        price: 499,
      },
      {
        name: 'yearly',
        price: 699,
      },
    ];

    // first we will check if the user already exists in stripe
    const currentPlanType:
      | {
          price: number;
          name: string;
        }
      | undefined = planTypes.find(
      (plan: { name: string; price: number }): boolean => plan.name === planType
    );

    const isExistingCustomer = await findCustomer(userEmail);

    // see if we already have the customer
    // if the response is true, we can use the existing customer
    if (isExistingCustomer.kind === 'some')
      currentUser = isExistingCustomer.value;

    // if the response is false, we need to create a new customer
    // create the new customer
    if (isExistingCustomer.kind === 'none') {
      const newCustomerParams: Stripe.CustomerCreateParams = {
        email: userEmail,
      };

      try {
        currentUser = await createNewCustomer(newCustomerParams);

        if (!currentUser) return null;
      } catch (error) {
        if (error instanceof Error) {
          throw createError({
            statusCode: 500,
            message: error.message,
          });
        }
      }
    }

    if (!currentPlanType || !currentUser) return null;

    // - if a value gets returned - it will be of type string
    const invoice: Option<string> = await createAnInvoice(
      currentUser,
      currentPlanType?.price,
      stripe
    );

    console.log(invoice);

    if (invoice.kind === 'none' || !currentPlanType?.price) return null;

    return {
      invoice: invoice.value,
      paymentPrice: currentPlanType?.price,
    };
  };
  return await createSubscription();
});
