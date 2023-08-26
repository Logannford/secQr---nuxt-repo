<template>
	<form @submit.prevent="handleRegistration()" class="flex flex-col gap-y-4 w-56">
		<input type="text" v-model="email">
		<input type="password" v-model="password">
		<input type="submit" />
	</form>

	<div v-if="error" class="text-red-500"> {{ errorMessage }}</div>
</template>

<script setup lang="ts">

	const email = ref('')
	const password = ref('')
	const error = ref<boolean>(false)
	const errorMessage = ref<string>('')

	const handleRegistration = async () => {
		const response = await useFirebaseSignUp(email.value, password.value)
		
		//if we get a false then something has gone wrong
		if(response !== true){
			error.value = true
			errorMessage.value = response as string
		}	
	}
</script>
