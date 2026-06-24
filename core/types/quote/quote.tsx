import { User } from "../user/user";

// Tipos base
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
  isFound?: boolean;
}

export interface Company {
  name: string;
  alias: string;
}

export interface Insurer {
  insurerId: string;
  name: string;
  alias: string;
  darkLogo: string;
  lightLogo: string;
}

export interface InsurancePlan {
  planId: string;
  insurer: Insurer;
  planName: string;
  valueUF: number;
  grossPriceUF: number;
  totalMonths: number;
  monthlyPrice: number;
  monthlyPriceUF: number;
  deductible: number;
  deductibleDesc?: string;
  discount: number;
  stolenVehicle: string;
  totalLoss: string;
  damageThirdParty: string;
  workshopType: string;
  coverages?: PlanCoverage[];
  details: string[];
}

export interface PlanCoverage {
  id?: number;
  name?: string;
  generalDescription?: string;
  polCad?: string;
  value?: string;
}

export interface QuoteVehicleParams {
  quoterId?: string;
  ppu: string;
  brand: string;
  model: string;
  year: string;
  insurerAlias?: string;
  requestType: string;
  purchaserId: string;
  purchaserName: string;
  purchaserPaternalSur: string;
  purchaserMaternalSur: string;
  purchaserEmail: string;
  purchaserPhone: string;
  ownerRelationOption: string;
  colour?: string;
  engineNum?: string;
  chassisNum?: string;
}

export interface SelectPlanParams {
  quoterId: string | null;
  planId: string;
  insurer: string;
  planName: string;
  valueUF: number;
  grossPriceUF: number;
  totalMonths: number;
  monthlyPriceUF: number;
  monthlyPrice: number;
  deductible: number;
  deductibleDesc: string;
  discount: number;
  ownerName: string;
  ownerPaternalSur: string;
  ownerMaternalSur: string;
  street: string;
  streetNumber: string;
  department: string;
  region?: string;
  commune?: string;
}

export interface OwnerDataDraft {
  ownerName: string;
  ownerPaternalSur: string;
  ownerMaternalSur: string;
  street: string;
  streetNumber: string;
  department: string;
  city: string;
  commune: string;
}

export interface Region {
  regionId: string;
  region: string;
  locations: string[];
}

export interface RegionsResponse {
  message: string;
  status: number;
  data: {
    regions?: Region[];
    cities?: Region[];
    tokens?: {
      jwtSession: string;
      jwtRefresh: string;
    };
    user?: User;
  };
}

// Respuestas de API
export interface SearchResponse {
  message: string;
  status: number;
  data: {
      quoterId?: string | number | (string | number)[] | null | undefined;
      insurers?: string[];
      vehicle?: Vehicle;
      tokens: {
          jwtSession: string;
          jwtRefresh: string;
      };
      user: any;
  };
}

export interface QuoteVehicleResponse {
  message: string;
  status: number;
  data: {
    quoterId: string;
    error?: string;
    errorMessage?: string;
    requestBody?: string;
    response?: string;
    insurer: Insurer;
    plans: InsurancePlan[];
  };
}

export interface QuoteVehicleData {
  quoterId: string | null;
  insurers?: Insurer[];
  plans: InsurancePlan[];
}

export interface QuoteResult {
  plans: InsurancePlan[];
  quoterId: string | null;
  insurer?: Insurer;
  error?: string;
  errorMessage?: string;
  insurerAlias?: string;
  requestSucceeded?: boolean;
}

export interface Model {
  modelId: string;
  model: string;
}

export interface Brand {
  brandId: string;
  brand: string;
  models: Model[];
}

export interface VehiclesResponse {
  message: string;
  status: number;
  data: {
      brands: Brand[];
      tokens: {
          jwtSession: string;
          jwtRefresh: string;
      };
      user: User;
  };
}

// Constantes
export const OWNER_OPTIONS_MAP = {
  "Si, soy el dueño del vehículo": "0",
  "No, soy el padre/madre del dueño": "1",
  "No, soy el conviviente civil del dueño": "2",
  "No, soy el cónyuge del dueño": "3",
  "No, soy el hijo(a) del dueño": "4"
} as const;

// Añadir nuevos tipos

export interface GenerateTransactionParams {
    quoterId: string | null;
}
