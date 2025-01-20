import React, { useState, useCallback } from 'react';
import { UserContext } from './userContext';
import { storage } from '../../../shared/utils/storage';
import { STORAGE_KEYS } from '../../types/utils/storage';
import { userService } from '../../services';
import { differenceInMinutes } from 'date-fns';
import type { User } from '../../types';
import { useAuth } from '../auth/useAuth';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastHydrationTime, setLastHydrationTime] = useState<Date | null>(null);

  // Inicialización
  React.useEffect(() => {
    const initializeUser = async () => {
      const userData = await storage.user.getData();
      if (userData) {
        setUser(userData as User);
        const storedHydrationTime = await storage.get<string>(STORAGE_KEYS.USER.LAST_HYDRATION);
        setLastHydrationTime(storedHydrationTime ? new Date(storedHydrationTime) : null);
      }
    };

    initializeUser();
  }, []);

  const hydrateUserData = useCallback(async (force: boolean = false) => {
    try {
      setIsLoading(true);
      
      // Verificar si necesitamos actualizar
      if (!force && lastHydrationTime) {
        const minutesSinceLastHydration = differenceInMinutes(new Date(), lastHydrationTime);
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
        
        if (response.data.tokens) {
          await storage.auth.setTokens(
            response.data.tokens.jwtRefresh,
            response.data.tokens.jwtSession
          );
        }

        await storage.user.updateLastHydration();
        setLastHydrationTime(new Date());
      }
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [lastHydrationTime]);

  const updateUserData = async (updatedData: Partial<User>) => {
    try {
      setIsLoading(true);
      const currentUser = await storage.user.getData();
      const newUser = { ...currentUser as User, ...updatedData };
      
      await storage.user.setData(newUser);
      setUser(newUser);

      await storage.user.updateLastHydration();
      setLastHydrationTime(new Date());
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    await hydrateUserData(true);
  };

  const syncWithAuth = async (userData: User) => {
    try {
      setIsLoading(true);
      await storage.user.setData(userData);
      setUser(userData);
      setLastHydrationTime(new Date());
    } catch (error) {
      console.error('Error syncing with auth:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getReferreds = async () => {
    const response = await userService.getReferreds();
    return response;
  };

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
