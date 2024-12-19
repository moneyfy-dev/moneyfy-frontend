export const STORAGE_KEYS = {
    AUTH: {
      TOKEN: 'token',
      SESSION_TOKEN: 'sessionToken',
      PERSISTENT_AUTH: 'persistentAuthEnabled',
      PERSISTENT_AUTH_CONFIGURED: 'persistentAuthConfigured',
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
    } as const
  };