export const STORAGE_KEYS = {
  AUTH: {
    TOKEN: 'token',
    SESSION_TOKEN: 'sessionToken',
    PERSISTENT_AUTH: 'persistentAuthEnabled',
    BIOMETRIC_ENABLED: 'biometricEnabled',
    PIN: 'userPin' as const,
  },
  USER: {
    DATA: 'user',
    LAST_HYDRATION: 'lastHydrationTime',
  },
  SETTINGS: {
    THEME: 'theme',
  },
  SESSION: {
    VEHICLES: 'session_vehicles',
    QUOTES: 'session_quotes',
    QUOTERS: 'session_quoters',
  },
  QUOTE: {
    VEHICLE: 'quote_vehicle',
    PLANS: 'quote_plans',
    QUOTER_ID: 'quote_quoter_id'
  },
} as const;

// Tipos derivados de las keys
export type StorageKeys = typeof STORAGE_KEYS;
export type AuthStorageKeys = StorageKeys['AUTH'];
export type UserStorageKeys = StorageKeys['USER'];
export type SessionStorageKeys = StorageKeys['SESSION']; 