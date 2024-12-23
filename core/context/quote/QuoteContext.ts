import { createContext } from 'react';
import { 
    Vehicle, 
    InsurancePlan, 
    SearchResponse,
    QuoteVehicleParams,
    SelectPlanParams,
    QuoteVehicleResponse 
} from '@/core/types';

interface QuoteContextType {
    // Estado
    vehicle: Vehicle | null;
    plans: InsurancePlan[];
    quoterId: string | null;
    isLoading: boolean;
    error: string | null;

    // Acciones
    searchVehicle: (ownerId: string, ppu: string) => Promise<SearchResponse>;
    startQuotationFlow: (quoteData: QuoteVehicleParams) => Promise<QuoteVehicleResponse>;
    selectPlan: (planData: SelectPlanParams) => Promise<void>;
    clearQuoteData: () => void;
}

export const QuoteContext = createContext<QuoteContextType | undefined>(undefined); 