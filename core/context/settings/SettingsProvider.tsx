import React, { useState, useEffect } from 'react';
import { SettingsContext } from './SettingsContext';
import { SecuritySettings }  from '../../types/user/settings';
import { PersonalData } from '../../types/user/user';
import { BankAccount } from '../../types/user/settings';
import { NotificationPreferences } from '../../types/user/settings';
import { settingsService } from '../../services/settings/index';
import { useUser } from '../user/useUser';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
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
    try {
      const updatedInfo = await settingsService.updatePersonalInfo(info);
      setPersonalInfo(prev => ({ ...prev, ...updatedInfo }));
    } catch (error) {
      console.error('Error al actualizar información personal:', error);
      throw error;
    }
  };

  const updateAccount = async (accountId: string, data: Partial<BankAccount>) => {
    try {
      const updatedAccount = await settingsService.updateAccount(accountId, data);
      setAccounts(prev => prev.map(acc => 
        acc.accountId === accountId ? updatedAccount : acc
      ));
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  };

  const addAccount = async (account: Omit<BankAccount, 'accountId'>) => {
    try {
      const newAccount = await settingsService.addAccount(account);
      setAccounts(prev => [...prev, newAccount]);
    } catch (error) {
      console.error('Error al agregar cuenta:', error);
      throw error;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      await settingsService.deleteAccount(accountId);
      setAccounts(prev => prev.filter(acc => acc.accountId !== accountId));
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await settingsService.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 