import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

// Servicio para registrar un nuevo usuario
export const register = async (name: string, surname: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/app/auth/register`, {
      name,
      surname,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

// Servicio para iniciar sesión
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/app/auth/log-in`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};

// Nuevo servicio para refrescar el token
export const refreshToken = async (token: string) => {
  try {
    const response = await axios.post(`${apiUrl}/app/auth/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    throw error;
  }
};

// Nuevo servicio para obtener datos del usuario
export const getUserData = async (token: string) => {
  try {
    const response = await axios.get(`${apiUrl}/app/user/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};