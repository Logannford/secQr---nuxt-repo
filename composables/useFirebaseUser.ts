import { getAuth } from "firebase/auth"

export const useFirebaseUser = (): boolean => {
    if(getAuth().currentUser)
        return true
    return false
}