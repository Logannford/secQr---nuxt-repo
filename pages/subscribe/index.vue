<template>
  <div class="text-white h-screen w-full flex justify-center items-center">
    <form 
      @submit.prevent="userStripeDetails()"
      class="flex flex-col justify-center gap-y-1"
    > 
      <div 
        v-if="errorOccurred"
        class=""
      >
        An error has occurred, please try again.
      </div>
      <input
        v-if="!currentUserSignedIn"
        type="text"
        v-model="userEmail"
        class="text-black bg-white rounded px-4 py-2"
      />
      <button 
        type="submit" 
        class="text-black bg-white rounded px-4 py-2"
      >
        <span v-if="loading">
          Loading..
        </span>
        <span v-else>
          {{ currentUserSignedIn ? 'Already signed in: ' : '' }}Go to payment
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia';

const route = useRouter();

const loading = ref<boolean>(false);

const userStore = useUserStore()
// as on the store this is a ref, we need to use 
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);

const userEmail = ref<string>("");
const currentUserSignedIn = currentUser?.value?.email;

if(currentUserSignedIn)
  userEmail.value = currentUserSignedIn;

const errorOccurred = ref<boolean>(false);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);

  if(urlParams.has('error'))
    errorOccurred.value = true;
})

const userStripeDetails = async (): Promise<void | Error> => {
  loading.value = true;

  // force at least a second delay for loading
  const res = new Promise((res) => setTimeout(res, 1000));
  await res;

    route.push({
      path: `/subscribe/payment`,
      query: {
        customerEmail: userEmail.value,
      },
  }); 
  loading.value = false;
};

</script>
