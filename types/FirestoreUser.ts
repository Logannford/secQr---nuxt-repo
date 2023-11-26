export type FirebaseDatabaseUser = {
    email: string;
    uid?: string;
    subscription?: {
      paymentEmail: string;
      planType: string | number;
      subscriptionActive: boolean;
      dateOfPurchase: string;
    };
};
