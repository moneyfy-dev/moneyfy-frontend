import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/core/types';

export const storage = {
  // Métodos genéricos
  async get<T>(key: string): Promise<T | null> {
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

  // Métodos específicos para Auth
  auth: {
    async getTokens() {
      const [token, sessionToken] = await Promise.all([
        storage.get<string>(STORAGE_KEYS.AUTH.TOKEN),
        storage.get<string>(STORAGE_KEYS.AUTH.SESSION_TOKEN),
      ]);
      return { token, sessionToken };
    },
    
    async setTokens(token: string, sessionToken: string) {
      await Promise.all([
        storage.set(STORAGE_KEYS.AUTH.TOKEN, token),
        storage.set(STORAGE_KEYS.AUTH.SESSION_TOKEN, sessionToken),
      ]);
    },

    async clearAuth() {
      const authKeys = Object.values(STORAGE_KEYS.AUTH);
      await storage.multiRemove(authKeys);
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
  }
};
