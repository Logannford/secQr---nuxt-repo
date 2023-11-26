<template>
  <div class="text-black">
    {{ currentUser }}
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from 'pinia';
import { setDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import type { FirebaseDatabaseUser } from '~/types/FirestoreUser';
import { initializeApp, getApps } from "firebase/app";


const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const db = ref();

const updateFirestoreDbWith = async(): Promise<void> => {
  if(getApps().length)
    db.value = getFirestore();
  // get the current user
  const user = currentUser?.value;

  // we need the user / user id in order to update data in the doc
  if(!user || !user.uid)
    return;

  //needs to be typed 
  const transactionData: FirebaseDatabaseUser['subscription'] = {
    paymentEmail: user?.email as string,
    planType: '',
    subscriptionActive: true,
    dateOfPurchase: new Date().toISOString(),
  }

  // try catch to update the users creds
  try{
    const docRef = doc(db.value, 'users', user.uid);
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
  // run a function to update the user's credentials in the firestore db
  await updateFirestoreDbWith()
})
</script>