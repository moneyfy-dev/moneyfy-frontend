import React, { useState, useEffect } from 'react';
import { SettingsContext } from './SettingsContext';
import { SecuritySettings }  from '../../types/user/settings';
import { PersonalData } from '../../types/user/settings';
import { BankAccount } from '../../types/user/settings';
import { NotificationPreferences } from '../../types/user/settings';
import { settingsService } from '../../services/settings/index';
import { useUser } from '../user/useUser';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types';
import { api } from '../../services/api';

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
        if (user?.notifs) {
          setNotifications(user.notifs);
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
    console.log('🔄 SettingsProvider - Actualizando info personal:', info);
    try {
        const response = await settingsService.updatePersonalInfo(info);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
            // Actualizamos solo la información personal
            setPersonalInfo(response.data.user.personalData);
        }

        console.log('✅ Info personal actualizada:', response);
        
    } catch (error) {
        console.error('❌ Error en SettingsProvider - updatePersonalInfo:', error);
        throw error;
    }
  };

  const updateAccount = async (accountId: string, data: Partial<BankAccount>) => {
    console.log('🔄 SettingsProvider - Actualizando cuenta bancaria:', { accountId, ...data });
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

        console.log('✅ Cuenta bancaria actualizada exitosamente');
    } catch (error) {
        console.error('❌ Error en SettingsProvider - updateAccount:', error);
        throw error;
    }
  };

  const addAccount = async (account: Omit<BankAccount, 'accountId'>) => {
    console.log('🔄 SettingsProvider - Agregando cuenta bancaria:', account);
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

        console.log('✅ Cuenta bancaria agregada exitosamente');
    } catch (error) {
        console.error('❌ Error en SettingsProvider - addAccount:', error);
        throw error;
    }
  };

  const deleteAccount = async (accountId: string) => {
    console.log('🔄 SettingsProvider - Eliminando cuenta bancaria:', accountId);
    try {
        const response = await settingsService.deleteAccount(accountId);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
            setAccounts(response.data.user.accounts);
        }

        console.log('✅ Cuenta bancaria eliminada exitosamente');
        return response;
    } catch (error) {
        console.error('❌ Error en SettingsProvider - deleteAccount:', error);
        throw error;
    }
  };

  const selectAccount = async (accountId: string) => {
    console.log('🔄 SettingsProvider - Seleccionando cuenta bancaria:', accountId);
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

        console.log('✅ Cuenta bancaria seleccionada exitosamente');
        return response;
    } catch (error) {
        console.error('❌ Error en SettingsProvider - selectAccount:', error);
        throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    console.log('🔄 SettingsProvider - Cambiando contraseña');
    try {
        const response = await settingsService.changePassword(oldPassword, newPassword);
        
        // Actualizar el usuario con la respuesta completa
        if (response.data?.user) {
            await updateUserData(response.data.user);
        }

        console.log('✅ Contraseña actualizada exitosamente');
        return response;
    } catch (error) {
        console.error('❌ Error en SettingsProvider - changePassword:', error);
        throw error;
    }
  };

  const updateNotifications = async (prefs: Partial<NotificationPreferences>) => {
    try {
      const updatedPrefs = await settingsService.updateNotifications(prefs);
      setNotifications(prev => ({ ...prev, ...updatedPrefs }));
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
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
        updateNotifications,
        selectAccount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 