import { getApps } from 'firebase/app';
import type { User } from 'firebase/auth';

export default defineNuxtRouteMiddleware((to) => {
  if (!getApps().length) return;

  const user: User | null = useFirebaseUser();

  //making sure the user cannot navigate off of the holding page
  if (user && to.path !== '/holding') return; //navigateTo('/holding');
  else console.info('middleware not ran');
});
