<template>
	<form @submit.prevent="handleRegistration()" class="flex flex-col gap-y-4 w-56">
		<input data-cy="email-field" type="text" v-model="email">
		<input data-cy="password-field" type="password" v-model="password">
		<input 
			class="text-white"
			data-cy="submit-btn" 
			type="submit" 
			:disabled="!validEmail || validPassword" 
		/>
	</form>

	<div v-if="error" data-cy="error-field" class="text-red-500"> {{ errorMessage }}</div>
</template>

<script setup lang="ts">
	const email = ref<string>('')
	const password = ref<string>('')
	const error = ref<boolean>(false)
	const errorMessage = ref<string>('')
	const loading = ref<boolean>(false)

	const validEmail = computed<boolean>(() => {
		return /[!@#$%^&*(),.?":{}|<>]/.test(email.value)
	})

	const validPassword = computed<boolean>(() => {
		return password.value.length < 8
	})

	const handleRegistration = async () => {
		loading.value = true;
		const response = await useFirebaseSignUp(email.value, password.value)
		
		//if we get a false then something has gone wrong
		if (response !== true){
			loading.value = false;
			error.value = true
			errorMessage.value = response as string
			return;
		}
		
		//if a successful sign up
		navigateTo("/dashboard")
	}
</script>
