import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

export const register = async (name: string, surname: string, email: string, password: string) => {
  try {
    const requestData = { name, surname, pwd: password, email };
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
    throw error;
  }
};

export const resendConfirmationCode = async (email: string) => {
  try {
    const requestData = { email };
    const response = await axios.put(`${apiUrl}/auth/resend/code`, {
      email
    });
    return response.data;
  } catch (error) {
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
    throw error;
  }
};

export const getUserData = async (token: string) => {
  try {
    const response = await axios.post(`${apiUrl}/users/hydration/data`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<{ isValid: boolean; userData: any }> => {
  
  try {
    const response = await axios.post(`${apiUrl}/users/hydration/data`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { isValid: response.data.status === 200, userData: response.data.data };
  } catch (error) {
    return { isValid: false, userData: null };
  }
};