import { getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

export const useFirebaseUser = (): boolean | undefined => {
    if(!getApps().length)
        return
    if(getAuth().currentUser)
        return true
    return false
}