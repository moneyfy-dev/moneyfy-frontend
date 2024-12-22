import { api } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SecuritySettings, PersonalData, NotificationPreferences, BankAccount } from '@/core/types';

export const settingsService = {
  // Security Settings
  updateSecuritySettings: async (settings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    const currentSettings = await AsyncStorage.getItem('securitySettings');
    const baseSettings: SecuritySettings = currentSettings 
      ? JSON.parse(currentSettings)
      : { fingerprintEnabled: false };
    
    const newSettings: SecuritySettings = {
      ...baseSettings,
      ...settings
    };
    
    await AsyncStorage.setItem('securitySettings', JSON.stringify(newSettings));
    return newSettings;
  },

  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const settings = await AsyncStorage.getItem('securitySettings');
    return settings ? JSON.parse(settings) : { fingerprintEnabled: false };
  },

  // Personal Information
  updatePersonalInfo: async (info: Partial<PersonalData>): Promise<PersonalData> => {
    const response = await api.put('/users/profile', info);
    return response.data;
  },

  // Bank Accounts
  addAccount: async (accountData: Omit<BankAccount, 'accountId'>): Promise<BankAccount> => {
    const response = await api.post('/accounts/create', accountData);
    return response.data;
  },

  updateAccount: async (accountId: string, accountData: Partial<BankAccount>): Promise<BankAccount> => {
    const response = await api.put('/accounts/update', { accountId, ...accountData });
    return response.data;
  },

  deleteAccount: async (accountId: string): Promise<void> => {
    await api.delete(`/accounts/delete/${accountId}`);
  },

  selectAccount: async (accountId: string): Promise<{ accounts: BankAccount[] }> => {
    const response = await api.post(`/accounts/select/${accountId}`);
    return response.data;
  },

  // Notifications
  updateNotifications: async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    const response = await api.put('/users/notification-settings', preferences);
    return response.data;
  },

  // Password
  changePassword: async (oldPwd: string, newPwd: string): Promise<{ status: number; message: string }> => {
    const response = await api.put('/users/change/password', { oldPwd, newPwd });
    return response.data;
  }
};