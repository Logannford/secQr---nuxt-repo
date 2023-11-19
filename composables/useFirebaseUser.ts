import { getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

export const useFirebaseUser = (): boolean | undefined => {
    if(!getApps().length)
        return;
    return !!getAuth().currentUser;
}