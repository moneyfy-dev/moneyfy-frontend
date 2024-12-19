// Exportaciones de tipos
export * from './auth';
export * from './userData';
export * from './vehicles';
export * from './useNotifications';
export * from './useAccounts';
export * from './routes';
export * from './quoter';
export * from './quote';
export * from './Input';
export * from './storageKeys';
// Tipos utilitarios
export type ValueOf<T> = T[keyof T];
export type NestedValueOf<T> = T extends object 
  ? ValueOf<{ [K in keyof T]: T[K] extends object ? NestedValueOf<T[K]> : T[K] }>
  : T; 