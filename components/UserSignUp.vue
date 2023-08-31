<template>
  <div class="w-full h-screen flex flex-col justify-center items-center">
    <form
      @submit.prevent="handleRegistration()"
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
        <label for="email" class="floating-label"> Email </label>
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
        <label for="password" class="floating-label"> Password </label>
      </div>
      <input
        class="
            py-2 bg-white text-black w-full rounded 
            hover:cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed
        "
        data-cy="submit-btn"
        type="submit"
        :value="loading ? 'Loading...' : 'Submit'"
        :disabled="!validEmail || validPassword"
      />
    </form>

    <div v-if="error" data-cy="error-field" class="text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth } from "firebase/auth"
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/userStore";

const email = ref<string>("")
const password = ref<string>("")
const error = ref<boolean>(false)
const errorMessage = ref<string>("")

const userStore = useUserStore()
const currentUser = storeToRefs(userStore)
const { resetUser } = userStore

const validEmail = computed<boolean>(() => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(email.value)
});

const validPassword = computed<boolean>(() => {
  return password.value.length < 8
});

const loading = ref<boolean>(false);

const handleRegistration = async () => {
  // 100% clear out the current user on the sign up page, 
  // we do this in 'app.vue' on 'sign-up' route change
  // this is just to triple check
  if(currentUser)
    resetUser()

  loading.value = true;

  // Show loading spinner for a minimum of 2 seconds
  const signUpPromise = useFirebaseSignUp(email.value, password.value)

  // Set a minimum timeout of 2 seconds
  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000))

  // Wait for both the timeout and sign-up promise to complete
  await Promise.all([timeoutPromise, signUpPromise])

  const signUpResult = await signUpPromise

  // Check if sign-up was successful or not
  // sign up result will be true if successful, otherwise the error message as string
  if (signUpResult !== true) {
    error.value = true
    errorMessage.value = signUpResult as string
  } else
    navigateTo("/subscribe")

  //reset the loading state
  loading.value = false
}
</script>
