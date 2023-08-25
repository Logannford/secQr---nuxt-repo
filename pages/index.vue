<template>
	<form @submit.prevent="handleRegistration()">
		<input type="text" v-model="email">
		<input type="password" v-model="password">
		<input type="submit" />
	</form>
</template>

<script setup lang="ts">

	const email = ref('')
	const password = ref('')

	const handleRegistration = async() => {
		await useFirebaseSignUp(email.value, password.value)
	}

</script>
