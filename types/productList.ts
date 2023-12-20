import Stripe from 'stripe';

type StripeMetadata = {
  [key: string]: string;
};

type StripeProductBase = Pick<
  Stripe.Product,
  'id' | 'metadata' | 'name' | 'description' | 'features'
>;

export interface StripeProduct extends StripeProductBase {
  default_price: Stripe.Price;
  metadata: StripeMetadata;
}
