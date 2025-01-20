import { api } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SecuritySettings, PersonalData, NotificationPreferences, BankAccount, BaseAuthResponse } from '@/core/types';

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
  updatePersonalInfo: async (info: Partial<PersonalData>): Promise<BaseAuthResponse> => {
    try {
        const formData = new FormData();
        
        // Agregar campos básicos al FormData
        Object.keys(info).forEach(key => {
            if (key !== 'profilePicture') {
                const value = info[key as keyof typeof info];
                if (typeof value === 'string') {
                    formData.append(key, value);
                }
            }
        });

        // Solo agregar profilePicture si existe y es una nueva imagen (no base64)
        if (info.profilePicture && !info.profilePicture.startsWith('data:image')) {
            const uriParts = info.profilePicture.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append('profilePicture', {
                uri: info.profilePicture,
                type: `image/${fileType}`,
                name: 'profilePicture.jpg'
            } as any);
        }

        const response = await api.put<BaseAuthResponse>('/users/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
  },

  // Bank Accounts
  addAccount: async (accountData: Omit<BankAccount, 'accountId'>): Promise<BaseAuthResponse> => {
    try {
        const response = await api.post<BaseAuthResponse>('/accounts/create', accountData);
        return response.data;
    } catch (error: any) {
        throw error;
    }
  },

  updateAccount: async (accountId: string, accountData: Partial<BankAccount>): Promise<BaseAuthResponse> => {
    try {
        const response = await api.put<BaseAuthResponse>('/accounts/update', { accountId, ...accountData });
        return response.data;
    } catch (error: any) {
        throw error;
    }
  },

  deleteAccount: async (accountId: string): Promise<BaseAuthResponse> => {
    try {
        const response = await api.delete<BaseAuthResponse>(`/accounts/delete/${accountId}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
  },

  selectAccount: async (accountId: string): Promise<BaseAuthResponse> => {
    try {
        const response = await api.post<BaseAuthResponse>(`/accounts/select/${accountId}`, {});
        return response.data;
    } catch (error: any) {
        throw error;
    }
  },

  // Notifications
  updateNotifications: async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    const response = await api.put('/users/notification-settings', preferences);
    return response.data;
  },

  // Password
  changePassword: async (oldPwd: string, newPwd: string): Promise<BaseAuthResponse> => {
    try {
        const response = await api.put<BaseAuthResponse>('/users/change/password', { 
            oldPwd, 
            newPwd 
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
  }
};