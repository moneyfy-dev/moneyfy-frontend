import axios from 'axios';
import getEnvVars from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { apiUrl } = getEnvVars();

export const changePassword = async (oldPwd: string, newPwd: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    if (!token || !sessionToken) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await axios.put(
      `${apiUrl}/users/change/password`,
      { oldPwd, newPwd },
      {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Refresh-Token': token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error;
  }
};

// Funciones para manejar configuraciones locales
export const getLocalSecuritySettings = async () => {
  try {
    const settings = await AsyncStorage.getItem('securitySettings');
    return settings ? JSON.parse(settings) : { fingerprintEnabled: false, persistentAuthEnabled: false };
  } catch (error) {
    console.error('Error al obtener configuraciones de seguridad locales:', error);
    return { fingerprintEnabled: false, persistentAuthEnabled: false };
  }
};

export const updateLocalSecuritySettings = async (settings: { fingerprintEnabled: boolean, persistentAuthEnabled: boolean }) => {
  try {
    await AsyncStorage.setItem('securitySettings', JSON.stringify(settings));
    return settings;
  } catch (error) {
    console.error('Error al actualizar configuraciones de seguridad locales:', error);
    throw error;
  }
};