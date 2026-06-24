import React, { useState, useCallback, useRef } from 'react';
import { UserContext } from './userContext';
import { storage } from '../../../shared/utils/storage';
import { STORAGE_KEYS } from '../../types/utils/storage';
import { userService } from '../../services';
import { differenceInMinutes } from 'date-fns';
import type { User } from '../../types';
import { useAuth } from '../auth/useAuth';
import { isAuthenticationError } from '../../services/api/auth-error';

const isMissingHydratedUserError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;

  const response = (error as {
    response?: {
      status?: number;
      data?: unknown;
    };
  }).response;

  if (response?.status !== 424) return false;

  const text = JSON.stringify(response.data ?? '').toLowerCase();
  return text.includes('usuario') || text.includes('user');
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastHydrationTime, setLastHydrationTime] = useState<Date | null>(null);
  const lastHydrationTimeRef = useRef<Date | null>(null);
  const hydrationPromiseRef = useRef<Promise<void> | null>(null);

  const syncHydrationTime = useCallback((nextValue: Date | null) => {
    lastHydrationTimeRef.current = nextValue;
    setLastHydrationTime(nextValue);
  }, []);

  // Inicialización
  React.useEffect(() => {
    const initializeUser = async () => {
      const userData = await storage.user.getData();
      if (userData) {
        setUser(userData as User);
        const storedHydrationTime = await storage.get<string>(STORAGE_KEYS.USER.LAST_HYDRATION);
        syncHydrationTime(storedHydrationTime ? new Date(storedHydrationTime) : null);
      }
    };

    initializeUser();
  }, [syncHydrationTime]);

  const hydrateUserData = useCallback(async (force: boolean = false) => {
    if (hydrationPromiseRef.current) {
      await hydrationPromiseRef.current;
      return;
    }

    const hydrationTask = (async () => {
      try {
        setIsLoading(true);
        
        // Verificar si necesitamos actualizar
        if (!force && lastHydrationTimeRef.current) {
          const minutesSinceLastHydration = differenceInMinutes(new Date(), lastHydrationTimeRef.current);
          if (minutesSinceLastHydration < 5) {
            return;
          }
        }

        const { token, sessionToken } = await storage.auth.getTokens();

        if (!token || !sessionToken) {
          throw new Error('No tokens available');
        }

        const response = await userService.getUserData();
        if (response?.data?.user) {
          await storage.user.setData(response.data.user);
          setUser(response.data.user);
          
          await storage.user.updateLastHydration();
          syncHydrationTime(new Date());
        }
      } catch (error) {
        if (isAuthenticationError(error) || isMissingHydratedUserError(error)) {
          await logout();
        }
        throw error;
      } finally {
        setIsLoading(false);
        hydrationPromiseRef.current = null;
      }
    })();

    hydrationPromiseRef.current = hydrationTask;
    await hydrationTask;
  }, [logout, syncHydrationTime]);

  const updateUserData = useCallback(async (updatedData: Partial<User>) => {
    try {
      setIsLoading(true);
      const currentUser = await storage.user.getData();
      const newUser = { ...currentUser as User, ...updatedData };
      
      await storage.user.setData(newUser);
      setUser(newUser);

      await storage.user.updateLastHydration();
      syncHydrationTime(new Date());
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [syncHydrationTime]);

  const refreshUserData = useCallback(async () => {
    await hydrateUserData(true);
  }, [hydrateUserData]);

  const syncWithAuth = useCallback(async (userData: User) => {
    try {
      setIsLoading(true);
      await storage.user.setData(userData);
      setUser(userData);
      syncHydrationTime(new Date());
    } catch (error) {
      console.error('Error syncing with auth:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [syncHydrationTime]);

  const getReferreds = useCallback(async () => {
    const response = await userService.getReferreds();
    return response;
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        lastHydrationTime,
        updateUserData,
        refreshUserData,
        hydrateUserData,
        syncWithAuth,
        getReferreds,
      }}
    >
      {children}
    </UserContext.Provider>
  );
  
};
