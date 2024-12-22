export const ROUTES = {
  TABS: {
    INDEX: '/',
    QUOTERS: '/(tabs)/quoters',
    QUOTE: '/(tabs)/quote',
    CONFIG: '/(tabs)/config',
  },
  AUTH: {
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register-screen',
    CONFIRMATION: '/(auth)/confirmation-code',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
    RESET_PASSWORD: '/(auth)/reset-password',
    PERSISTENT_AUTH: '/(auth)/persistent-auth',
  },
  WALLET: {
    WALLET: '/(wallet)/wallet',
    WITHDRAWAL: '/(wallet)/withdrawal',
    HISTORY: '/(wallet)/withdrawal-history',
  },
  QUOTE: {
    CONFIRM_ADDRESS: '/(quote)/confirm-address',
    PAYMENT_QR: '/(quote)/payment-qr',
    SEARCH_RESULTS: '/(quote)/search-results',
    MANUAL_SEARCH: '/(quote)/manual-search',
    QUOTE_RESULTS: '/(quote)/quote-results',
  },
  QUOTERS: {
    DETAIL: '/(quoters)/quoter-detail',
  },
  SETTINGS: {
    PAYMENT_CONFIG: '/(settings)/payment-config',
    CHANGE_PASSWORD: '/(settings)/change-password',
    NOTIFICATIONS: '/(settings)/notifications',
    ADD_ACCOUNT: '/(settings)/add-account',
    TWO_FACTOR: '/(settings)/two-factor-auth',
    APPEARANCE: '/(settings)/appearance',
    PIN_CONFIG: '/(settings)/pin-config',
    PRIVACY_SECURITY: '/(settings)/privacy-security',
    REFERRAL_CODE: '/(settings)/referral-code',
    PERSONAL_INFO: '/(settings)/personal-info',
  },
  LEGAL: {
    PRIVACY_POLICY: '/(legal)/privacy-policy',
    TERMS: '/(legal)/terms-and-conditions',
  },
} as const;

// Tipo utilitario para obtener todas las rutas posibles
type ValueOf<T> = T[keyof T];
type NestedValueOf<T> = T extends object 
  ? ValueOf<{ [K in keyof T]: T[K] extends object ? NestedValueOf<T[K]> : T[K] }>
  : T;

export type AppRoutes = NestedValueOf<typeof ROUTES>;

// Sistema de navegación App Layout
export const screens = [
  { name: "(auth)", options: { headerShown: false } },
  { name: "(tabs)", options: { headerShown: false } },
  { name: "(settings)", options: { headerShown: false } },
  { name: "(quote)", options: { headerShown: false } },
  { name: "(quoters)", options: { headerShown: false } },
  { name: "(wallet)", options: { headerShown: false } },
  { name: "(legal)", options: { headerShown: false } },
] as const;

export type RouteNames = (typeof screens)[number]['name'];