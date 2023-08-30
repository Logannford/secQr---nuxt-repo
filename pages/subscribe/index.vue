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
    {{ test }}
  </div>
</template>

<script setup lang="ts">
import { User } from "firebase/auth"
import { useUserStore } from "~/stores/userStore"

// @ts-ignore
const { currentUser } = useUserStore()

interface ApiResponse {
  data: {
    message: string;
  };
  pending: boolean;
  error: any;
  status: string;
}

const test = ref<ApiResponse>() 

const stripeTest = async (): Promise<void> => {
  await useFetch<ApiResponse>('/api/subscribe', {
    method: 'POST',
    body: {
      message: 'hello'
    }
  })
  .then((response: unknown) => {
    test.value = response as ApiResponse
  })
  .catch(error => {
    console.error(error)
  })
};

</script>
