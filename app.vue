<template>
  <NuxtLayout />
</template>

<script setup lang="ts">
/* 
  because this is a Single page application, onMounted will only run once
  we will need to watch the URL (route.path) to see if it changes when 
  we want to check certain things on page mount

  we will need to watch the route path and the auth state from the store
*/

import { useUserStore } from '~/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { currentUser } = storeToRefs(userStore);
const { resetUser } = userStore;
const userAuth = storeToRefs(userStore).userAuthState;
const route = useRoute();

watch(
  () => route.path,
  async () => {
    // reset the current user if they navigate to the sign up page
    if (route.path.startsWith('/sign-up')) {
      console.log('sign up page');
      resetUser();
    }

    if (!currentUser) return;
    console.log(currentUser.value);
  }
);

// need to create an 'init' method for auth on page mount
onMounted(async () => {
  userAuth.value = await useFirebaseAuth();

  //watch the userAuth state to show a toast
  watch(userAuth, (newValue) => {
    if (newValue) {
      useToast().add({
        title: userAuth.value,
        timeout: 5000000,
      });
    }
  });
  console.log(currentUser.value?.email);
  console.log('mounted');
});
</script>
