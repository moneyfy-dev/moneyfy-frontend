export type QuoterStatus = 'Iniciando' | 'Cotizando' | 'Recopilando' | 'Aprobado' | 'Rechazado' | 'Caducado';

export interface QuoterOwnerData {
  personalId: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
}

export interface QuoterCarData {
  ppu: string;
  brand: string;
  model: string;
  year: string;
  colour: string;
  engineNum: string;
  chassisNum: string;
  manufacturer: string;
}

export interface QuoterPlanData {
  quoterPlanId: string;
  insurer: string;
  planName: string;
  price: number;
  priceUf: number;
  deductible: number;
}

export interface QuoterAddressData {
  street: string;
  streetNumber: string;
  department: string;
}

export interface QuoterPayment {
  holderName: string;
  type: string;
  cardNumber: string;
  dueDate: string;
}

export interface Quoter {
  quoterId: string;
  quoterStatus: QuoterStatus;
  createdDate: string;
  updatedDate: string;
  approvalDate: string;
  quoterOwnerData: QuoterOwnerData;
  quoterCarData: QuoterCarData;
  quoterPlanData: QuoterPlanData;
  quoterAddressData: QuoterAddressData;
  quoterPayment: QuoterPayment;
}
