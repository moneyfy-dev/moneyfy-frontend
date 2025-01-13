import { Vehicle } from "../quote/quote";
import { User } from "../user/user";

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

  export interface PasswordResetResponse {
    message: string;
    status?: number;
    data?: any;
  }

  export interface ConfirmCodeRequest {
    email: string, 
    code: string, 
    flow: ConfirmationFlowType,
    newPassword?: { pwd: string, repeatedPwd: string }
  }

  export type ConfirmationFlowType = 'changeDevice' | 'registerUser' | 'restorePassword';