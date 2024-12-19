import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../config';
import { SearchResponse, QuoteVehicleParams, QuoteVehicleResponse, SelectPlanParams } from '@/core/types';

const { apiUrl } = getEnvVars();

// Búsqueda de compañias aseguradoras
export const searchCompanies = async (): Promise<SearchResponse> => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  
  const response = await axios.get(
    `${apiUrl}/referred/search/companies`,
    {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    }
  );
  
  return response.data;
};

// Cotización de vehículo
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
  
  return response.data;
};

// Nueva función para buscar vehículo
export const searchVehicle = async (ownerId: string, ppu: string): Promise<SearchResponse> => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  console.log('ppu', ppu);
  console.log('ownerId', ownerId);
  const response = await axios.post(
    `${apiUrl}/referred/search/vehicle`,
    {
      ownerId,
      ppu
    },
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



export const selectPlan = async (planData: SelectPlanParams) => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  console.log('planData', planData);
  
  const response = await axios.put<QuoteVehicleResponse>(
    `${apiUrl}/referred/select/plan`,
    planData,
    {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Refresh-Token': token
      },
    }
  );
  
  return response.data;
}; 