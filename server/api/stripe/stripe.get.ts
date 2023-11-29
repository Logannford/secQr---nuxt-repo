import Stripe from 'stripe';
import type { RuntimeConfig } from 'nuxt/schema';

export default defineEventHandler(async (event) => {
	const { private: config }: RuntimeConfig = useRuntimeConfig();

	// params that come from the front end (request body)
	const params = await readBody(event);
	const transactionId = params.transactionID;  
	// create a new stripe instance
	const stripe: Stripe = new Stripe(config.stripeSecretKey, {
			apiVersion: '2023-08-16',
	});

	// we need a stripe instance and the transactionID to continue
	if(!stripe || !transactionId)
			return;
	
	const transactionDetails = await stripe.issuing.transactions.retrieve(
			transactionId
	)

	return transactionDetails;
})