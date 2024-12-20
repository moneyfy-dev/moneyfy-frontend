export interface RestorePasswordRequest {
    email: string;
  }
  
  export interface ConfirmPasswordResetRequest {
    email: string;
    code: string;
    newPwd: string;
    repeatedPwd: string;
  }