import React, { useState, useCallback } from 'react';
import { QuoteContext } from './QuoteContext';
import { quoteService } from '@/core/services';
import type { 
    Vehicle, 
    InsurancePlan, 
    QuoteVehicleParams, 
    SelectPlanParams,
    SearchResponse,
    QuoteVehicleResponse
} from '@/core/types';

interface QuoteProviderProps {
    children: React.ReactNode;
}

export const QuoteProvider = ({ children }: QuoteProviderProps): JSX.Element => {
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [plans, setPlans] = useState<InsurancePlan[]>([]);
    const [quoterId, setQuoterId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchVehicle = useCallback(async (
        ownerId: string, 
        ppu: string
    ): Promise<SearchResponse> => {
        setIsLoading(true);
        try {
            const response = await quoteService.searchVehicle(ownerId, ppu);
            if (response.data.vehicle) {
                setVehicle(response.data.vehicle);
            }
            if (response.data.quoterId) {
                setQuoterId(response.data.quoterId as string);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al buscar vehículo';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const startQuotationFlow = useCallback(async (
        quoteData: QuoteVehicleParams
    ): Promise<QuoteVehicleResponse> => {
        setIsLoading(true);
        try {
            const response = await quoteService.startQuotationFlow(quoteData);
            setPlans(response.data.plans);
            setVehicle(response.data.vehicle);
            setQuoterId(response.data.quoterId);
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al iniciar cotización';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const selectPlan = useCallback(async (
        planData: SelectPlanParams
    ): Promise<void> => {
        setIsLoading(true);
        try {
            await quoteService.selectPlan(planData);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al seleccionar plan';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearQuoteData = useCallback(() => {
        setVehicle(null);
        setPlans([]);
        setQuoterId(null);
        setError(null);
    }, []);

    return (
        <QuoteContext.Provider
            value={{
                vehicle,
                plans,
                quoterId,
                isLoading,
                error,
                searchVehicle,
                startQuotationFlow,
                selectPlan,
                clearQuoteData,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
}; 