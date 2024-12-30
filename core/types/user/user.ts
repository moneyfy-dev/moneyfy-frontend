import { NotificationPreferences, PersonalData } from "./settings";
import { Wallet } from "../wallet/wallet";

export interface User {
    userId: string;
    codeToRefer: string;
    personalData: PersonalData;
    notifs: NotificationPreferences;
    wallet: Wallet;
    accounts: any[];
    quoterPeople: any[];
    deleteAccount: null;
  }