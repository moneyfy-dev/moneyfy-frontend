import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

export const register = async (name: string, surname: string, email: string, password: string) => {
  try {
    const requestData = { name, surname, pwd: password, email };
    console.log('Datos de registro a enviar:', requestData);
    const response = await axios.post(`${apiUrl}/auth/register`, requestData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400 && error.response.data?.message) {
        // Si es un error 400 con un mensaje específico, lo propagamos
        throw new Error(error.response.data.message);
      }
      // Para otros errores, propagamos el error con el status
      throw { ...error, status: error.response.status };
    }
    console.error('Error en el registro:', error);
    throw error;
  }
};

export const confirmRegistration = async (email: string, code: string) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/confirm/registration`, {
      email,
      code
    });
    return response.data;
  } catch (error) {
    console.error('Error en la confirmación del registro:', error);
    throw error;
  }
};

export const resendConfirmationCode = async (email: string) => {
  try {
    const requestData = { email };
    console.log('Datos de registro a enviar:', requestData);
    const response = await axios.post(`${apiUrl}/auth/resend/code`, {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Error al reenviar el código de confirmación:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/log-in`, {
      email,
      pwd: password
    });
    return response.data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};

export const getUserData = async (token: string) => {
  try {
    const response = await axios.get(`${apiUrl}/users/hydration/data`, {
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

export const verifyToken = async (token: string): Promise<boolean> => {
  console.log('Iniciando verificación de token');
  try {
    const response = await axios.get(`${apiUrl}/users/hydration/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Respuesta de verificación de token:', response.data);
    return response.data.isValid;
  } catch (error) {
    console.error('Error verifying token:', error);
    if (axios.isAxiosError(error) && !error.response) {
      console.log('Error de red al verificar token, considerando inválido');
      return false;
    }
    throw error;
  }
};