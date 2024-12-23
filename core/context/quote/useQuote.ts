import { useContext } from 'react';
import { QuoteContext } from './QuoteContext';

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote debe ser usado dentro de un QuoteProvider');
  }
  return context;
};