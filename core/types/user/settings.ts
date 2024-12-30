export interface PersonalData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profilePicture?: string;
};

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

export interface ThemeOption {
  id: 'light' | 'dark' | 'system';
  title: string;
  description: string;
}

export interface NotificationSetting {
  id: keyof NotificationPreferences;
  title: string;
  description: string;
  isEnabled: boolean;
  type: 'switch' | 'checkbox';
}

export interface NotificationPreferences {
  byEmail: boolean;
  byPush: boolean;
  commissionUpdate: boolean;
  paymentProblems: boolean;
  referredAccepted: boolean;
  saleState: boolean;
  specialOffers: boolean;
  withdrawalAvailability: boolean;
} 