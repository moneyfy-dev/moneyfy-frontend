import { api } from '../api';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import type { 
  User,
  ApiResponse,
  WeeklyEarnings,
  MonthlyEarnings,
  Payment
} from '@/core/types';

export interface UserDashboardEarningsCache {
  fetchedAt: number;
  mode: 'weekly' | 'monthly';
  weeklyEarnings: WeeklyEarnings | null;
  monthlyEarnings: MonthlyEarnings | null;
}

export const userService = {
  getUserData: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/users/hydration/data', {}, {
        skipGlobalErrorMessage: true,
      } as any);
      return response.data;
    } catch (error: any) {
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
  },

  getReferreds: async (): Promise<ApiResponse> => {
    const response = await api.post('/users/list/referreds', {}, {
      skipGlobalErrorMessage: true,
    } as any);
    return response.data;
  },

  getWeeklyEarnings: async (): Promise<ApiResponse<{ weeklyEarnings: WeeklyEarnings; user?: User }>> => {
    const response = await api.post('/users/weekly/earnings', {}, {
      skipGlobalErrorMessage: true,
    } as any);
    return response.data;
  },

  getMonthlyEarnings: async (): Promise<ApiResponse<{ monthlyEarnings: MonthlyEarnings; user?: User }>> => {
    const response = await api.post('/users/monthly/earnings', {}, {
      skipGlobalErrorMessage: true,
    } as any);
    return response.data;
  },

  getCachedDashboardEarnings: async (): Promise<UserDashboardEarningsCache | null> => {
    return storage.get<UserDashboardEarningsCache>(STORAGE_KEYS.DASHBOARD.USER_EARNINGS);
  },

  setCachedDashboardEarnings: async (payload: UserDashboardEarningsCache): Promise<void> => {
    await storage.set(STORAGE_KEYS.DASHBOARD.USER_EARNINGS, payload);
  },

  getPayments: async (): Promise<ApiResponse<{ userPayments: Payment[]; user?: User }>> => {
    const response = await api.post('/users/obtain/payments', {}, {
      skipGlobalErrorMessage: true,
    } as any);
    return response.data;
  }
};
