import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

export interface PersonalInfo {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  try {
    const response = await axios.get(`${apiUrl}/app/user/personal-info`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener información personal:', error);
    throw error;
  }
};

export const updatePersonalInfo = async (info: PersonalInfo): Promise<PersonalInfo> => {
  try {
    const response = await axios.put(`${apiUrl}/app/user/personal-info`, info);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar información personal:', error);
    throw error;
  }
};