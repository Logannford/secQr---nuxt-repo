import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import type { User, Auth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

export const useFirebaseSignUp = async (
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
      //now the user is created, we can add the user to the database
      try {
        await setDoc(doc(db, "users", email), {
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
