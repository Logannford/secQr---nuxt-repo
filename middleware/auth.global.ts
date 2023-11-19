import { getApps } from "firebase/app";

export default defineNuxtRouteMiddleware((to) => {
	if(!getApps().length)
		return;
	const user: boolean | undefined = useFirebaseUser();
	
	//making sure the user cannot navigate off of the holding page
	if(user && to.path !== "/holding")
		return //navigateTo('/holding');
	else
		console.info("middleware not ran")
})