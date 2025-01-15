import { NotificationPreferences, PersonalData } from "./settings";
import { Wallet } from "../wallet/wallet";
import { Quoter } from "../quoter/quoter";

export interface User {
    userId: string;
    codeToRefer: string;
    disableAccount: null;
    personalData: PersonalData;
    wallet: Wallet;
    notifPreference: NotificationPreferences;
    accounts: any[];
    quoters: Quoter[];
  }

export interface Referred {
  email: string;
  name: string;
  surname: string;
  status: string;
  totalReferreds: number;
  totalIncome: number;
}

export type ReferredStatus = 'Activo' | 'Pausado' | 'Eliminado';
