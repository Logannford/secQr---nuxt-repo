<template>
    <nav class="text-black bg-white/95">
        <div class="flex items-center justify-between w-full container inside-container ">
            <div class="flex gap-x-16 items-center">
                <div class="text-2xl font-bold">
                    secQr
                </div>
                <ul class="flex gap-x-8 relative">
                    <li
                        v-for="(item, index) in navComponents"
                        :key="`navItem-${index}`"
                        :aria-haspopup="item.items.length > 0"
                        class="font-bold"
                        :class="{
                            'group' : item.items.length > 0,
                        }"
                    >
                        <button 
                            class="
                                flex items-center gap-x-2 hover:cursor-default
                                hover:text-purple-400 duration-300 py-4
                            "
                        >
                            <span>
                                {{ item.primary.name[0].text }}
                            </span>
                            <div 
                                v-if="item.items.length > 0"
                                class="w-3 h-3 group-hover:rotate-180 duration-300"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
                            </svg>
                            </div>
                        </button>    
                        <div 
                            v-if="item.items.length > 0"
                            class="
                                opacity-0 group-hover:opacity-100 absolute 
                                bg-white text-black top-12 rounded-lg
                                shadow-lg -translate-x-[20%] duration-300
                                w-max
                            "
                        >
                            <div class="grid grid-cols-2 gap-x-5">
                                <div class="flex flex-col gap-y-6 p-8">
                                    <span class="font-bold text-xs uppercase leading-tight">
                                        Get to know us 
                                    </span>
                                    <ul class="grid grid-cols-2 grid-rows-4 gap-y-3 gap-x-10">
                                        <li 
                                            v-for="(subItems, index) in item.items"
                                            :key="`subItems-${index}`"
                                            class="text-sm"
                                        >
                                            <NuxtLink 
                                                :to="subItems.child_link?.url"
                                                class="flex gap-x-2.5 items-center"
                                            >
                                                <img 
                                                    v-if="subItems.child_item_img?.url" 
                                                    :src="subItems.child_item_img?.url" 
                                                    class="w-3 h-3" 
                                                    :alt="subItems.child_item_img?.alt"
                                                />
                                                <span>
                                                    {{ subItems.child_name[0].text }}
                                                </span>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                                <div class="bg-gray-100 rounded-tr-lg rounded-br-lg">
                                    <div class="p-4">
                                        <h6 class="font-bold uppercase text-xs">
                                            Latest News
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="flex gap-x-4">
                <NuxtLink to="/dashboard">
                    Dashboard
                </NuxtLink>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">

const { client } = usePrismic();

const { data: nav } = useAsyncData<any>(() => client.getByType("global_nav"));

const navComponents = computed(() => {
    return nav.value?.results[0]?.data?.slices;
})

const test = () => {
    console.log('ran')
}

onMounted(() => {
    console.log(nav.value?.results[0].data.slices);
})

</script>