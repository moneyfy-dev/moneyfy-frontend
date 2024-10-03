import axios from 'axios';
import getEnvVars from '../config';

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

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await axios.post(`${apiUrl}/app/user/change-password`, { currentPassword, newPassword });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error;
  }
};