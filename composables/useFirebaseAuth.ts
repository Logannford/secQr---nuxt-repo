import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores/userStore';

/**
 * A composable to wait until the user is authed in the pinia store 
 * before continuing on with the function
 * 
 * @returns Promise void
 */
export const useFirebaseAuth = async(): Promise<void> => {
    const userStore = useUserStore();
    const { userAuthState } = storeToRefs(userStore);
    // this is waiting until we are either 'authed' or 'not-authed
    return await new Promise<void>((resolve) => {
        const unwatch = watch(userAuthState, (newState) => {
            if (newState === 'authed' || newState === 'not-authed') {
                unwatch();
                resolve();
            }
        });
    });
}