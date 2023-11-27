<template>
  <div class="text-black">
    {{ currentUser }}
    {{ userAuthState }}
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

const updateFirestoreDbWith = async(): Promise<void> => {
  if(getApps().length)
    db.value = getFirestore();
  // get the current user

  // this is waiting until we are either 'authed' or 'not-authed
  // await new Promise<void>((resolve) => {
  //   const unwatch = watch(userAuthState, (newState) => {
  //     if (newState === 'authed' || newState === 'not-authed') {
  //       unwatch(); // Stop watching once the desired state is reached
  //       resolve();
  //     }
  //   });
  // });

  // we need the user / user id in order to update data in the doc
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
  //await fetchFirebaseUser();
  await useFirebaseAuth();
  // run a function to update the user's credentials in the firestore db
  await updateFirestoreDbWith()
})
</script>