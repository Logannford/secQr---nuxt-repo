import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  // get the params from the request body
  const params = await readBody(event)
  return params
});
