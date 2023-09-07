<template>
  <div class="">
    <div class="grid grid-cols-12 h-screen">
      <div class="bg-white col-span-8 border-r border-light-grey">
        <div class="flex flex-col gap-y-10 p-10">
          <div class="w-full flex justify-center">
            <h1 class="text-4xl">
              secQr
            </h1>
          </div>
          <div class="border border-gray-300 rounded p-3">
            <!-- account email -->
            <div class="flex gap-x-16 text-sm">
              <span>
                Contact
              </span>
              {{ currentUserEmail }}
            </div>
          </div>

          <!-- payment form -->
          <form
            class="w-full flex flex-col gap-y-10 h-full place-content-center"
            onsubmit="event.preventDefault()"
            @submit="handlePayment()"
          >
            <span class="text-black">Payment Details</span>
            <div class="border border-gray-300 p-5 rounded">
              <div v-if="loading" class="text-black w-full flex justify-center">
                <Spinner class="w-5 h-5" />
              </div>
              <!-- injected elements via stripe -->
              <div ref="stripeElementMount"></div>
            </div>

            <div class="w-full flex justify-between">
              <div>
                <NuxtLink to="/subscribe"> 
                  &lt Back 
                </NuxtLink>
              </div>

              <button class="bg-black rounded-lg text-white px-4 py-2" type="submit">
                <span v-if="paymentLoading"> 
                    <Spinner class="w-5 h-5" />
                </span>
                <div v-else class="flex gap-x-2 items-center"> 
                  <span>
                    Confirm 
                  </span>
                  <Spinner v-if="loading" class="w-4 h-5" />
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="text-black bg-white/95 col-span-4">
        <div class="p-5 w-full">
          <div class="flex justify-between items-center">
            <span>
              Total: 
            </span>
            <div class="flex gap-x-2 items-center">
              <span class="text-xs">
                GBP
              </span>
              <span class="text-2xl" v-if="!loading">
                 £{{ customerPaymentPrice ? customerPaymentPrice / 100 : '' }}
              </span>
              <Spinner v-else class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
const currentUserEmail = ref<string>();

onMounted(async () => {
  console.log("payment mounted");
  //start loading
  loading.value = true;

  currentUserEmail.value = new URLSearchParams(window.location.search).get(
    "customerEmail"
  ) as string | undefined;

  if (!currentUserEmail) {
    currentUserEmail.value = currentUser?.value?.email;
  }

  if (!currentUserEmail)
    throw createError({
      statusCode: 400,
      message: "Error getting user email",
    });

  console.log(currentUserEmail);

  try {
    const stripeResponse = await useFetch<StripeResponse>("/api/subscribe", {
      method: "POST",
      body: {
        customerEmail: currentUserEmail,
      },
    });

    console.log(stripeResponse?.data?.value);

    if (!stripeResponse?.data?.value) {
      router.push({
        path: "/subscribe",
        query: {
          error: "true",
        },
      });
      throw createError({
        statusCode: 400,
        message: "Error creating stripe payment",
      });
    }

    const { invoice, paymentEmail, paymentPrice } = await stripeResponse?.data
      ?.value;

    paymentIntentClientSecret.value = invoice;
    customerPaymentPrice.value = paymentPrice;

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

const handlePayment = async (): Promise<Error | void> => {
  paymentLoading.value = true;
  await stripe?.confirmPayment({
    elements: stripeElements.value,
    confirmParams: {
      return_url: `${window.location.origin}/subscribe/payment-success`,
      receipt_email: currentUserEmail.value,
    },
  });

  paymentLoading.value = false;
};
</script>
