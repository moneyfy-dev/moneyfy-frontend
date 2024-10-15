import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

export const updateUserInfo = async (token: string, userData: {
  name: string;
  surname: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profilePicture: string | null;
}) => {
  try {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('surname', userData.surname);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address);
    formData.append('dateOfBirth', userData.dateOfBirth);

    if (userData.profilePicture) {
      const uriParts = userData.profilePicture.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('profilePicture', {
        uri: userData.profilePicture,
        name: `profilePicture.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    } else {
      formData.append('profilePicture', '');
    }

    // Mostrar los datos del form para depuración
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await axios.put(`${apiUrl}/users/update`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Removemos el Content-Type para que axios lo maneje automáticamente
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating user info:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      throw error;
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Failed to update user data');
    }
  }
};

// Función de prueba con datos estáticos
export const testUpdateUserInfo = async (token: string) => {
  const testData = {
    name: 'Test Name',
    surname: 'Test Surname',
    phone: '+56912345678',
    address: 'Test Address',
    dateOfBirth: '1990-01-01',
    profilePicture: ''
  };

  try {
    console.log('Sending test data:', testData);
    console.log('Token:', token);
    
    const formData = new FormData();
    Object.keys(testData).forEach(key => {
      formData.append(key, testData[key as keyof typeof testData] as string);
    });

    // Mostrar los datos del form para depuración
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await axios.put(`${apiUrl}/users/update`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Test update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Test update failed:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
    }
    throw error;
  }
};
