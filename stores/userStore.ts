import { getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { defineStore } from 'pinia';
import type { User, Auth } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

export type AuthStates = 'init' | 'authed' | 'not-authed';

export const useUserStore = defineStore('userStore', () => {
  // set the user's auth state to 'fetching' - meaning not authed yet && not not-authed
  const userAuthState = ref<AuthStates>('init');

  const currentUser = ref<User | null>(null);

  const userSignUp = async (
    email: string,
    password: string
  ): Promise<boolean | string> => {
    //const user = useState<User | null>("fb_user", (): null => null);
    const auth: Auth = getAuth();
    const db = getFirestore();
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials && userCredentials.user.uid) {
        userAuthState.value = 'authed';
        //now the user is created, we can add the user to the database
        try {
          await setDoc(doc(db, 'users', email), {
            email: email,
            subscription: {
              active: false,
            },
          });
        } catch (error: unknown) {
          console.error(error);
        }
        return true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error.message;
      }
    }
    return false;
  };

  const signOutUser = async (): Promise<void | Error> => {
    const signingOut = ref<boolean>(false);
    const auth = getAuth();

    try {
      signingOut.value = true;

      // sign out of firebase
      await signOut(auth);
      // reset the user
      resetUser();
      console.log('user signed out');
      console.log(userAuthState.value);

      // show toast
      useToast().add({
        id: 'sign-out-toast',
        title: 'Sign out successful',
        description: 'You have been signed out of your account.',
        timeout: 3000,
      });

      signingOut.value = false;
    } catch (error) {
      if (error instanceof Error) {
        throw createError({
          statusCode: 500,
          message: error.message,
        });
      }
    }
  };

  const resetUser = async (): Promise<void> => {
    const auth = getAuth();

    try {
      userAuthState.value = 'not-authed';
      currentUser.value = null;
      await signOut(auth);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  };

  // we have to do this on mounted so we don't get SSR errors
  onMounted(() => {
    const auth = getAuth();

    if (!currentUser) return;
    // Listen for authentication state changes
    watch(
      auth,
      onAuthStateChanged(auth, async (user: User | null) => {
        if (!getApps().length) return;

        // if we have an active user, then set the global user
        if (user) {
          currentUser.value = auth.currentUser;
          userAuthState.value = 'authed';
        } else {
          currentUser.value = null;
          userAuthState.value = 'not-authed';
        }
      })
    );

    getAuth().onAuthStateChanged((user) => {
      if (user) {
        currentUser.value = user;
        userAuthState.value = 'authed';
      } else {
        currentUser.value = null;
        userAuthState.value = 'not-authed';
      }
    });
  });

  return {
    currentUser,
    resetUser,
    userAuthState,
    signOutUser,
    userSignUp,
  };
});
