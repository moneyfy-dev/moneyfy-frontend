import { User } from "@/core/types";
import type { AuthTokens } from "./auth";

export interface RegisterRequest {
    name: string;
    surname: string;
    pwd: string;
    email: string;
    codeToRefer?: string;
}

  export interface RegisterResponse {
    data: {
      tokens?: AuthTokens;
      refreshToken?: string;
      sessionToken?: string;
      user: User;
    };
    message: string;
    status: number;
  }
