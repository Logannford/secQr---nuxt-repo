import { getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { User } from 'firebase/auth';

export const useFirebaseUser = (): User | null => {
  if (!getApps().length) return null;
  return getAuth().currentUser;
};
