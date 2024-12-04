export type ReferralStatus = 'cotizando' | 'inspeccion' | 'aprobado' | 'rechazado';

export interface ReferredPersonalData {
  purchaserId: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  ownerOption: string;
}

export interface ReferredCarData {
  ppu: string;
  brand: string;
  model: string;
  year: string;
  colour: string;
  engineNum: string;
  chassisNum: string;
  manufacturer: string;
}

export interface ReferredPlanData {
  id: string;
  insuranceCompany: string;
  planName: string;
  price: number;
  priceUf: number;
  deductible: number;
  discount: string;
}

export interface ReferredAddressData {
  street: string;
  streetNumber: number;
  department: string;
  inspection: string;
}

export interface ReferredPayment {
  holderName: string;
  type: string;
  cardNumber: string;
  dueDate: string;
}

export interface Referral {
  referredId: string;
  referredStatus: ReferralStatus;
  createdDate: string;
  updatedDate: string;
  approvalDate: string;
  referredPersonalData: ReferredPersonalData;
  referredCarData: ReferredCarData;
  referredPlanData: ReferredPlanData;
  referredAddressData: ReferredAddressData;
  referredPayment: ReferredPayment;
} 