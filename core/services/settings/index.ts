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
    console.log('🔄 Iniciando actualización de información personal:', info);
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
            
            console.log('🖼️ Preparando imagen para envío:', {
                uri: info.profilePicture,
                type: `image/${fileType}`
            });

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
        console.error('❌ Error en updatePersonalInfo:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
  },

  // Bank Accounts
  addAccount: async (accountData: Omit<BankAccount, 'accountId'>): Promise<BaseAuthResponse> => {
    console.log('🔄 Iniciando creación de cuenta bancaria:', accountData);
    try {
        const response = await api.post<BaseAuthResponse>('/accounts/create', accountData);
        console.log('✅ Cuenta bancaria creada:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al crear cuenta bancaria:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
  },

  updateAccount: async (accountId: string, accountData: Partial<BankAccount>): Promise<BaseAuthResponse> => {
    console.log('🔄 Actualizando cuenta bancaria:', { accountId, ...accountData });
    try {
        const response = await api.put<BaseAuthResponse>('/accounts/update', { accountId, ...accountData });
        console.log('✅ Cuenta bancaria actualizada:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al actualizar cuenta bancaria:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
  },

  deleteAccount: async (accountId: string): Promise<BaseAuthResponse> => {
    console.log('🔄 Iniciando eliminación de cuenta bancaria:', accountId);
    try {
        const response = await api.delete<BaseAuthResponse>(`/accounts/delete/${accountId}`);
        console.log('✅ Cuenta bancaria eliminada:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al eliminar cuenta bancaria:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
  },

  selectAccount: async (accountId: string): Promise<BaseAuthResponse> => {
    console.log('🔄 Iniciando selección de cuenta bancaria:', accountId);
    try {
        const response = await api.post<BaseAuthResponse>(`/accounts/select/${accountId}`, {});
        console.log('✅ Cuenta bancaria seleccionada:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al seleccionar cuenta bancaria:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
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
    console.log('🔄 Iniciando cambio de contraseña');
    try {
        const response = await api.put<BaseAuthResponse>('/users/change/password', { 
            oldPwd, 
            newPwd 
        });
        console.log('✅ Contraseña actualizada exitosamente');
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al cambiar contraseña:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
  }
};