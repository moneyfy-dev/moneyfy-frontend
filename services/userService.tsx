import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

export const updateUserProfile = async (token: string, userData: {
  name: string;
  surname: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profilePicture?: string;
}) => {
  try {
    console.log('Sending user data:', JSON.stringify({ ...userData, profilePicture: userData.profilePicture ? 'Image present' : 'No image' }));
    
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (key !== 'profilePicture') {
        const value = userData[key as keyof typeof userData];
        if (typeof value === 'string') {
          formData.append(key, value);
        }
      }
    });

    if (userData.profilePicture) {
      const uriParts = userData.profilePicture.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('profilePicture', {
        uri: userData.profilePicture,
        name: `profilePicture.${fileType}`,
        type: `image/${fileType}`
      } as any);
    }

    const response = await axios.put(`${apiUrl}/users/update`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Update successful:', response.data);
    return response.data.data.user; // Devuelve los datos del usuario actualizados
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
