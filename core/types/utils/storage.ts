export const STORAGE_KEYS = {
  AUTH: {
    TOKEN: 'token',
    SESSION_TOKEN: 'sessionToken',
    PERSISTENT_AUTH: 'persistentAuthEnabled',
    PERSISTENT_AUTH_CONFIGURED: 'persistentAuthConfigured',
    PIN: 'userPin' as const,
  },
  USER: {
    DATA: 'user',
    PIN: 'user_pin',
    LAST_HYDRATION: 'lastHydrationTime',
  },
  SESSION: {
    VEHICLES: 'session_vehicles',
    QUOTES: 'session_quotes',
    QUOTERS: 'session_quoters',
  }
} as const;

// Tipos derivados de las keys
export type StorageKeys = typeof STORAGE_KEYS;
export type AuthStorageKeys = StorageKeys['AUTH'];
export type UserStorageKeys = StorageKeys['USER'];
export type SessionStorageKeys = StorageKeys['SESSION']; 