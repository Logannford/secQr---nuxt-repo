import type { Option } from '~/types/Option';

export type StripeResponse = {
  paymentPrice: number;
  invoice: Option<string>;
};
