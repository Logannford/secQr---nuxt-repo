<template>
  <div class="text-white">
    <form @submit.prevent="stripeTest">
      <input
        type="hidden"
        name="lookup_key"
        value="price_1NkT0nIkd2lyiipNx9owdIQF"
      />
      <input type="hidden" name="customer_id" :value="currentUser?.uid" />
      <button type="submit" class="text-black bg-white rounded px-4 py-2">
        Test btn
      </button>
    </form>
    <div class="p-10 rounded">
      <div class="w-full bg-white p-10">
        <div ref="stripeElementMount"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia';
import { loadStripe } from '@stripe/stripe-js';

// stripe-js is a dependency of @stripe/stripe-js
const stripe = await loadStripe(useRuntimeConfig().public.stripePublicKey);

interface StripeResponse {
  email: string;
  paymentPrice: number;
  invoice: string;
}

const userStore = useUserStore()
// as on the store this is a ref, we need to use 
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);

const stripeElementMount = ref<HTMLDivElement | null>(null);
const stripeElements = ref();
const clientSecret = ref<string>();

const stripeTest = async (): Promise<void | Error> => {
  // get the email out of the currentUser ref
  const currentUserEmail = currentUser?.value?.email;

  // we need the user email address, for now we'll just throw an error
  if (!currentUserEmail){
    throw createError({
      statusCode: 400,
      message: 'No user email address found',
    });
  }

  // create a form data object to pass to the api
  const formData = new FormData();  
  formData.append('customerEmail', currentUserEmail);
  
  try{
    const stripeResponse = await useFetch<StripeResponse>('/api/subscribe', {
      method: 'POST',
      body: {
        customerEmail: currentUserEmail
      }
    });

    const {
      email,
      paymentPrice,
      invoice
    } = await stripeResponse?.data?.value;


    clientSecret.value = invoice;

  }   
  catch(err){
    throw createError({
      statusCode: 400,
      message: 'Error creating stripe payment',
    });
  };

  try {
    if(!stripe)
      throw createError({
        statusCode: 400,
        message: 'Error creating stripe elements',
      });

      stripeElements.value = stripe.elements({
        clientSecret: clientSecret.value,
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

  // mount the payment element to the DOM
  const paymentElements = stripeElements.value.create('payment');
  paymentElements.mount(stripeElementMount.value);
};

</script>
