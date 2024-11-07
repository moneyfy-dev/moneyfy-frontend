export interface Vehicle {
  ppu: string;
  type: string;
  brand: string;
  model: string;
  year: string;
  colour: string;
  engineNum: string;
  chassisNum: string;
  manufacturer: string;
}

export interface SearchResponse {
  message: string;
  status: number;
  data: {
    vehicle?: Vehicle;
    vehicles?: Vehicle[];
    tokens: {
      jwtSession: string;
      jwtRefresh: string;
    };
    user: any; // Podemos definir la estructura completa si es necesario
  };
}

export interface QuoteResponse {
  message: string;
  status: number;
  data: {
    tokens: {
      jwtSession: string;
      jwtRefresh: string;
    };
    user: any;
    plans: Array<{
      priceId: string;
      insuranceCompany: string;
      planName: string;
      price: number;
      priceUf: number;
      deductible: number;
      discount: string;
    }>;
  };
}

export const OWNER_OPTIONS_MAP = {
  "Si, soy el dueño del vehículo": "0",
  "No, soy el padre/madre del dueño": "1",
  "No, soy el conviviente civil del dueño": "2",
  "No, soy el cónyuge del dueño": "3",
  "No, soy el hijo(a) del dueño": "4"
} as const; 