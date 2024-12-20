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

  export type ConfirmationFlowType = 'changeDevice' | 'registerUser' | 'restorePassword';