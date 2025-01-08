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