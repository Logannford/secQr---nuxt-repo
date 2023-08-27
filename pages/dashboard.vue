<template>
    <div>
        <NuxtLink to="/test" class="text-white">test</NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth'
 
const user = useFirebaseUser();

onMounted(() => {
    console.log(getAuth().currentUser);
})

</script>