import Stripe from 'stripe';
import type { RuntimeConfig } from 'nuxt/schema';
import type { User } from '~/types/User';

export default defineEventHandler(async () => {
  const { private: config }: RuntimeConfig = useRuntimeConfig();

  // create a new stripe instance
  const stripe: Stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2023-08-16',
    typescript: true,
  });

  const listAllStripeProducts = async (): Promise<
    Record<'products', Stripe.Product[]> | undefined
  > => {
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
  return await listAllStripeProducts();
});
