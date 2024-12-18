import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../config';
import { VehiclesResponse } from '@/core/types/vehicles';

const { apiUrl } = getEnvVars();

export const getAvailableVehicles = async (): Promise<VehiclesResponse> => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  
  const response = await axios.get(
    `${apiUrl}/referred/search/available/vehicles`,
    {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    }
  );
  
  return response.data;
}; 