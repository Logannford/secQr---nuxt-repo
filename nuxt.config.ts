// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
		layoutTransition: { 
			name: 'layout', 
			mode: 'out-in' 
		},
		head: {
			meta: [
				{
					"name": "viewport",
					"content": "width=device-width, initial-scale=1"
				}
			],
			bodyAttrs: {
				class: "bg-dark-black w-full"
			},
			link: [
					{
						rel: "stylesheet",
						href: "https://fonts.googleapis.com/css2?family=Work+Sans"
					},
					{
						rel: "stylesheet",
						href: "https://fonts.googleapis.com/css2?family=Corben"
					},
					{
						rel: "stylesheet",
						href: "https://fonts.googleapis.com/css2?family=Solway"
					},
			]
		}
	},
  css: ['~/assets/css/main.css'],
  modules: ['@nuxthq/ui', '@pinia/nuxt', '@nuxtjs/prismic'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  colorMode: {
    preference: 'dark'
  },

  ui: {
    icons: 'ic'
  },

  runtimeConfig: {
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseDatabaseURL: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: ''
    }
  },

  plugins: ["~/plugins/firebase.client.ts"],

  ssr: false,

  prismic: {
    endpoint: 'anonaddress',
  },
})