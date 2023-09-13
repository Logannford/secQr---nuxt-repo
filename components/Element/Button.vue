<template>
    <button :class="button({ intent, size })">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button", {
  variants: {
    intent: {
      primary: "bg-white text-black px-6 py-2 rounded-lg border border-gray-400 hover:bg-light-purple/50 duration-300",
      secondary: "secondary",
    },
    size: {
      small: "small",
      medium: "medium",
    },
  },
  compoundVariants: [
    { intent: "primary", size: "medium", class: "primaryMedium" },
  ],
});

type ButtonProps = VariantProps<typeof button>;

withDefaults(
  defineProps<{ intent: ButtonProps["intent"]; size: ButtonProps["size"] }>(),
  {
    intent: "primary",
    size: "medium",
  }
);
</script>