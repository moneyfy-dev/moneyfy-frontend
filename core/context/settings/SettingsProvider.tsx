import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { SettingsContext } from './SettingsContext';
import { SecuritySettings }  from '../../types/user/settings';
import { PersonalData } from '../../types/user/settings';
import { BankAccount } from '../../types/user/settings';
import { NotificationPreferences } from '../../types/user/settings';
import { settingsService } from '../../services/settings/index';
import { useUser } from '../user/useUser';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserData } = useUser();
  const [security, setSecurity] = useState<SecuritySettings>({ fingerprintEnabled: false });
  const [personalInfo, setPersonalInfo] = useState<PersonalData>({} as PersonalData);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [notifications, setNotifications] = useState<NotificationPreferences>({} as NotificationPreferences);

  // Un solo useEffect para inicializar
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Cargar configuración de seguridad desde storage
        const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);
        setSecurity({ fingerprintEnabled: biometricEnabled === 'true' });

        // Cargar información personal desde el usuario actual
        if (user?.personalData) {
          setPersonalInfo(user.personalData);
        }

        // Cargar cuentas bancarias desde el usuario actual
        if (user?.accounts) {
          setAccounts(user.accounts);
        }

        // Cargar preferencias de notificaciones desde el usuario actual
        if (user?.notifPreference) {
          setNotifications(user.notifPreference);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSecurity({ fingerprintEnabled: false });
      }
    };

    loadSettings();
  }, [user]);

  const updateSecurity = async (updates: Partial<typeof security>) => {
    try {
      setSecurity(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  };

  const updatePersonalInfo = async (info: Partial<PersonalData>) => {
    try {
        const response = await settingsService.updatePersonalInfo(info);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
            // Actualizamos solo la información personal
            setPersonalInfo(response.data.user.personalData);
        }
        
    } catch (error) {
        throw error;
    }
  };

  const updateAccount = async (accountId: string, data: Partial<BankAccount>) => {
    try {
        const response = await settingsService.updateAccount(accountId, data);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
        }
        
        // Actualizar las cuentas bancarias
        if (response.data?.user?.accounts) {
            setAccounts(response.data.user.accounts);
        }

    } catch (error) {
        throw error;
    }
  };

  const addAccount = async (account: Omit<BankAccount, 'accountId'>) => {
    try {
        const response = await settingsService.addAccount(account);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
        }
        
        // Actualizar las cuentas bancarias
        if (response.data?.user?.accounts) {
            setAccounts(response.data.user.accounts);
        }

    } catch (error) {
        throw error;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
        const response = await settingsService.deleteAccount(accountId);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
            setAccounts(response.data.user.accounts);
        }

        return response;
    } catch (error) {
        throw error;
    }
  };

  const selectAccount = async (accountId: string) => {
    try {
        const response = await settingsService.selectAccount(accountId);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
        }
        
        // Actualizar las cuentas bancarias
        if (response.data?.user?.accounts) {
            setAccounts(response.data.user.accounts);
        }

        return response;
    } catch (error) {
        throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
        const response = await settingsService.changePassword(oldPassword, newPassword);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
        }

        return response;
    } catch (error) {
        throw error;
    }
  };


const isBiometricAvailable = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

const authenticateBiometric = async (): Promise<boolean> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Autenticar con huella digital',
    fallbackLabel: 'Usar PIN',
  });
  return result.success;
};

  const updateNotifications = async (prefs: Partial<NotificationPreferences>) => {
    try {
      const updatedPrefs = await settingsService.updateNotifications(prefs);
      setNotifications(prev => ({ ...prev, ...updatedPrefs }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        security,
        personalInfo,
        accounts,
        notifications,
        updateSecurity,
        updatePersonalInfo,
        updateAccount,
        addAccount,
        deleteAccount,
        changePassword,
        isBiometricAvailable,
        authenticateBiometric,
        updateNotifications,
        selectAccount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 