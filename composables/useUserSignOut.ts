import { signOut, getAuth } from "firebase/auth";
import { useUserStore } from "~/stores/userStore";

export const useUserSignOut = (): void | Error => {
  const resetUser = useUserStore().resetUser;

  const signingOut = ref<boolean>(false);

  const handleSignOut = async (): Promise<void | Error> => {
    const auth = getAuth();

    try {
      signingOut.value = true;

      // sign out of firebase
      await signOut(auth);
      // reset the user
      resetUser();

      // show toast
      useToast().add({
        id: "sign-out-toast",
        title: "Sign out successful",
        description: "You have been signed out of your account.",
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

  handleSignOut();
};
