import { Account } from '@/types/useAccounts';

// Datos simulados para pruebas
const mockAccounts: Account[] = [
  { id: '1', bankName: 'Banco Estado', accountNumber: '1234567890' },
  { id: '2', bankName: 'Banco Santander', accountNumber: '0987654321' },
];

export const getAccounts = async (): Promise<Account[]> => {
  // Simulamos una llamada a la API con un retraso
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAccounts);
    }, 1000);
  });
};

export const addAccount = async (account: Omit<Account, 'id'>): Promise<Account> => {
  // Simulamos la adición de una cuenta
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAccount: Account = {
        ...account,
        id: Date.now().toString(), // Generamos un ID único
      };
      mockAccounts.push(newAccount);
      resolve(newAccount);
    }, 1000);
  });
};