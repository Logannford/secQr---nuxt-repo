const { private: config } = useRuntimeConfig();

export const useStripe = async(transactionId: string): Promise<any> => {
	if(!transactionId)
		return;
	const stripeInstance = await useFetch('/api/stripe/stripe', {
		method: 'GET',
		body: {
				transactionID: transactionId
		}
	})

	return stripeInstance;
}