import React, { useState, useCallback } from 'react';
import { UserContext } from './userContext';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types/utils/storage';
import { userService } from '@/core/services';
import { differenceInMinutes } from 'date-fns';
import type { User } from '@/core/types';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    console.log('🔄 Iniciando hidratación de datos:', { force });
    try {
      setIsLoading(true);
      
      // Verificar si necesitamos actualizar
      if (!force && lastHydrationTime) {
        const minutesSinceLastHydration = differenceInMinutes(new Date(), lastHydrationTime);
        console.log('⏱️ Minutos desde última hidratación:', minutesSinceLastHydration);
        if (minutesSinceLastHydration < 5) {
          console.log('⏭️ Saltando hidratación - muy reciente');
          return;
        }
      }

      const { token, sessionToken } = await storage.auth.getTokens();
      console.log('🔑 Tokens disponibles:', {
        hasToken: !!token,
        hasSessionToken: !!sessionToken
      });

      if (!token || !sessionToken) {
        throw new Error('No tokens available');
      }

      const response = await userService.getUserData();
      console.log('👤 Datos de usuario recibidos:', {
        hasUser: !!response?.data?.user,
        hasTokens: !!response?.data?.tokens
      });

      if (response?.data?.user) {
        await storage.user.setData(response.data.user);
        setUser(response.data.user);
        
        if (response.data.tokens) {
          console.log('🔄 Actualizando tokens');
          await storage.auth.setTokens(
            response.data.tokens.jwtRefresh,
            response.data.tokens.jwtSession
          );
        }

        await storage.user.updateLastHydration();
        setLastHydrationTime(new Date());
      }
    } catch (error) {
      console.error('❌ Error en hidratación:', error);
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
      console.error('Error updating user data:', error);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
