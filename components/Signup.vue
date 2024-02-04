<template>
  <form
    @submit.prevent="handleRegistration()"
    class="flex flex-col gap-y-8 bg-white/5 rounded-xl p-5 w-96"
  >
    <h3 class="text-3xl font-bold flex justify-center w-full">
      Create an account
    </h3>

    <!-- input area-->
    <div class="flex flex-col gap-y-8">
      <div class="flex flex-col gap-y-4">
        <UFormGroup label="Email Address">
          <UInput
            v-model="email"
            icon="i-heroicons-envelope"
            padding="md"
            placeholder="welcome@secqr.com"
            type="text"
            :valid="!validEmail"
            :errorMessage="validEmail ? 'Invalid email' : ''"
          />
        </UFormGroup>
        <UFormGroup label="Password">
          <UInput
            v-model="password"
            placeholder="Password"
            icon="i-heroicons-lock-closed"
            padding="md"
            type="password"
            :valid="!validPassword"
            :errorMessage="
              validPassword ? 'Password must be at least 8 characters' : ''
            "
          />
        </UFormGroup>
      </div>

      <div class="flex flex-col gap-y-4">
        <UButton
          :loading="loading"
          :disabled="!validEmail || validPassword"
          label="Sign Up"
          type="submit"
          class="!text-black justify-center"
        />
        <UDivider label="OR" />
        <!-- already have an account? -->
        <div class="flex justify-center hover:!underline !duration-300">
          <ULink
            to="/login"
            class="!text-white !font-thin !text-xs"
          >
            Already have an account?
          </ULink>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores/userStore';

const email = ref<string>('');
const password = ref<string>('');
const error = ref<boolean>(false);
const errorMessage = ref<string>('');
const route = useRouter();

const userStore = useUserStore();
const currentUser = storeToRefs(userStore);
const { resetUser, userSignUp } = userStore;

const validEmail = computed<boolean>(() => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(email.value);
});

const validPassword = computed<boolean>(() => {
  return password.value.length < 8;
});

const loading = ref<boolean>(false);
const handleRegistration = async () => {
  // 100% clear out the current user on the sign up page,
  // we do this in 'app.vue' on 'sign-up' route change
  // this is just to triple check
  if (currentUser) resetUser();

  loading.value = true;

  // Show loading spinner for a minimum of 2 seconds
  const signUp = await userSignUp(email.value, password.value);

  // Set a minimum timeout of 2 seconds
  //const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000));

  // Wait for both the timeout and sign-up promise to complete
  //await Promise.all([timeoutPromise, signUpPromise]);

  // Check if sign-up was successful or not
  // sign up result will be true if successful, otherwise the error message as string
  if (signUp !== true) {
    error.value = true;
    errorMessage.value = signUp as string;
  } else
    route.push({
      path: 'pricing',
      force: true,
      replace: false,
    });

  //reset the loading state
  loading.value = false;
};
</script>
