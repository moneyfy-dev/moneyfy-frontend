import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/core/types';
import type { Vehicle, InsurancePlan } from '@/core/types';

export const storage = {
  // Métodos genéricos
  async get<T>(key: keyof typeof STORAGE_KEYS | string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error removing multiple keys:', error);
    }
  },

  // Métodos seguros para datos sensibles
  async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting secure ${key}:`, error);
      return null;
    }
  },

  async setSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting secure ${key}:`, error);
      throw error;
    }
  },

  async removeSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing secure ${key}:`, error);
      throw error;
    }
  },

  // Métodos específicos para Auth usando SecureStore
  auth: {
    async getTokens() {
      try {
        const [token, sessionToken] = await Promise.all([
          storage.getSecure(STORAGE_KEYS.AUTH.TOKEN),
          storage.getSecure(STORAGE_KEYS.AUTH.SESSION_TOKEN),
        ]);

        console.log('🔐 Tokens recuperados del storage:', {
          hasToken: !!token,
          hasSessionToken: !!sessionToken,
          tokenLength: token?.length,
          sessionTokenLength: sessionToken?.length
        });

        if (!token || !sessionToken) {
          console.warn('⚠️ Tokens incompletos en storage');
          return { token: null, sessionToken: null };
        }

        return { token, sessionToken };
      } catch (error) {
        console.error('❌ Error recuperando tokens:', error);
        return { token: null, sessionToken: null };
      }
    },
    
    async setTokens(token: string, sessionToken: string) {
      try {
        console.log('💾 Guardando tokens en storage:', {
          tokenLength: token?.length,
          sessionTokenLength: sessionToken?.length
        });

        if (!token || !sessionToken) {
          throw new Error('Tokens inválidos');
        }

        await Promise.all([
          storage.setSecure(STORAGE_KEYS.AUTH.TOKEN, token),
          storage.setSecure(STORAGE_KEYS.AUTH.SESSION_TOKEN, sessionToken),
        ]);

        console.log('✅ Tokens guardados exitosamente');
      } catch (error) {
        console.error('❌ Error guardando tokens:', error);
        throw error;
      }
    },

    async clearAuth() {
      console.log('🧹 Limpiando tokens del storage');
      const authKeys = Object.values(STORAGE_KEYS.AUTH);
      await Promise.all(authKeys.map(key => storage.removeSecure(key)));
      console.log('✅ Tokens limpiados exitosamente');
    }
  },

  // Métodos específicos para User
  user: {
    async getData() {
      return storage.get(STORAGE_KEYS.USER.DATA);
    },

    async setData(userData: any) {
      await storage.set(STORAGE_KEYS.USER.DATA, userData);
    },

    async updateLastHydration() {
      await storage.set(STORAGE_KEYS.USER.LAST_HYDRATION, new Date().toISOString());
    },

    async clearUser() {
      const userKeys = Object.values(STORAGE_KEYS.USER);
      await storage.multiRemove(userKeys);
    }
  },

  // Métodos para datos de sesión
  session: {
    async clearAll() {
      const sessionKeys = Object.values(STORAGE_KEYS.SESSION);
      await storage.multiRemove(sessionKeys);
    },
  },

  // Métodos específicos para Quote
  quote: {
    async getVehicle() {
      return storage.get<Vehicle>(STORAGE_KEYS.QUOTE.VEHICLE);
    },

    async setVehicle(vehicle: Vehicle | null) {
      if (vehicle) {
        await storage.set(STORAGE_KEYS.QUOTE.VEHICLE, vehicle);
      } else {
        await storage.remove(STORAGE_KEYS.QUOTE.VEHICLE);
      }
    },

    async getPlans() {
      return storage.get<InsurancePlan[]>(STORAGE_KEYS.QUOTE.PLANS);
    },

    async setPlans(plans: InsurancePlan[] | null) {
      if (plans) {
        await storage.set(STORAGE_KEYS.QUOTE.PLANS, plans);
      } else {
        await storage.remove(STORAGE_KEYS.QUOTE.PLANS);
      }
    },

    async getQuoterId() {
      return storage.get<string>(STORAGE_KEYS.QUOTE.QUOTER_ID);
    },

    async setQuoterId(quoterId: string | null) {
      if (quoterId) {
        await storage.set(STORAGE_KEYS.QUOTE.QUOTER_ID, quoterId);
      } else {
        await storage.remove(STORAGE_KEYS.QUOTE.QUOTER_ID);
      }
    },

    async clearQuote() {
      const quoteKeys = Object.values(STORAGE_KEYS.QUOTE);
      await storage.multiRemove(quoteKeys);
    }
  },

  STORAGE_KEYS,
};
