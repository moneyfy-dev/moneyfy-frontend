import { Vehicle } from "../quote/quote";
import { User } from "../user/user";

export interface LoginResponse {
    data: {
      tokens: {
        jwtRefresh: string;
        jwtSession: string;
      };
      user: User | null;
      vehicles?: Vehicle[];
    };
    message: string;
    status: number;
  }

  export interface PasswordResetResponse {
    message: string;
    status?: number;
    data?: any;
  }

  export type ConfirmationFlowType = 'changeDevice' | 'registerUser' | 'restorePassword';