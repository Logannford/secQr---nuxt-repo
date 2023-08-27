<template>
    <div>
        <NuxtLink to="/dashboard" class="text-white">Dashboard</NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
 
onMounted(() => {
  console.log(useUserStore().currentUser); 
})

</script>