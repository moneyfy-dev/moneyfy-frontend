import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

// Tipos para las respuestas
interface VehicleSearchResponse {
  data: {
    user: any; // Ajusta según la estructura real de la respuesta
    tokens?: {
      jwtRefresh: string;
      jwtSession: string;
    };
  };
  message: string;
  status: number;
}

interface QuoteResponse {
  data: {
    user: any; // Ajusta según la estructura real de la respuesta
    tokens?: {
      jwtRefresh: string;
      jwtSession: string;
    };
  };
  message: string;
  status: number;
}

// Búsqueda por patente
export const searchVehicleByPPU = async (ppu: string): Promise<VehicleSearchResponse> => {
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
export const searchVehicleByUserId = async (userId: string): Promise<VehicleSearchResponse> => {
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

// Cotización del vehículo
interface QuoteVehicleParams {
  brand: string;
  model: string;
  year: string;
  purchaserId: string;
  ownerOption: string;
}

export const quoteVehicle = async (quoteData: QuoteVehicleParams): Promise<QuoteResponse> => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  
  const response = await axios.post<QuoteResponse>(
    `${apiUrl}/segurosref/referred/vehicle/quote`,
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