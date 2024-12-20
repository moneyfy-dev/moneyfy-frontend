export interface RegisterRequest {
    name: string;
    surname: string;
    email: string;
    password: string;
    referralCode?: string;
  }

export interface RegisterResponse {
    message: string;
    status?: number;
    data?: any;
  }