import type { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";


export default defineEventHandler(async (event) => {
    const nitroApp = useNitroApp()
    // @ts-ignore
    const firebaseServerApp = nitroApp.firebaseServerApp as App;

    // less dodge time
    const firestore = getFirestore(firebaseServerApp);
    firestore.doc("users/logan@hiyield.co.uk").set({"nitro": "yes"}, {merge: true});
});