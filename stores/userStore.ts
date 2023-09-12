import { getApps } from "firebase/app"
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { defineStore } from "pinia"

export const useUserStore = defineStore("userStore", () => {
  type AuthStates = 'init' | 'authed' | 'not-authed'
  const userAuthState = ref<AuthStates>('init')
  
  const currentUser = useState<FirebaseUser | null>("fb_user", () => null)
  
  // we have to do this on mounted so we don't get SSR errors
  onMounted(() => {
    const auth = getAuth()
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      if(user) 
        currentUser.value = user
    });
  })

  const resetUser = (): void => {
    userAuthState.value = 'not-authed'
    currentUser.value = null
  }

  return {
    currentUser,
    resetUser
  };
});
