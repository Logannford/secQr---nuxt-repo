import Stripe from 'stripe';

type StripeMetadata = {
  [key: string]: string;
};

type StripeDefaultPrice = {
  id: string;
  object: 'price';
  active: boolean;
  billingScheme: 'per_unit';
  created: number;
  currency: string;
  custom_unit_amount: number | null;
  livemode: boolean;
  lookup_key: string | null;
  metadata: [key: string];
  nickname: string | null;
  product: string;
  recurring: any;
  tax_behavior: 'exclusive' | 'inclusive' | 'unspecified';
  tiers_mode: string | null;
  transform_quantity: any;
  type: 'one_time' | 'recurring';
  unit_amount: number;
  unit_amount_decimal: string | null;
};

type StripeProductBase = Pick<
  Stripe.Product,
  'id' | 'metadata' | 'name' | 'description'
>;

export interface StripeProduct extends StripeProductBase {
  default_price: StripeDefaultPrice;
  metadata: StripeMetadata;
}
