import Stripe from 'stripe';
import type { RuntimeConfig } from 'nuxt/schema';

export default defineEventHandler(async () => {
  const { private: config }: RuntimeConfig = useRuntimeConfig();

  // create a new stripe instance
  const stripe: Stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2023-08-16',
    typescript: true,
  });

  const returnStripeProducts = async () => {
    // we need a stripe instance
    if (!stripe) return;

    const allProducts: Stripe.Response<Stripe.ApiList<Stripe.Product>> =
      await stripe.products.list({
        active: true,
        limit: 5,
        expand: ['data.default_price'],
      });

    return {
      products: allProducts.data,
    };
  };
  return await returnStripeProducts();
});
