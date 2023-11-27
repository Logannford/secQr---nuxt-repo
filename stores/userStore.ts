import { getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  type AuthStates = 'init' | 'authed' | 'not-authed'
  const userAuthState = ref<AuthStates>('init')
  
  const currentUser = ref<User | null>()
  
  // we have to do this on mounted so we don't get SSR errors
  onMounted(() => {
    console.log('ran')
    const auth = getAuth()
    // Listen for authentication state changes
    onAuthStateChanged(auth, async(user: User | null) => {
      if(!getApps().length)
        return;

      if(user){
        currentUser.value = auth.currentUser
        userAuthState.value = 'authed'
      }
    });
  });

  const resetUser = () => {
    userAuthState.value = 'not-authed'
    currentUser.value = null
  }

  return {
    currentUser,
    resetUser,
    userAuthState,
  };
});