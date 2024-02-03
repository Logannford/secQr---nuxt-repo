<template>
  <nav class="text-black bg-white/95 shadow-black shadow-sm">
    <div
      class="flex item-center justify-between w-full container inside-container py-2"
    >
      <div class="flex gap-x-16 items-center">
        <div class="text-2xl font-bold">secQr</div>
        <ul class="flex gap-x-8 relative">
          <li
            v-for="(item, index) in topLevelNavItems"
            :key="`${item.id}`"
            :aria-haspopup="item.variation !== 'default'"
            class="font-bold flex gap-x-2 items-center group"
          >
            <a :href="item.primary.link?.slug">
              {{ item.primary.label }}
            </a>
            <div
              v-if="item.variation !== 'default'"
              class="w-3 h-3 group-hover:rotate-180 duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path
                  d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                />
              </svg>
            </div>
          </li>
        </ul>
      </div>
      <div class="flex gap-x-4">
        <UButton
          v-if="userAuthed"
          label="Log Out"
          class="!text-black !px-3 !py-2"
          @click="signOutUser()"
          variant="outline"
        />
        <UButton
          v-else
          label="Log In"
          class="!text-black"
          to="/login"
          variant="outline"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore';
import { storeToRefs } from 'pinia';

const { client } = usePrismic();
const { data: nav } = useAsyncData<any>(() => client.getByType('layout'));

const userStore = useUserStore();
const signOutUser = userStore.signOutUser;
const userAuthState = storeToRefs(userStore).userAuthState;

const userAuthed = computed(() => {
  return userAuthState.value === 'authed' ? true : false;
});

const dashboardLabel = computed(() => {
  return nav.value?.results[0]?.data?.dashboard_cta_label;
});

const topLevelNavItems = computed(() => {
  return nav.value?.results[0]?.data.slices;
});

const active = ref<number | boolean>(false);
const isMouseOver = ref<boolean>(false);

const handleMouseOver = (itemIndex: number) => {
  active.value = itemIndex;
  isMouseOver.value = true;
};

const handleMouseLeave = () => {
  isMouseOver.value = false;
  if (!isMouseOver.value && active.value) active.value = false;
};

onMounted(() => {
  console.log(userAuthed.value);
});

/*
  page: 1,
    results_per_page: 20,
    results_size: 1,
    total_results_size: 1,
    total_pages: 1,
    next_page: null,
    prev_page: null,
    results: [
      {
        id: 'ZRAVjBAAAB4AKpbj',
        uid: null,
        url: null,
        type: 'layout',
        href: 
          'https://anonaddress.cdn.prismic.io/api/v2/documents/search?ref=ZRAeYRAAACAAKqOF&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22ZRAVjBAAAB4AKpbj%22%29+%5D%5D',
        tags: [],
        first_publication_date: '2023-09-24T11:10:14+0000',
        last_publication_date: '2023-09-24T11:32:49+0000',
        slugs: [ 'layout' ],
        linked_documents: [],
        lang: 'en-gb',
        alternate_languages: [],
        data: {
          dashboard_cta_label: 'Dashboard',
          slices: [
            {
              variation: 'default',
              version: 'initial',
              items: [ {} ],
              primary: { label: 'Solutions', link: { link_type: 'Any' } },
              id: 'menu_item$974a4177-a8d9-462b-a3f8-6a0a5d29d248',
              slice_type: 'menu_item',
              slice_label: null
            },
            {
              variation: 'default',
              version: 'initial',
              items: [ {} ],
              primary: { label: 'Pricing', link: { link_type: 'Any' } },
              id: 'menu_item$7782ec34-9d33-4439-89fa-d0c99207ed46',
              slice_type: 'menu_item',
              slice_label: null
            },
            {
              variation: 'withSubMenu',
              version: 'initial',
              items: [ {} ],
              primary: {
                label: 'Company',
                sub_menu: {
                  id: 'ZRAYdBAAAB4AKpr_',
                  type: 'sub_menu',
                  tags: [ 'Navigation' ],
                  lang: 'en-gb',
                  slug: 'get-to-know-us',
                  first_publication_date: '2023-09-24T11:09:44+0000',
                  last_publication_date: '2023-09-24T11:09:44+0000',
                  uid: '1',
                  link_type: 'Document',
                  isBroken: false
                }
              },
              id: 'menu_item$e3dc0206-a7f7-461c-86a8-0d677fac3c12',
              slice_type: 'menu_item',
              slice_label: null
            },
            {
              variation: 'default',
              version: 'initial',
              items: [ {} ],
              primary: { label: 'Contact us', link: { link_type: 'Any' } },
              id: 'menu_item$3a7c9387-eda6-4bea-9604-9146be4980ba',
              slice_type: 'menu_item',
              slice_label: null
            }
          ]
        }
      }
    ],
    version: '3d2068b',
    license: 'All Rights Reserved'
  }
*/
</script>
