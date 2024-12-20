import { createContext } from 'react';
import { User } from '@/core/types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  lastHydrationTime: Date | null;
}

interface UserContextType extends UserState {
  updateUserData: (userData: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  hydrateUserData: (force?: boolean) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);
