<template>
    <nav class="text-white">
        <ul class="flex gap-x-4">
            <li
                v-for="(item, index) in navItems"
            >
                <NuxtLink>
                    {{ item.child_name[0].text }}
                </NuxtLink>    
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">

const { client } = usePrismic();

const { data: nav } = useAsyncData(() => client.getByType("global_nav"));

const navItems = computed(() => {
    return nav.value.results[0].data.slices[0].items;
})

onMounted(() => {
    console.log(nav.value.results[0].data.slices[0].items);
})

</script>