import axios from 'axios';
import getEnvVars from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { apiUrl } = getEnvVars();

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  fingerprintEnabled: boolean;
}

export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  try {
    const response = await axios.get(`${apiUrl}/app/user/security-settings`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener configuración de seguridad:', error);
    throw error;
  }
};

export const updateSecuritySettings = async (settings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
  try {
    const response = await axios.put(`${apiUrl}/app/user/security-settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar configuración de seguridad:', error);
    throw error;
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await axios.post(
      `${apiUrl}/app/users/restore/password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error;
  }
};