import { createContext } from 'react';
import { SecuritySettings, PersonalData, BankAccount, NotificationPreferences, BaseAuthResponse } from '@/core/types';

interface SettingsContextType {
  security: SecuritySettings;
  personalInfo: PersonalData;
  accounts: BankAccount[];
  notifications: NotificationPreferences;
  updateSecurity: (settings: Partial<SecuritySettings>) => Promise<void>;
  updatePersonalInfo: (info: Partial<PersonalData>) => Promise<void>;
  updateAccount: (accountId: string, data: Partial<BankAccount>) => Promise<void>;
  addAccount: (account: Omit<BankAccount, 'accountId'>) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<BaseAuthResponse>;
  updateNotifications: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<BaseAuthResponse>;
  selectAccount: (accountId: string) => Promise<BaseAuthResponse>;
  isBiometricAvailable: () => Promise<boolean>;
  authenticateBiometric: () => Promise<boolean>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined); 