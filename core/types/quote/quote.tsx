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
    quoterId: string | number | (string | number)[] | null | undefined;
    companies?: Company[];
    vehicle?: Vehicle;
    tokens: {
      jwtSession: string;
      jwtRefresh: string;
    };
    user: any;
  };
}

export interface QuoteVehicleParams {
  quoterId?: string;
  ppu: string;
  brand: string;
  model: string;
  year: string;
  purchaserId: string;
  ownerOption: string;
  companyAlias: string;
  colour?: string;
  engineNum?: string;
  chassisNum?: string;
}

export interface InsurancePlan {
  planId: string;
  insuranceCompany: string;
  planName: string;
  price: number;
  priceUf: number;
  deductible: number;
  discount: number;
  stolenVehicle: string;
  workshopType: string;
  totalLoss: string;
  damageThirdParty: string
  details: string[];
  createdDate: string;
  updatedDate: string;
}

export interface QuoteVehicleResponse {
  message: string;
  status: number;
  data: {
    quoterId: string;
    plans: InsurancePlan[];
    vehicle: Vehicle;
    user: any;
    tokens: {
      jwtSession: string;
      jwtRefresh: string;
    };
  };
}

export interface SelectPlanParams {
  quoterId: string;
  planId: string;
  insuranceCompany: string;
  planName: string;
  price: number;
  priceUf: number;
  deductible: number;
  street: string;
  streetNumber: number;
  department: string;
}

export const OWNER_OPTIONS_MAP = {
  "Si, soy el dueño del vehículo": "0",
  "No, soy el padre/madre del dueño": "1",
  "No, soy el conviviente civil del dueño": "2",
  "No, soy el cónyuge del dueño": "3",
  "No, soy el hijo(a) del dueño": "4"
} as const; 