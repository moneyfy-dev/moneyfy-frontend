// Exportaciones de tipos
export * from './api/api';
export * from './auth/auth';
export * from './auth/register';
export * from './auth/restorePassword';
export * from './user/user';
export * from './user/useNotifications';
export * from './user/useAccounts';
export * from './quote/vehicles';
export * from './quoter/quoter';
export * from './quote/quote';
export * from './wallet/wallet';
export * from './utils/routes';
export * from './utils/Input';
export * from './utils/storage';

// Tipos utilitarios
export type ValueOf<T> = T[keyof T];
export type NestedValueOf<T> = T extends object 
  ? ValueOf<{ [K in keyof T]: T[K] extends object ? NestedValueOf<T[K]> : T[K] }>
  : T; 