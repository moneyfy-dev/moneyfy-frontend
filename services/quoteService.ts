import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../config';
import { SearchResponse, QuoteVehicleParams, QuoteVehicleResponse } from '@/types/quote';

const { apiUrl } = getEnvVars();

// Búsqueda por patente
export const searchVehicleByPPU = async (ppu: string): Promise<SearchResponse> => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  
  const response = await axios.post(
    `${apiUrl}/referred/search/vehicle/ppu`,
    {
      data: ppu,
      searchType: "PPU"
    },
    {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    }
  );
  
  return response.data;
};

// Búsqueda por ID de usuario
export const searchVehicleByUserId = async (userId: string): Promise<SearchResponse> => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  
  const response = await axios.post(
    `${apiUrl}/referred/search/vehicle/user-id`,
    {
      data: userId,
      searchType: "USER_ID"
    },
    {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    }
  );
  
  return response.data;
};

export const quoteVehicle = async (quoteData: QuoteVehicleParams): Promise<QuoteVehicleResponse> => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  
  const response = await axios.post<QuoteVehicleResponse>(
    `${apiUrl}/referred/vehicle/quote`,
    quoteData,
    {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    }
  );
  console.log('response', response.data);
  
  return response.data;
}; 