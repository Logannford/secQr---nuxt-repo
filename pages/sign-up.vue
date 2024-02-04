<template>
  <div class="flex h-full gap-x-20 items-center justify-center text-white">
    <!-- signup page content wrapper -->
    <div class="flex flex-col gap-y-8 min-w-[711px] max-h-[316px]">
      <div
        class="flex flex-col gap-y-3"
        v-if="!featureClicked"
      >
        <h1 class="text-xl md:text-3xl lg:text-5xl xl:text-7xl font-bold">
          Starting your online <br />
          journey has never been <br />
          easier.
        </h1>
        <span>
          Everything you need to kickstart your business, in one application.
        </span>
      </div>
      <!-- if a button has been clicked, this is where the component is shown -->
      <div
        v-else
        class="flex flex-col gap-y-3 h-[252px]"
      >
        <NoDomainNeeded v-if="selectedFeature === 'NoDomainNeeded'" />
        <PageBuilder v-if="selectedFeature === 'PageBuilder'" />
        <SelfHosting v-if="selectedFeature === 'SelfHosting'" />
        <AIAssistance v-if="selectedFeature === 'AIAssistance'" />
        <Analytics v-if="selectedFeature === 'Analytics'" />
      </div>
      {{ selectedFeature }}
      <!-- what we have to offer carousel / buttons -->
      <div class="max-w-[44rem]">
        <NuxtMarquee
          class=""
          :speed="50"
          pause-on-hover
        >
          <UButton
            v-for="feature in features"
            :key="feature.id"
            :label="feature.label"
            class="!mx-5"
            @click="handleFeatureClick(feature.component)"
            :class="{
              '!bg-light-purple': selectedFeature === feature.component,
            }"
          />
        </NuxtMarquee>
      </div>
    </div>
    <!-- sign up page component -->
    <Signup />
  </div>
</template>

<script setup lang="ts">
const featureClicked = ref<boolean>(false);
const selectedFeature = ref<string>('');
const features = [
  {
    id: 1,
    label: 'No domain needed',
    slug: 'no-domain-needed',
    component: 'NoDomainNeeded',
    description: 'Get started with a free subdomain and no upfront costs.',
    icon: 'domain',
  },
  {
    id: 2,
    label: 'Page Builder',
    slug: 'page-builder',
    component: 'PageBuilder',
    description:
      'Create beautiful, responsive websites with our drag and drop builder.',
    icon: 'page',
  },
  {
    id: 3,
    label: 'Self Hosting',
    slug: 'self-hosting',
    component: 'SelfHosting',
    description:
      'Host your website on your own server, or use our hosting service.',
    icon: 'server',
  },
  {
    id: 4,
    label: 'AI assistance',
    slug: 'ai-assistance',
    component: 'AIAssistance',
    description: 'Get help from our AI to build your website.',
    icon: 'robot',
  },
  {
    id: 5,
    label: 'Analytics',
    slug: 'analytics',
    component: 'Analytics',
    description:
      'Track your website traffic and user behavior with our analytics tools.',
    icon: 'analytics',
  },
];

const handleFeatureClick = (feature: string) => {
  // if the same feature has been clicked, then close it
  if (featureClicked.value && feature === selectedFeature.value) {
    featureClicked.value = false;
    selectedFeature.value = '';
    return;
  }

  featureClicked.value = true;
  selectedFeature.value = feature;
};
</script>
