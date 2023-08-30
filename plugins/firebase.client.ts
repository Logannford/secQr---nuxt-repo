import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin(nuxtApp => {
  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  const config = useRuntimeConfig();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    databaseURL: config.public.firebaseDatabaseURL,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  };

  // Initialize Firebase
  const apps = getApps()
  const firebaseApp = !apps.length ? initializeApp(firebaseConfig) : apps[0]
  const firebaseAuth = getAuth(firebaseApp)

  useFirebaseUser()

  return {
    provide: {
      firebaseApp,
      firebaseAuth,
    },
  }
});
