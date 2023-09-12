<template>
  <form
    class="border rounded-xl border-gray-400 bg-white text-dark-black w-full h-full"
    @submit.prevent="userStripeDetails()"
  >
    <div
      class="p-10 flex flex-col gap-y-4 items-center text-center h-full"
    >
      <div class="border rounded border-gray-400 w-10 h-10">
        <TestQr />
      </div>
      <div class="flex flex-col gap-y-2 h-full justify-between">
        <div class="flex flex-col gap-y-1">
            <h6 class="font-bold text-2xl">
            {{ cardProps.title }}
            </h6>
            <div>
            <p class="text-xs">
                {{ cardProps.shortDescription }}
            </p>
            </div>
            <ul class="text-start mt-6 flex flex-col gap-y-2">
                <li 
                    v-for="(items, index) in bulletPoints" 
                    :key="index"
                    class="list-disc"
                >
                    {{ items }}
                </li>
            </ul>
        </div>
        <div class="flex flex-col gap-y-1">
            <div class="text-2xl font-bold mt-10">
                £{{ (price / 100) }}
            </div>
            <Button type="submit" :disabled="loading" size="medium" intent="primary">
                {{ loading ? 'Loading...' : 'Buy Now' }}
            </Button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const cardProps = defineProps<{
  title: string;
  planType: string;
  price: number;
  shortDescription: string;
  bulletPoints: string[];
}>();

const route = useRouter();
const loading = ref<boolean>(false);

const { currentUser } = storeToRefs(userStore);

const currentUserSignedIn = currentUser?.value?.email;

const userStripeDetails = async (): Promise<void | Error> => {
  loading.value = true;

  // force at least a second delay for loading
  await new Promise((res) => setTimeout(res, 1000));

    route.push({
      path: `/pricing/payment`,
      query: {
        customerEmail: currentUserSignedIn,
        planType: cardProps.planType,
      },
    }); 
  loading.value = false;
};
</script>
