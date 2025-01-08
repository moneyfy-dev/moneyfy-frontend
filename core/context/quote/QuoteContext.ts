import { createContext } from 'react';
import { 
    Vehicle,
    VehicleModel,
    InsurancePlan, 
    SearchResponse,
    QuoteVehicleParams,
    SelectPlanParams,
    QuoteVehicleResponse,
    GenerateTransactionParams,
    FinalizeQuoteParams
} from '@/core/types';

interface QuoteContextType {
    // Estado
    vehicle: Vehicle | null;
    plans: InsurancePlan[];
    quoterId: string | null;
    isLoading: boolean;
    error: string | null;
    availableVehicles: VehicleModel[];
    generateTransaction: (params: GenerateTransactionParams) => Promise<void>;
    finalizeQuote: (params: FinalizeQuoteParams) => Promise<void>;  

    // Acciones
    searchVehicle: (ownerId: string, ppu: string) => Promise<SearchResponse>;
    startQuotationFlow: (quoteData: QuoteVehicleParams) => Promise<QuoteVehicleResponse>;
    selectPlan: (planData: SelectPlanParams) => Promise<void>;
    getAvailableVehicles: () => Promise<void>;
    clearQuoteData: () => void;
}

export const QuoteContext = createContext<QuoteContextType | undefined>(undefined); 