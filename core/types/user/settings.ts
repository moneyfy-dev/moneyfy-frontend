export interface SecuritySettings {
  fingerprintEnabled: boolean;
}

export interface BankAccount {
  accountId: string;
  personalId: string;
  holderName: string;
  alias: string;
  email: string;
  bank: string;
  accountType: string;
  accountNumber: string;
  selected: boolean;
}

export interface NotificationPreferences {
  byEmail: boolean;
  byPush: boolean;
  commissionUpdate: boolean;
  saleState: boolean;
  withdrawalAvailability: boolean;
  referredAccepted: boolean;
  specialOffers: boolean;
  paymentProblems: boolean;
} 