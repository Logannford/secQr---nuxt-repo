<template>
  <div class="text-white">
    <form @submit.prevent="stripeTest">
      <input
        type="hidden"
        name="lookup_key"
        value="price_1NkT0nIkd2lyiipNx9owdIQF"
      />
      <input type="hidden" name="customer_id" :value="currentUser" />
      <button type="submit" class="text-black bg-white rounded px-4 py-2">
        Test btn
      </button>
    </form>
    <div ref="stripePaymentsElements"></div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia';
import Stripe from 'stripe';

interface StripeResponse {
  paymentEmail: string;
  paymentPrice: number;
  paymentClientSecret: string;
}

const userStore = useUserStore()
// as on the store this is a ref, we need to use 
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);

let stripeElements;

const stripeTest = async (): Promise<void | Error> => {
  console.log('first')


  const config = useRuntimeConfig();

  // create a new stripe instance for the elements
  const stripe = new Stripe('sk_test_51NkSBxIkd2lyiipNYgXjMIo00yWmxdWBBzHOOEgUDjEIFD1boaZegULaJGFnL9YRFr0ID61Km6GE2XYwvdG3IdcC00iES1k5TF', {
    apiVersion: '2023-08-16',
  });

  console.log('second')

  // get the email out of the currentUser ref
  const currentUserEmail = currentUser?.value?.email;

  // we need the user email address, for now we'll just throw an error
  if (!currentUserEmail){
    throw createError({
      statusCode: 400,
      message: 'No user email address found',
    });
  }

  console.log('third')

  // create a form data object to pass to the api
  const formData = new FormData();  
  formData.append('customerEmail', currentUserEmail);
  
  try{
    const stripeResponse = await useFetch<StripeResponse | null>('/api/subscribe', {
      method: 'POST',
      body: {
        customerEmail: currentUserEmail
      }
    });

    console.log('fourth')

    const {
      paymentEmail,
      paymentPrice,
      paymentClientSecret
    } = await stripeResponse;
  }   
  catch(err){
    throw createError({
      statusCode: 400,
      message: 'Error creating stripe payment',
    });
  };

    try{
      stripeElements = stripe.elements({
        clientSecret: paymentClientSecret,
        appearance: {
          theme: 'stripe'
        }
      });
    }
    catch(err){
      throw createError({
        statusCode: 400,
        message: 'Error creating stripe elements',
      });
    }

    const paymentElements = stripeElements.create('payment');
    paymentElements.mount(ref.stripePaymentsElements)
};

</script>
