<template>
  <div class="h-full">
    <div class="flex flex-col gap-y-10 h-full justify-evenly">
      <div class="flex flex-col gap-y-3">
        <h1 class="text-7xl font-bold">No Domain Needed!</h1>
        <div class="flex flex-col gap-y-2">
          <span>
            🤔 Forget about the hassle and cost of domain registration. <br />
          </span>
          <span>
            ✅ With our platform, your website is hosted instantly, with us.
          </span>
          <span> 💰 Saving you time, money, and stress. </span>
        </div>
      </div>

      <!-- 
        the '/your-business' could have companies that pay to 
        advertise put their?
        -->
      <vue-typewriter-effect
        class="!text-2xl !font-bold"
        auto-start
        :speed="10"
        :cursor-type="'|'"
        :cursor-color="'#7e6161'"
        :delay="100"
        :strings="['www.secqr.com/your-business']"
      ></vue-typewriter-effect>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueTypewriterEffect from 'vue-typewriter-effect';
</script>
