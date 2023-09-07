<template>
  <NuxtLink to="/subscribe" class="text-white">
      Back
  </NuxtLink>
  <form 
    class="w-full bg-light-black p-10 flex flex-col gap-y-10"
    onsubmit="event.preventDefault()"
    @submit="handlePayment()"
  >
    <h2 class="text-white">
      Payment Details
    </h2>
    <div v-if="loading" class="text-white w-full flex justify-center">
      loading..
    </div>
    <div ref="stripeElementMount"></div>

    <button 
      class="bg-white rounded text-black px-4 py-2"
      type="submit"
    >
      <span v-if="paymentLoading">
        loading...
      </span>
      <span v-else>
        Confirm £{{ customerPaymentPrice }}
      </span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { loadStripe } from "@stripe/stripe-js";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
import { StripeResponse } from "~/types/StripeResponse";

const stripe = await loadStripe(useRuntimeConfig().public.stripePublicKey);
const router = useRouter();

const loading = ref<boolean>(false);
const paymentLoading = ref<boolean>(false);

const userStore = useUserStore();
// as on the store this is a ref, we need to use
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);

const stripeElementMount = ref<HTMLDivElement | null>(null);
const stripeElements = ref();
const paymentIntentClientSecret = ref<string>();
const customerPaymentPrice = ref<number>();
let currentUserEmail = currentUser?.value?.email ?? null;

onMounted(async () => {
  console.log("payment mounted");
  //start loading
  loading.value = true;

  if (!currentUserEmail){
    currentUserEmail = new URLSearchParams(window.location.search).get(
      "customerEmail"
    );
  }

  try {
    const stripeResponse = await useFetch<StripeResponse>("/api/subscribe", {
      method: "POST",
      body: {
        customerEmail: currentUserEmail,
      },
    });

    console.log(stripeResponse?.data?.value)

    if (!stripeResponse?.data?.value){
      router.push({
        path: "/subscribe",
        query: {
          error: 'true'
        }
      });
      throw createError({
        statusCode: 400,
        message: "Error creating stripe payment",
      });
    }

    const { 
      invoice, 
      paymentEmail, 
      paymentPrice 
    } = await stripeResponse?.data?.value;

    paymentIntentClientSecret.value = invoice;
    customerPaymentPrice.value = paymentPrice;

    try {
      if (!stripe) 
        return;

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

const handlePayment = async() => {
  paymentLoading.value = true;
  try {
    const response = await stripe?.confirmPayment({
      elements: stripeElements.value,
      confirmParams: {
        return_url: `${window.location.origin}/subscribe/payment-success`,
      },
    });
  }catch(error: any){

  }

  paymentLoading.value = false;
}
</script>
