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
    {{ currentUser }}
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia';
import Stripe from 'stripe';

const userStore = useUserStore()
// as on the store this is a ref, we need to use 
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);

const stripeResponse = ref<Stripe.Customer>(); 

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

  await useFetch<Stripe.Customer>('/api/subscribe', {
    method: 'POST',
    body: formData
  })
  .then((response: unknown) => {
    stripeResponse.value = response as Stripe.Customer;
  })
  .catch(error => {
    console.error(error);
  })
};

</script>
