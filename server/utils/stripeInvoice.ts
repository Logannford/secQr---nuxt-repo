import Stripe from 'stripe';

import { type Option, none, some } from '~/types/Option';

/**
 * Invoices are statements of amounts owed by a customer,
 * and are either generated one-off, or generated periodically
 * from a subscription
 *
 * - First time using option types in typescript!
 * - Option types are a way of representing a value that may or may not exist
 * - We use them here to represent the client secret, which may or may not exist
 * - We use the Option type to represent this
 * - We can use the some() and none() functions to create an Option type
 *
 *
 * @param user
 * @returns Option<string> - the client secret
 */
export const createAnInvoice = async (
  user: Stripe.Customer,
  amount: number,
  stripe: Stripe
  // the return type will either be 'some' or 'none'
  // but if it is 'some' - it will be a string
): Promise<Option<string>> => {
  // we need the payment intent and user
  if (!user || !user.email) {
    throw createError({
      statusCode: 400,
      message: 'Missing payment intent AND / OR user',
    });
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
      unit_amount: amount,
      currency: 'gbp',
      quantity: 1,
    });
    const finalizedInvoice: Stripe.Response<Stripe.Invoice> =
        await stripe.invoices.finalizeInvoice(invoice.id, {
          auto_advance: true,
        }),
      paymentIntentId = finalizedInvoice?.payment_intent;

    if (!paymentIntentId) {
      throw createError({
        statusCode: 500,
        message: 'Failed to finalize invoice',
      });
    }

    let paymentIntent: Stripe.PaymentIntent;

    // if the payment intent is not a string, we need to cancel the flow
    if (typeof paymentIntentId !== 'string') return none();

    // if the payment intent is a string, we need to update it
    await stripe.paymentIntents.retrieve(paymentIntentId);

    // update the payment intent with the new payment intent id
    paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        email: user?.email,
        amount: amount,
      },
      receipt_email: user?.email,
    });

    if (!paymentIntent.client_secret)
      throw createError({
        statusCode: 500,
        message: 'Failed to create payment intent',
      });

    // if we have the client secret, we can return it
    return some(paymentIntent.client_secret);
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
