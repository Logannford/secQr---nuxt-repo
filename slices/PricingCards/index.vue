<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div
      class="text-dark-purple h-full lg:h-screen w-full flex flex-col gap-y-12 justify-center items-center bg-white/95 inside-container"
    >
      <div class="flex flex-col items-center gap-y-3">
        <h6
          v-if="slice?.primary?.chiptext[0]?.type === 'paragraph'"
          class="bg-gray-200 px-4 py-2 rounded-xl text-xs"
        >
          {{ slice?.primary?.chiptext[0]?.text }}
        </h6>
        <h1
          v-if="slice?.primary?.pricing_title[0]?.type === 'paragraph'"
          class="text-5xl font-bold"
        >
          {{ slice?.primary?.pricing_title[0]?.text }}
        </h1>
      </div>
      <div v-if="loading">Loading...</div>
      <div
        v-else
        class="flex flex-col gap-y-10"
      >
        <div
          v-for="product in productList"
          class="whitespace-pre"
        >
          {{ JSON.stringify(product, null, 2) ?? 'No products' }}
        </div>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5 w-[65%] items-end h-max"
        v-if="!loading"
      >
        <div v-for="(product, index) in productList">
          <PaymentCard
            v-if="product.default_price.unit_amount"
            :key="product.id"
            :title="product.name"
            :planType="product.metadata?.planType"
            :shortDescription="product?.description"
            :price="product?.default_price?.unit_amount"
            :mostPopular="product?.metadata?.mostPopular"
            :bulletPoints="product?.features"
            :index="index"
            @modalValues="destruct"
          />
        </div>
      </div>
    </div>
    <UModal
      v-model="isOpen"
      :ui="{
        background: 'dark:!bg-white',
      }"
    >
      <PaymentPricingModal
        :paymentPlan="paymentPlan"
        @modalState="modalState"
        class="bg-white"
      />
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { type Content } from '@prismicio/client';
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
const paymentPlan = ref('');
const loading = ref(false);

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

    // extract only the data we need from the products we get returned back from the stripe api
    const extractedProducts = products.map(
      (product: Stripe.Product): StripeProduct => {
        // if there is no product or no default price then return
        if (!product || !product.default_price || !product.id) return;
        return {
          id: product?.id,
          name: product?.name,
          description: product?.description,
          default_price: product?.default_price?.unit_amount,
          metadata: product?.metadata,
          features: product?.features.map((feature) => feature?.name),
        };
      }
    );

    productList.value = extractedProducts;

    loading.value = false;
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});

/**
 *
 * {
 *  id: string;
 *  name: string;
 *  description: string | null;
 *  default_price: string | Stripe.Price | null | undefined;
 *  metadata: Stripe.Metadata;
 *  features: string[];
 * }
 *
 * {
 *  default_price:
 *    {
 *      id: string;
 *      object: "price";
 *      active: boolean;
 *      billing_scheme: BillingScheme;
 *      created: number;
 *      currency: string;
 *      currency_options?:
 *        {
 *          [key: string]: CurrencyOptions;
 *        } | undefined; ... 14 more ...;
 *      unit_amount_decimal: string | null;
 *    }; ... 4 more ...; metadata: Metadata;
 * }
 */
</script>
