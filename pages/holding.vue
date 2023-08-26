<template>
	<div 
		class="
			text-white w-full h-screen container
			justify-self-center py-5
		"
	>
		<div class="flex flex-col items-center w-full h-full justify-between">
			<div>
				<h4 class="text-center">
					AnonAddress
				</h4>
			</div>
			<div class="flex flex-col items-center">
				<h2 class="text-center text-2xl md:text-4xl md:w-2/3">
					<span 
						class="
							animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-white 
							bg-clip-text text-transparent font-black
						"
					>
						Changing
					</span>
					the way you make online purchases.
				</h2>
				<div 
					class="
						flex gap-x-4 w-full mt-8 items-end justify-center
					"
				>
					<div class="relative md:w-1/2">
						<input 
							class="input-dark !bg-transparent peer placeholder-transparent"
							type="email"
							v-model="userEmail"
							placeholder="hello@example.com"
							name="emailAddress"
							autocomplete="on"
						/>
						<label 
							class="floating-label" 
							for="emailAddress"
						>
							Email
						</label>
					</div>
					<button
						@click=""
						:disabled="!userEmail || loading || completed"
					>
						<div class="text-white w-3 h-3 mb-2 animate-bounce disabled:text-red-500">
                            <UIcon name="arrow-small-right" />
						</div>
					</button>
				</div>
				<div 
					v-if="loading"
					class="text-white w-5 h-5 mt-5 flex justify-center"
				>
					<!-- <Spinner /> -->
				</div>
				<div 
					v-if="completed"
					class="text-center mt-5"
				>
					Sign up successful.
				</div>
				<div
					v-if="errorOccurred"
					class="text-center mt-5 text-sm md:w-1/2"
				>
					An error has occurred while attempting the sign up process. Please check your email address and try again.
				</div>
			</div>
			<div>
				<span class="text-xs font-thin flex">
					A project, by 
					<div class="group flex items-center">
						<a 
							href="https://www.linkedin.com/in/logan-ford-627a51243/"
							class="
                                animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-white 
                                bg-clip-text text-transparent font-black
							"
						>
							&nbspLogan Ford
						</a>
						<div 
							class="
								w-2 h-2 text-white opacity-0 group-hover:opacity-100 
								-translate-x-1/2 group-hover:translate-x-1 duration-500
							"
						>
							<UIcon class="text-white w-6 h-6" name="i-ic-baseline-arrow-forward" />
						</div>
					</div>
				</span>
			</div>
		</div>
	</div>	
</template>

<script setup lang="ts">

	const userEmail = ref('')
	const loading = ref(false)
	const errorOccurred = ref(false)
	const completed = ref(false)

</script>