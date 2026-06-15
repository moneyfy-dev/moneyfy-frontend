import { createContext } from 'react';
import { 
    Vehicle,
    VehiclesResponse,
    InsurancePlan, 
    SearchResponse,
    QuoteVehicleParams,
    SelectPlanParams,
    QuoteVehicleResponse,
    GenerateTransactionParams,
    OwnerDataDraft,
    Brand,
    ApiResponse
} from '@/core/types';

interface QuoteContextType {
    // Estado
    vehicle: Vehicle | null;
    plans: InsurancePlan[];
    quoterId: string | null;
    isLoading: boolean;
    error: string | null;
    availableVehicles: Brand[];
    ownerDataDraft: OwnerDataDraft;
    
    // Acciones
    searchVehicle: (ownerId: string, ppu: string) => Promise<SearchResponse>;
    startQuotationFlow: (quoteData: QuoteVehicleParams) => Promise<QuoteVehicleResponse>;
    selectPlan: (planData: SelectPlanParams) => Promise<void>;
    getAvailableVehicles: () => Promise<VehiclesResponse>;
    clearQuoteData: () => Promise<void>;
    searchPlanById: (planId: string) => Promise<ApiResponse>;
    generateTransaction: (params: GenerateTransactionParams) => Promise<void>;
    updateOwnerDataDraft: (values: Partial<OwnerDataDraft>) => void;
    hydrateQuoteSession: (payload: {
        vehicle: Vehicle;
        plans: InsurancePlan[];
        quoterId: string;
    }) => Promise<void>;
}

export const QuoteContext = createContext<QuoteContextType | undefined>(undefined); 
