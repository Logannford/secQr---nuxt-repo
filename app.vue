<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia'

const currentUser = useUserStore().currentUser
 
onMounted(() => {
  if(!currentUser)
    return
  console.log(currentUser);
})

</script>