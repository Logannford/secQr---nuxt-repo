<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div
      class="text-dark-purple h-full lg:h-screen w-full flex flex-col gap-y-12 justify-center items-center bg-white/95 inside-container"
    >
      <div class="flex flex-col items-center gap-y-3">
        <h6 class="bg-gray-200 px-4 py-2 rounded-xl text-xs">
          {{ slice?.primary?.chiptext[0]?.text }}
        </h6>
        <h1 class="text-5xl font-bold">
          {{ slice?.primary?.pricing_title[0]?.text }}
        </h1>
      </div>
      <!-- <div v-if="loading">Loading...</div>
      <div
        v-else
        class="flex flex-col gap-y-10"
      >
        <div v-for="product in productList">
          {{ product ?? 'No products' }}
        </div>
      </div> -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5 w-5/6 xl:w-[65%] items-end h-full lg:h-3/4"
      >
        <PaymentCard
          v-for="(product, index) in productList"
          :key="product.id"
          :title="product.name"
          :planType="product.metadata?.planType"
          :shortDescription="product?.description"
          :price="product?.default_price?.unit_amount ?? 0"
          :mostPopular="product?.metadata?.mostPopular"
          :bulletPoints="product?.features"
          :index="index"
          @modalValues="destruct"
        />
      </div>
    </div>
    <UModal
      v-model="isOpen"
      :ui="{
        background: 'dark:!bg-white',
      }"
    >
      <PaymentPricingModal
        :paymentPlan="paymentPlan ?? null"
        @modalState="modalState"
        class="bg-white"
      />
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { type Content } from '@prismicio/client';
import type { features } from 'process';
import Stripe from 'stripe';
import type { StripeProduct } from '~/types/productList';

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.PricingCardsSlice>([
    'slice',
    'index',
    'slices',
    'context',
  ])
);

const isOpen = ref(false);
const paymentPlan = ref<string>();
const loading = ref<boolean>(false);

const destruct = ({ plan, open }: { plan: string; open: boolean }) => {
  isOpen.value = open;
  paymentPlan.value = plan;
};

const modalState = (modalState: boolean) => {
  isOpen.value = modalState;
};

const productList = ref<StripeProduct[]>([]);

onMounted(async () => {
  try {
    loading.value = true;

    const response = await $fetch<{ products: Stripe.Product[] }>(
      '/api/stripe/stripeProducts',
      {
        method: 'GET',
      }
    );

    if (!response) return;

    const products = response.products;

    if (!products) return;

    const extractedProducts = products.map((product: Stripe.Product) => {
      return {
        id: product?.id,
        name: product?.name,
        description: product?.description,
        default_price: product?.default_price as Stripe.Price,
        metadata: product?.metadata,
        features: product?.features.map((feature) => feature?.name),
      };
    });

    // @ts-ignore - this is a valid type
    productList.value = extractedProducts;

    loading.value = false;
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
</script>
