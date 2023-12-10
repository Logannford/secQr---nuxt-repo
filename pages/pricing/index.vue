<template>
	<SliceZone
		wrapper="main"
		:slices="document?.data.slices ?? []"
		:components="components"
	/>
</template>

<script setup lang="ts">
import { components } from '~/slices';

const { client } = usePrismic();

const { data: document } = await useAsyncData('pricingPage', async () => {
	const document = client.getByUID('pricingPage', 'pricing');

	if(document)
		return document;
	else
		throw createError({
			statusCode: 404,
			message: 'page not found'
		})
})

onMounted(() => {
	console.log(document.value)
})

</script>