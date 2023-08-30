import { getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", () => {
  if(!getApps().length)
    return

  type AuthStates = 'init' | 'authed' | 'not-authed'
  const userAuthState = ref<AuthStates>('init');
  
  const currentUser = ref<User | undefined>();
  const auth = getAuth();

  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    if(user) 
      currentUser.value = user;
  });

  const resetUser = (): void => {
    userAuthState.value = 'not-authed'
    currentUser.value = undefined
  }

  return {
    currentUser,
    resetUser
  };
});
