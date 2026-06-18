import { Vehicle } from "../quote/quote";
import { User } from "../user/user";

export interface AuthTokens {
    jwtRefresh?: string;
    jwtSession?: string;
}

export interface AuthResponseData {
    tokens?: AuthTokens;
    refreshToken?: string;
    sessionToken?: string;
    user: User;
    vehicles?: Vehicle[];
}

export interface LoginResponse {
    data: AuthResponseData;
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

  export type ConfirmationFlowType = 'registerUser' | 'restorePassword';
