import { Referral } from '@/types/referral';

export const mockReferrals: Referral[] = [
  {
    referredId: "6740a6088a56203830d2ccef",
    referredStatus: "inspeccion",
    createdDate: "2024-11-22T12:40:56.098",
    updatedDate: "2024-11-22T15:40:39.396",
    approvalDate: "1900-01-01T00:00:00",
    referredPersonalData: {
      purchaserId: "44.444.444-4",
      name: "Juan",
      surname: "Pérez",
      phone: "+56912345678",
      email: "juan.perez@gmail.com",
      ownerOption: "0"
    },
    referredCarData: {
      ppu: "GH9012",
      brand: "Ford",
      model: "Fiesta",
      year: "2018",
      colour: "Rojo",
      engineNum: "123456",
      chassisNum: "789012",
      manufacturer: "Ford"
    },
    referredPlanData: {
      id: "SEGUROSALAMEDA045678987",
      insuranceCompany: "Seguros Alameda",
      planName: "Asistencia en viaje",
      price: 32000,
      priceUf: 0.9,
      deductible: 3,
      discount: "10"
    },
    referredAddressData: {
      street: "Las Higueras",
      streetNumber: 2250,
      department: "",
      inspection: "domicilio"
    },
    referredPayment: {
      holderName: "Juan Pérez",
      type: "credit",
      cardNumber: "**** **** **** 1234",
      dueDate: "2025-12"
    }
  },
  {
    referredId: "6740a62e8a56203830d2ccf0",
    referredStatus: "cotizando",
    createdDate: "2024-11-22T12:41:34.429",
    updatedDate: "2024-11-22T12:41:34.429",
    approvalDate: "1900-01-01T00:00:00",
    referredPersonalData: {
      purchaserId: "",
      name: "María",
      surname: "González",
      phone: "+56987654321",
      email: "maria.g@gmail.com",
      ownerOption: ""
    },
    referredCarData: {
      ppu: "KLRF33",
      brand: "NovaTest",
      model: "Turbo",
      year: "2024",
      colour: "Negro",
      engineNum: "N0V0T3STT4RB0",
      chassisNum: "N0V0T3STT3ST3R",
      manufacturer: "Tester"
    },
    referredPlanData: {
      id: "",
      insuranceCompany: "",
      planName: "",
      price: 0,
      priceUf: 0,
      deductible: 0,
      discount: "0"
    },
    referredAddressData: {
      street: "",
      streetNumber: -1,
      department: "",
      inspection: ""
    },
    referredPayment: {
      holderName: "",
      type: "",
      cardNumber: "",
      dueDate: ""
    }
  },
  {
    referredId: "6740cb0b2b5209007c527422",
    referredStatus: "aprovado",
    createdDate: "2024-11-22T15:18:51.714",
    updatedDate: "2024-11-22T15:23:00.806",
    approvalDate: "2024-11-23T00:00:00",
    referredPersonalData: {
      purchaserId: "77.777.777-7",
      name: "Carlos",
      surname: "Silva",
      phone: "+56923456789",
      email: "carlos.s@gmail.com",
      ownerOption: "0"
    },
    referredCarData: {
      ppu: "GH9012",
      brand: "Ford",
      model: "Fiesta",
      year: "2018",
      colour: "Azul",
      engineNum: "",
      chassisNum: "",
      manufacturer: ""
    },
    referredPlanData: {
      id: "TRACTOR045678987",
      insuranceCompany: "Tractor Seguros Automotriz",
      planName: "Plan protector de auto",
      price: 35000,
      priceUf: 1.0,
      deductible: 2,
      discount: "15"
    },
    referredAddressData: {
      street: "Av. Avellaneda",
      streetNumber: 7880,
      department: "",
      inspection: "auto-inspeccion"
    },
    referredPayment: {
      holderName: "Carlos Silva",
      type: "debit",
      cardNumber: "**** **** **** 5678",
      dueDate: ""
    }
  }
]; 