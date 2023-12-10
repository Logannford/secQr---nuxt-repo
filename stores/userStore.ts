import { getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { defineStore } from "pinia";

export type AuthStates = "init" | "authed" | "not-authed";

export const useUserStore = defineStore("userStore", () => {
  // set the user's auth state to 'fetching' - meaning not authed yet && not not-authed
  const userAuthState = ref<AuthStates>("init");

  const currentUser = ref<User | null>(null);

  // we have to do this on mounted so we don't get SSR errors
  onMounted(() => {
    const auth = getAuth();

    if (!currentUser) return;
    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user: User | null) => {
      if (!getApps().length) return;

      // if we have an active user, then set the global user
      if (user) {
        currentUser.value = auth.currentUser;
        userAuthState.value = "authed";
      } else {
        currentUser.value = null;
        userAuthState.value = "not-authed";
      }
    });
  });

  const resetUser = () => {
    userAuthState.value = "not-authed";
    currentUser.value = null;
  };

  return {
    currentUser,
    resetUser,
    userAuthState,
  };
});
