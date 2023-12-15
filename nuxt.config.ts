// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      bodyAttrs: {
        class: "bg-white/95 w-full",
      },
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Work+Sans",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Corben",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Solway",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Quicksand",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Karla",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cairo",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/prismic"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  colorMode: {
    preference: "dark",
  },

  runtimeConfig: {
    private: {
      stripeSecretKey: "",
    },
    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseDatabaseURL: "",
      firebaseProjectId: "",
      firebaseStorageBucket: "",
      firebaseMessagingSenderId: "",
      firebaseAppId: "",

      appDomain: "",
      stripePublicKey: "",
    },
  },

  prismic: {
    endpoint: "anonaddress",
  },
});
