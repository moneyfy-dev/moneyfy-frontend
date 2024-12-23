import { createContext } from 'react';
import { SecuritySettings, PersonalData, BankAccount, NotificationPreferences } from '@/core/types';

interface SettingsContextType {
  security: SecuritySettings;
  personalInfo: PersonalData;
  accounts: BankAccount[];
  notifications: NotificationPreferences;
  updateSecurity: (settings: Partial<SecuritySettings>) => Promise<void>;
  updatePersonalInfo: (info: Partial<PersonalData>) => Promise<void>;
  updateAccount: (accountId: string, data: Partial<BankAccount>) => Promise<void>;
  addAccount: (account: Omit<BankAccount, 'accountId'>) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
  updateNotifications: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined); 