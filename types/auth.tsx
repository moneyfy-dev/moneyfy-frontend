import { Vehicle } from "./quote";
import { Notifications } from "./useNotifications";

export interface LoginResponse {
    data: {
      tokens: {
        jwtRefresh: string;
        jwtSession: string;
      };
      user: User;
      vehicles?: Vehicle[];
    };
    message: string;
    status: number;
  }

 export interface Wallet {
    totalBalance: number;
    outstandingBalance: number;
    availableBalance: number;
    paymentBalance: number;
    history: any[];
  }
  
  export interface User {
    userId: string;
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
    referredPeople: any[];
  }
  
  export interface AuthContextProps {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    user: User | null;
    refreshUserSession: () => Promise<void>;
    updateUserData: (updatedData: any) => Promise<void>;
    isPersistentAuthRequired: boolean;
    handlePersistentAuthSuccess: () => Promise<void>;
    userEmail: string;
    isPersistentAuthConfigured: boolean;
    checkPersistentAuth: () => Promise<boolean>;
    checkAuthStatus: () => Promise<void>;
    hydrateUserData: (force?: boolean) => Promise<void>;
  }