<template>
  <div class="text-black">
    Payment success
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from 'pinia';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getApps } from "firebase/app";

import type { FirebaseDatabaseUser } from '~/types/FirestoreUser';

const userStore = useUserStore();
const { currentUser, userAuthState } = storeToRefs(userStore);
const db = ref();
const isOpen = ref<boolean>(false);

const updateFirestoreDbWith = async(): Promise<void> => {
  if(getApps().length)
    db.value = getFirestore();

  console.log(currentUser.value)

  if(!currentUser.value?.uid || !currentUser.value?.email)
    throw createError({
      statusCode: 400,
      message: 'Error updating user credentials',
    });
  
  //needs to be typed 
  const transactionData: FirebaseDatabaseUser['subscription'] = {
    paymentEmail: currentUser.value?.email,
    transactionId: '',
    planType: '',
    subscriptionActive: true,
    dateOfPurchase: new Date().toISOString(),
  }

  // try catch to update the users creds
  try{
    const docRef = doc(db.value, 'users', currentUser.value?.email);
    await updateDoc(docRef, { 
      'subscription': transactionData
    })
  }
  catch(error){
    throw createError({
      statusCode: 400,
      message: 'Error updating user credentials',
    });
  }
}

onMounted(async() => {
  await useFetch("/api/test", { method: "GET" });
  console.log("mounted");

  //await fetchFirebaseUser();
  await useFirebaseAuth();
  // run a function to update the user's credentials in the firestore db
  await updateFirestoreDbWith()
})
</script>