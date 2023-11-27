export type FirebaseDatabaseUser = {
    email: string;
    uid?: string;
    subscription?: {
      paymentEmail: string;
      transactionId: string;
      planType: string | number;
      subscriptionActive: boolean;
      dateOfPurchase: string;
    };
};
