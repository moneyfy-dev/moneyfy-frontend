import { createContext } from 'react';

export interface MessageConfig {
  showSuccessMessage: boolean;
  customSuccessMessage?: string;
  customErrorMessage?: string;
}

export interface MessageContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  getEndpointConfig: (endpoint: string) => MessageConfig | undefined;
  configureEndpoint: (endpoint: string, config: MessageConfig) => void;
  clearMessage: () => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined); 