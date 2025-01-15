import { useContext } from 'react';
import { MessageContext } from './MessageContext';

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage debe ser usado dentro de un MessageProvider');
  }
  return context;
}; 