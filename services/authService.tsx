import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

// Servicio para registrar un nuevo usuario
export const register = async (name: string, lastname: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/app/auth/register`, {
      name,
      lastname,
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