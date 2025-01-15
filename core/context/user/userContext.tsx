import { createContext } from 'react';
import { ApiResponse, User } from '@/core/types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  lastHydrationTime: Date | null;
}

interface UserContextType extends UserState {
  updateUserData: (userData: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  hydrateUserData: (force?: boolean) => Promise<void>;
  syncWithAuth: (userData: User) => Promise<void>;
  getReferreds: () => Promise<ApiResponse>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);
