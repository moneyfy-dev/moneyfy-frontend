import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    releaseAuthRequest?: () => void;
  }
}
