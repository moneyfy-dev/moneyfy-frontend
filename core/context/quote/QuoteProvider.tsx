import React, { useState, useCallback, useEffect } from 'react';
import { QuoteContext } from './QuoteContext';
import { quoteService } from '@/core/services/quote';
import { useUser } from '../user/useUser';
import { storage } from '@/shared/utils/storage';
import { 
    type Vehicle, 
    type InsurancePlan, 
    type QuoteVehicleParams, 
    type SelectPlanParams,
    type SearchResponse,
    type QuoteVehicleResponse,
    type Brand,
    type GenerateTransactionParams,
    type FinalizeQuoteParams,
    type ApiResponse,
    ROUTES,
} from '@/core/types';

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { updateUserData } = useUser();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [plans, setPlans] = useState<InsurancePlan[]>([]);
    const [quoterId, setQuoterId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [availableVehicles, setAvailableVehicles] = useState<Brand[]>([]);

    // Cargar datos del storage al iniciar
    useEffect(() => {
        const loadQuoteData = async () => {
            try {
                const [storedVehicle, storedPlans, storedQuoterId] = await Promise.all([
                    storage.quote.getVehicle(),
                    storage.quote.getPlans(),
                    storage.quote.getQuoterId()
                ]);

                if (storedVehicle) setVehicle(storedVehicle);
                if (storedPlans) setPlans(storedPlans);
                if (storedQuoterId) setQuoterId(storedQuoterId);
            } catch (error) {
            }
        };

        loadQuoteData();
    }, []);

    const searchVehicle = useCallback(async (
        ownerId: string, 
        ppu: string
    ): Promise<SearchResponse> => {
        setIsLoading(true);
        try {
            const response = await quoteService.searchVehicle(ownerId, ppu);


            if (response.data?.user) {
                await updateUserData(response.data.user);
            }

            if (response.data?.vehicle) {
                setVehicle(response.data.vehicle);
                await storage.quote.setVehicle(response.data.vehicle);
            }
            
            if (response.data?.quoterId) {
                setQuoterId(response.data.quoterId as string);
                await storage.quote.setQuoterId(response.data.quoterId as string);
            }

            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al buscar vehículo';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

    const startQuotationFlow = useCallback(async (
        quoteData: QuoteVehicleParams
    ): Promise<QuoteVehicleResponse> => {
        setIsLoading(true);
        try {
            const response = await quoteService.startQuotationFlow(quoteData);

            if (response.data.plans) {
                setPlans(response.data.plans);
                await storage.quote.setPlans(response.data.plans);
            }

            if (response.data.quoterId) {
                setQuoterId(response.data.quoterId);
            }

            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al iniciar cotización';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

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
    }, [updateUserData]);

    const getAvailableVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await quoteService.getAvailableVehicles();

            if (response.data?.user) {
                await updateUserData(response.data.user);
            }

            if (response.data.brands) {
                setAvailableVehicles(response.data.brands);
            }

            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener vehículos disponibles';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

    const clearQuoteData = useCallback(async () => {
        setVehicle(null);
        setPlans([]);
        setQuoterId(null);
        setError(null);
        
        try {
            await storage.quote.clearQuote();
        } catch (error) {
        }
    }, []);

    const searchPlanById = useCallback(async (
        planId: string
    ): Promise<ApiResponse> => {
        setIsLoading(true);
        try {
            const response = await quoteService.searchPlanById(planId);
            console.log(response.data.data.plans);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateTransaction = useCallback(async (
        params: GenerateTransactionParams
    ): Promise<void> => {
        setIsLoading(true);
        try {
            await quoteService.generateTransaction(params);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const finalizeQuote = useCallback(async (
        params: FinalizeQuoteParams
    ): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await quoteService.finalizeQuote(params);
            if (response.data?.user) {
                await updateUserData(response.data.user);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

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
                availableVehicles,
                getAvailableVehicles,
                clearQuoteData,
                searchPlanById,
                generateTransaction,
                finalizeQuote,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
}; 