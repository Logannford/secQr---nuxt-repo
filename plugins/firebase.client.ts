import { initializeApp, getApp, getApps } from "firebase/app";

export default defineNuxtPlugin(nuxtApp => {
  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  const { public: config } = useRuntimeConfig();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    databaseURL: config.firebaseDatabaseURL,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId
  };

  // Return a new instance of the firebase app or the cached instance
	nuxtApp.provide(
		'firebaseClientApp', 
		getApps().length ? getApp() : initializeApp(firebaseConfig)
	);
});
