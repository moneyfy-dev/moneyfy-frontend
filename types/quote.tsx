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

export interface Company {
  name: string;
  alias: string;
}

export interface SearchResponse {
  message: string;
  status: number;
  data: {
    companies?: Company[];
    vehicles?: Vehicle[];
    tokens: {
      jwtSession: string;
      jwtRefresh: string;
    };
    user: any;
  };
}

export interface QuoteVehicleParams {
  ppu: string;
  brand: string;
  model: string;
  year: string;
  purchaserId: string;
  ownerOption: string;
  companyAlias: string;
}

export interface InsurancePlan {
  priceId: string;
  insuranceCompany: string;
  planName: string;
  price: number;
  priceUf: number;
  deductible: number;
  discount: string;
}

export interface QuoteVehicleResponse {
  message: string;
  status: number;
  data: {
    tokens: {
      jwtSession: string;
      jwtRefresh: string;
    };
    user: any;
    plans: InsurancePlan[];
  };
}

export const OWNER_OPTIONS_MAP = {
  "Si, soy el dueño del vehículo": "0",
  "No, soy el padre/madre del dueño": "1",
  "No, soy el conviviente civil del dueño": "2",
  "No, soy el cónyuge del dueño": "3",
  "No, soy el hijo(a) del dueño": "4"
} as const; 