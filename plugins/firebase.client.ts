import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

  // Initialize Firebase
  // const apps = getApps();
  // const firebaseApp = !apps.length ? initializeApp(firebaseConfig) : apps[0];
  // const firebaseAuth = getAuth(firebaseApp);
  // const db = getFirestore(initializeApp(firebaseConfig));

  // useFirebaseUser();

  // return {
  //   provide: {
  //     firebaseApp,
  //     firebaseAuth,
  //     db
  //   },
  // }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  //return getFirestore(app);
});
