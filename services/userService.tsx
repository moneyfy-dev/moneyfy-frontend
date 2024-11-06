import axios from 'axios';
import getEnvVars from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { apiUrl } = getEnvVars();

export const updateUserProfile = async (userData: {
  name: string;
  surname: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profilePicture?: string;
}) => {
  try {
    const [token, sessionToken] = await Promise.all([
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('sessionToken')
    ]);

    if (!token || !sessionToken) {
      throw new Error('No se encontraron los tokens necesarios');
    }
    
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (key !== 'profilePicture') {
        const value = userData[key as keyof typeof userData];
        if (typeof value === 'string') {
          formData.append(key, value);
        }
      }
    });

    if (userData.profilePicture !== undefined) {
      if (userData.profilePicture === '') {
        // Si la imagen de perfil es una cadena vacía, indica que debe ser eliminada
        formData.append('profilePicture', '');
      } else {
        const uriParts = userData.profilePicture.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('profilePicture', {
          uri: userData.profilePicture,
          name: `profilePicture.${fileType}`,
          type: `image/${fileType}`
        } as any);
      }
    }

    console.log('formData',formData);

    const response = await axios.put(`${apiUrl}/users/update`, formData, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Update successful:', response.data);
    return response.data; // Devuelve los datos del usuario actualizados
  } catch (error) {
    console.error('Update failed:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    }
    throw error;
  }
};