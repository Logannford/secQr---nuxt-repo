import { createUserWithEmailAndPassword, User, getAuth } from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore"; 

export const useFirebaseSignUp = async (email: string, password: string): Promise<boolean | string> => {
  const user = useState<User | null>("fb_user", () => null);
  const auth = getAuth();
  const db = getFirestore();
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredentials) {
      console.log("user created");
      user.value = userCredentials.user;

      // now the user is created, we can add the user to the database
      try {
        await addDoc(collection(db, "users"), {
          email: email
        })
      } catch(error: unknown){
        console.error(error);
      }
      return true;
    }
  } catch (error: unknown) {
    if (error instanceof Error){
      return error.message
    } 
  }
  return false;
};
