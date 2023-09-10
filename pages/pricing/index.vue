<template>
  <div 
    class="
      text-white h-screen w-full flex flex-col gap-y-6
      justify-center items-center container bg-white/95
    "
  >
    <div class="flex flex-col items-center gap-y-3 text-black">
      <span class="bg-white/30 px-4 py-2 rounded-xl text-xs">
        Take back control of your online data
      </span>
      <h1 class="text-3xl">
        Pricing
      </h1>
    </div>
    <div 
      class="grid grid-cols-3 gap-x-3 w-3/4"
    >
      <PaymentCard 
        v-for="(item, index) in itemOptions"
        :key="index"
        :title="item.name"
        :planType="item.planType"
        :shortDescription="item.shortDescription"
        :price="item.price"
        :bulletPoints="item.bulletPoints"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
// as on the store this is a ref, we need to use 
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);

const userEmail = ref<string>("");
const currentUserSignedIn = currentUser?.value?.email;

if(currentUserSignedIn)
  userEmail.value = currentUserSignedIn;

const errorOccurred = ref<boolean>(false);

interface ItemOptions {
  name: string;
  planType: string;
  price: number;
  shortDescription?: string;
  bulletPoints: string[];
}

const itemOptions: ItemOptions[] = [
  {
    name: "Single Purchase",
    planType: "single",
    price: 200,
    shortDescription: "1 Time Purchase",
    bulletPoints: [
      "Allows for 1 Address QR code to be generated.",
      "Can be used once."
    ]
  },
  {
    name: "Monthly ",
    planType: "monthly",
    price: 500,
    shortDescription: "Monthly Subscription with unlimited QR code generation",
    bulletPoints: [
      "ALL single time purchase features",
      "Allows for multiple Address QR codes to be generated.",
      "Can be used unlimited times.",
      "Can track all orders from the dashboard for the month..",
    ]
  },
  {
    name: "Yearly",
    planType: "yearly",
    price: 700,
    shortDescription: "Yearly Subscription with unlimited QR code generation",
    bulletPoints: [
      "ALL single time purchase and monthly subscription features",
      "Allows for multiple Address QR codes to be generated.",
      "Can be used Unlimited times.",
      "A detailed breakdown on all orders for the year."
    ]
  },
];

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);

  if(urlParams.has('error'))
    errorOccurred.value = true;
})
</script>
