<template>
  <div
    class="w-full h-screen flex flex-col gap-y-4 justify-center items-center bg-dark-black"
  >
    <h1 class="text-3xl font-bold text-white">Login</h1>
    <form
      @submit.prevent="handleLogin()"
      class="flex flex-col gap-y-6 w-56 justify-center items-center text-white"
    >
      <div class="relative">
        <input
          data-cy="email-field"
          type="text"
          v-model="email"
          class="input-dark !bg-transparent peer placeholder-transparent"
          placeholder="hello@example.com"
          name="email"
          autocomplete="on"
        />
        <label
          for="email"
          class="floating-label"
        >
          Email
        </label>
      </div>
      <div class="relative">
        <input
          data-cy="password-field"
          type="password"
          v-model="password"
          placeholder="password"
          autocomplete="on"
          class="input-dark !bg-transparent peer placeholder-transparent"
          name="password"
        />
        <label
          for="password"
          class="floating-label"
        >
          Password
        </label>
      </div>
      <input
        class="py-2 bg-white text-black w-full rounded hover:cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        data-cy="submit-btn"
        type="submit"
        :value="loading ? 'Loading...' : 'Submit'"
        :disabled="!validEmail"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore';
import { getAuth } from 'firebase/auth';
const userStore = useUserStore();
const email = ref<string>('');
const password = ref<string>('');
const loading = ref<boolean>(false);
const handleLogin = async () => {
  if (!email.value || !password.value) return;
  // if we have a user, sign them out
  if (getAuth().currentUser) await userStore.signOutUser();
  try {
    // use the login method from the userStore
    await userStore.userLoginIn(email.value, password.value);
    // if we have a user, redirect them to the dashboard
    if (getAuth().currentUser) {
      await useRouter().push({
        path: '/pricing',
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const validEmail = computed<boolean>(() => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(email.value);
});
</script>
