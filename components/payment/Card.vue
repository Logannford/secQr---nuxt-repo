<template>
  <form
    class="rounded-xl bg-white text-dark-black w-full shadow-lg shadow-gray-300 overflow-hidden duration-300"
    @submit.prevent="userStripeDetails()"
    :class="[
      cardProps.mostPopular 
        ? 'border-4 border-light-purple h-full'
        : 'border border-gray-400 h-full lg:h-[95%] hover:h-full',
      cardProps.index === 2
        ? 'col-span-full lg:col-span-1'
        : 'col-span-1',
    ]"
  >
    <div
      class="
        flex flex-col items-center 
        text-center h-full relative overflow-hidden
      "
    > 
      <div v-if="cardProps.mostPopular" class="w-full h-[5%] bg-light-purple text-white">
        Most popular
      </div>
      <div class="p-8 inside-container flex flex-col items-center text-center h-full">
        <div class="rounded w-14 h-14">
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
              <ul class="text-start mt-10 flex flex-col gap-y-3 text-sm">
                  <li 
                      v-for="(items, index) in bulletPoints" 
                      :key="index"
                      class="flex gap-x-2"
                  >
                    <div class="w-4 h-4 bg-secqr-purple-500 flex p-1 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                      </svg>
                    </div>
                    <span>
                      {{ items }}
                    </span>
                  </li>
              </ul>
          </div>
          <div class="flex flex-col gap-y-4">
              <div class="text-2xl font-bold">
                  £{{ (price / 100) }}
              </div>
              <ElementButton type="submit" :disabled="loading" size="medium" intent="primary">
                  {{ loading ? 'Loading...' : 'Start now' }}
              </ElementButton>
          </div>
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
  mostPopular?: boolean;
  index: number
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
