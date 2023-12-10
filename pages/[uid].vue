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
  const route = useRoute();

  const { data: document } = await useAsyncData('page', async () => {
    const document = client.getByUID('page', route.params.uid as string)

    if(document)
      return document;
    else
      throw createError({
        statusCode: 404,
        message: 'page not found'
      })
  });

  onMounted(() => {
    console.log(document.value)
  })
 

</script>