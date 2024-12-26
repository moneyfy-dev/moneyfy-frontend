import { User } from "@/core/types";

export interface RegisterRequest {
    name: string;
    surname: string;
    pwd: string;
    email: string;
    codeToRefer?: string;
}

  export interface RegisterResponse {
    data: {
      tokens: {
        jwtRefresh: string;
        jwtSession: string;
      };
      user: User;
    };
    message: string;
    status: number;
  }