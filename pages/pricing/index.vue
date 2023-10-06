<template>
  <div 
    class="
      text-white h-full lg:h-screen w-full flex flex-col gap-y-12
      justify-center items-center bg-white/95 inside-container
    "
  >
    <div class="flex flex-col items-center gap-y-3 text-black">
      <h6 class="bg-gray-200 px-4 py-2 rounded-xl text-xs text-dark-purple">
        Pricing
      </h6>
      <h1 class="text-5xl font-bold text-dark-purple">
        Plans Available
      </h1>
    </div>
    <div 
      class="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5 
        w-5/6 xl:w-[65%] items-end h-full lg:h-3/4
      "
    >
      <PaymentCard 
        v-for="(item, index) in itemOptions"
        :key="index"
        :title="item.name"
        :planType="item.planType"
        :shortDescription="item.shortDescription" 
        :price="item.price"
        :bulletPoints="item.bulletPoints"
        :mostPopular="item.mostPopular"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
// as on the store this is a ref, we need to use 
// storeToRefs to get the value
const { currentUser } = storeToRefs(userStore);

const userEmail = ref<string>("");
const currentUserSignedIn = currentUser?.value?.email;

const errorOccurred = ref<boolean>(false);

interface ItemOptions {
  name: string;
  planType: string;
  price: number;
  shortDescription?: string;
  bulletPoints: string[];
  mostPopular?: boolean;
}

const itemOptions: ItemOptions[] = [
  {
    name: "Single Purchase",
    planType: "single",
    price: 199,
    shortDescription: "1 Time Purchase",
    // bulletPoints: [
    //   "Allows for 1 Address QR code to be generated.",
    //   "Unlimited uses.",
    //   "Can only be used to generate home address - not custom information."
    // ],
    bulletPoints: [
      "test bullet point 1",
      "test bullet point 2",
      "test bullet point 3",
      "test bullet point 4"
    ]
  },
  {
    name: "Monthly ",
    planType: "monthly",
    price: 499,
    shortDescription: "Monthly Subscription with unlimited QR code generation",
    // bulletPoints: [
    //   "ALL single time purchase features.",
    //   "Allows for multiple Address QR codes to be generated.",
    //   "Can be used unlimited times.",
    //   "Can track all orders from the dashboard for the month.",
    //   "Can generate QR codes with custom information."
    // ],,
    bulletPoints: [
      "test bullet point 1",
      "test bullet point 2",
      "test bullet point 3",
      "test bullet point 4"
    ],
    mostPopular: true
  },
  {
    name: "Yearly",
    planType: "yearly",
    price: 699,
    shortDescription: "Yearly Subscription with unlimited QR code generation",
    // bulletPoints: [
    //   "ALL single time purchase and monthly subscription features",
    //   "Allows for multiple Address QR codes to be generated.",
    //   "Can be used Unlimited times.",
    //   "A detailed breakdown on all orders for the year."
    // ],
    bulletPoints: [
      "test bullet point 1",
      "test bullet point 2",
      "test bullet point 3",
      "test bullet point 4"
    ]
  },
];

onMounted(() => {
  if(currentUserSignedIn)
    userEmail.value = currentUserSignedIn;
    
  const urlParams = new URLSearchParams(window.location.search);

  if(urlParams.has('error'))
    errorOccurred.value = true;
})
</script>
