<template>
  <div>
    <form
      class="w-full flex flex-col gap-y-10 h-full place-content-center p-8"
      @submit.prevent="handlePayment()"
    >
      <span class="text-black"> Payment Details </span>
      <div class="border border-gray-300 p-5 rounded">
        <div v-if="loading" class="text-black w-full flex justify-center">
          <Spinner class="w-5 h-5" />
        </div>
        <!-- injected elements via stripe -->
        <div ref="stripeElementMount"></div>
      </div>

      <div class="w-full flex justify-between">
        <UButton
          class="flex gap-x-2 text-black items-center"
          @click.prevent="$emit('modalState', modalValue)"
          icon="i-octicon-chevron-left-24"
        >
          Back to Information
        </UButton>

        <button
          class="bg-black rounded-lg text-white px-4 py-2 disabled:opacity-50"
          type="submit"
          :disabled="loading || paymentLoading"
        >
          <span v-if="paymentLoading">
            <Spinner class="w-5 h-5" />
          </span>
          <div v-else class="flex gap-x-2 items-center">
            <span> Pay now </span>
            <Spinner v-if="loading" class="w-4 h-5" />
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { loadStripe } from "@stripe/stripe-js";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
import type { StripeResponse } from "~/types/StripeResponse";
import type { User } from "firebase/auth";

const stripe = await loadStripe(useRuntimeConfig().public.stripePublicKey);
const router = useRouter();

const loading = ref<boolean>(false);
const paymentLoading = ref<boolean>(false);

const userStore = useUserStore();
// as on the store this is a ref, we need to use
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);
const currentUserEmail = ref<String | null>(null);

const stripeElementMount = ref<HTMLDivElement | null>(null);
const stripeElements = ref();
const paymentIntentClientSecret = ref<string>();

const modalValue = ref<boolean>(false);

const paymentDetails = reactive({
  Email: currentUserEmail.value,
  Price: 0,
});

const props = defineProps<{
  paymentPlan: string | null;
}>();

onMounted(async () => {
  //start loading
  loading.value = true;

  // if there is nothing in the url, check the store
  if (!currentUserEmail.value && currentUser?.value?.email) {
    currentUserEmail.value = currentUser?.value?.email;
  }

  console.log(currentUserEmail.value);

  // if we still do not have the email, throw an error
  if (!currentUserEmail.value || !props.paymentPlan)
    throw createError({
      statusCode: 400,
      message: "Error getting user email AND OR payment plan",
    });

  try {
    const stripeResponse = await useFetch<StripeResponse>(
      "/api/stripe/subscribe",
      {
        method: "POST",
        body: {
          customerEmail: currentUserEmail.value,
          planType: props.paymentPlan ?? null,
        },
      }
    );

    if (!stripeResponse?.data?.value) {
      return await router.push({
        path: "/pricing",
        query: {
          error: "true",
        },
      });
    }

    const { invoice, paymentPrice } = stripeResponse?.data?.value;

    paymentIntentClientSecret.value = invoice;
    paymentDetails.Price = paymentPrice / 100;
    paymentDetails.Email = currentUserEmail.value;

    try {
      if (!stripe) return;

      stripeElements.value = stripe.elements({
        clientSecret: paymentIntentClientSecret.value,
        appearance: {
          theme: "stripe",
        },
      });
    } catch (err) {
      throw createError({
        statusCode: 400,
        message: "Error creating stripe elements",
      });
    }
  } catch (err) {
    throw createError({
      statusCode: 400,
      message: "Error creating stripe payment",
    });
  }

  //stop loading
  loading.value = false;

  // mount the payment element to the DOM
  const paymentElements = stripeElements.value.create("payment");
  paymentElements.mount(stripeElementMount.value);
});

const handlePayment = async (): Promise<void> => {
  paymentLoading.value = true;
  try {
    await stripe?.confirmPayment({
      elements: stripeElements.value,
      confirmParams: {
        return_url: `${window.location.origin}/pricing/payment-success`,
      },
    });
  } catch (err) {
    throw createError({
      statusCode: 400,
      message: "Error confirming payment",
    });
  }
  paymentLoading.value = false;
};
</script>
