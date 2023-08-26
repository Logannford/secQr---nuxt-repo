import { getAuth } from "firebase/auth"

export default defineNuxtRouteMiddleware((to) => {
	const user = getAuth().currentUser;

	//making sure the user cannot navigate off of the holding page
	if(!user && to.path !== "/holding")
		return navigateTo('/holding');
	else
		console.info("middleware not ran")
})