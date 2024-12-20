import { Notifications } from "./useNotifications";
import { Wallet } from "../wallet/wallet";

export interface User {
    userId: string;
    codeToSuggest: string;
    personalData: {
      name: string;
      surname: string;
      email: string;
      phone: string;
      address: string;
      dateOfBirth: string;
      profilePicture: string;
      enable: boolean;
    };
    notifs: Notifications;
    wallet: Wallet;
    accounts: any[];
    quoterPeople: any[];
    deleteAccount: null;
  }