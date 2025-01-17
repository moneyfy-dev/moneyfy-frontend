import { createContext } from 'react';
import { MessageConfig } from '@/core/config/messages';

export interface MessageContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  getEndpointConfig: (endpoint: string) => MessageConfig | undefined;
  configureEndpoint: (endpoint: string, config: MessageConfig) => void;
  clearMessage: () => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined); 