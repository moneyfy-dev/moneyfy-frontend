import { api } from '../api';
import type { 
  User,
  ApiResponse 
} from '@/core/types';

export const userService = {
  getUserData: async (): Promise<ApiResponse> => {
    console.log('📡 Iniciando solicitud getUserData');
    try {
      const response = await api.post('/users/hydration/data');
      console.log('📥 Respuesta getUserData:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en getUserData:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        requestHeaders: error.config?.headers
      });
      throw error;
    }
  },

  updateProfile: async (userData: {
    name: string;
    surname: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    profilePicture?: string;
  }): Promise<ApiResponse> => {
    const formData = new FormData();
    
    // Procesar datos básicos
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== 'profilePicture' && value) {
        formData.append(key, value);
      }
    });

    // Procesar imagen de perfil
    if (userData.profilePicture !== undefined) {
      if (userData.profilePicture === '') {
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

    const response = await api.put('/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};