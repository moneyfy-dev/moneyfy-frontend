import axios from 'axios';
import getEnvVars from '../../config';

const { apiUrl } = getEnvVars();

// Función de prueba para verificar la URL y las credenciales
// const testLoginConnection = async () => {
//   try {
//     console.log('API URL:', apiUrl); // Para verificar que la URL se está cargando correctamente
//     const testResponse = await axios.post(`${apiUrl}/auth/log-in`, {
//       email: 'alejandro.osses.r@gmail.com',
//       pwd: 'Lololanda'
//     });
//     console.log('Test Login Response:', testResponse.data);
//     return testResponse;
//   } catch (error) {
//     console.error('Test Login Error:', error);
//     console.error('API URL used:', apiUrl);
//     if (axios.isAxiosError(error)) {
//       console.error('Error Response:', error.response?.data);
//       console.error('Error Status:', error.response?.status);
//     }
//     throw error;
//   }
// };

export const register = async (name: string, surname: string, email: string, password: string, referralCode?: string) => {
  try {
    const requestData = { name, surname, pwd: password, email, referralCode };
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
  console.log(email, code);
  try {
    const response = await axios.post(`${apiUrl}/auth/confirm/registration`, {
      email,
      code
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const confirmDeviceChange = async (email: string, code: string) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/confirm/device-change`, {
      email,
      code
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendConfirmationCode = async (email: string, type: string) => {
  try {
    const response = await axios.put(`${apiUrl}/auth/resend/code`, {
      email,
      type
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
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error de inicio de sesión:', {
        mensaje: error.response?.data?.message,
        estado: error.response?.status,
        datos: error.response?.data,
        configuración: error.config
      });
      
      // Lanzamos un error más informativo
      if (error.response) {
        throw {
          mensaje: error.response.data?.message || 'Error desconocido',
          estado: error.response.status,
          datos: error.response.data
        };
      }
    }
    // Si no es un error de Axios, lanzamos el error original
    throw error;
  }
};

export const getUserData = async (token: string, sessionToken: string) => {
  try {
    const response = await axios.post(`${apiUrl}/users/hydration/data`, null, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: string, sessionToken: string): Promise<{ isValid: boolean; userData: any }> => {
  try {
    const response = await axios.post(`${apiUrl}/users/hydration/data`, null, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    });
    return { isValid: response.data.status === 200, userData: response.data.data };
  } catch (error) {
    return { isValid: false, userData: null };
  }
};
