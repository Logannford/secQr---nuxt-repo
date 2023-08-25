import { createUserWithEmailAndPassword, User, getAuth } from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore"; 

export const useFirebaseSignUp = async (email: string, password: string): Promise<any> => {
  const user = useState<User | null>("fb_user", () => null);
  const auth = getAuth();
  const db = getFirestore();
  try {
    const userCreds = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCreds) {
      console.log("user created");
      user.value = userCreds.user;

      // now the user is created, we can add the user to the database
      try {
        const docRef = await addDoc(collection(db, "users"), {
          email: email
        })
      } catch(error: unknown){
        console.error(error);
      }
      return true;
    }
  } catch (error: unknown) {
    if (error instanceof Error) 
		console.error(error.message);
    return false;
  }
  return false;
};
