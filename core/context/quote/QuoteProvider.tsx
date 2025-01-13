import React, { useState, useCallback, useEffect } from 'react';
import { QuoteContext } from './QuoteContext';
import { quoteService } from '@/core/services/quote';
import { useUser } from '../user/useUser';
import { storage } from '@/shared/utils/storage';
import type { 
    Vehicle, 
    InsurancePlan, 
    QuoteVehicleParams, 
    SelectPlanParams,
    SearchResponse,
    QuoteVehicleResponse,
    Brand,
    GenerateTransactionParams,
    FinalizeQuoteParams,
    ApiResponse,
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
            console.log('🔄 Cargando datos de cotización del storage...');
            try {
                const [storedVehicle, storedPlans, storedQuoterId] = await Promise.all([
                    storage.quote.getVehicle(),
                    storage.quote.getPlans(),
                    storage.quote.getQuoterId()
                ]);

                console.log('📥 Datos recuperados del storage:', {
                    hasVehicle: !!storedVehicle,
                    hasPlans: !!storedPlans,
                    hasQuoterId: !!storedQuoterId,
                    vehicle: storedVehicle,
                    quoterId: storedQuoterId
                });

                if (storedVehicle) setVehicle(storedVehicle);
                if (storedPlans) setPlans(storedPlans);
                if (storedQuoterId) setQuoterId(storedQuoterId);
            } catch (error) {
                console.error('❌ Error al cargar datos de cotización:', error);
            }
        };

        loadQuoteData();
    }, []);

    const searchVehicle = useCallback(async (
        ownerId: string, 
        ppu: string
    ): Promise<SearchResponse> => {
        console.log('🔄 Iniciando búsqueda de vehículo:', { ownerId, ppu });
        setIsLoading(true);
        try {
            const response = await quoteService.searchVehicle(ownerId, ppu);
            console.log('📥 Respuesta searchVehicle:', {
                hasVehicle: !!response.data?.vehicle,
                hasQuoterId: !!response.data?.quoterId,
                vehicle: response.data?.vehicle,
                quoterId: response.data?.quoterId
            });

            if (response.data?.user) {
                await updateUserData(response.data.user);
            }

            if (response.data?.vehicle) {
                console.log('💾 Guardando vehículo en storage...');
                setVehicle(response.data.vehicle);
                await storage.quote.setVehicle(response.data.vehicle);
                console.log('✅ Vehículo guardado en storage');
            }
            
            if (response.data?.quoterId) {
                console.log('💾 Guardando quoterId en storage...');
                setQuoterId(response.data.quoterId as string);
                await storage.quote.setQuoterId(response.data.quoterId as string);
                console.log('✅ QuoterId guardado en storage');
            }

            return response;
        } catch (error) {
            console.error('❌ Error en búsqueda:', error);
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
        console.log('🔄 Iniciando flujo de cotización:', quoteData);
        setIsLoading(true);
        try {
            const response = await quoteService.startQuotationFlow(quoteData);
            

            if (response.data.plans) {
                console.log('💾 Guardando planes en storage...', response.data.plans.length);
                setPlans(response.data.plans);
                await storage.quote.setPlans(response.data.plans);
                console.log('✅ Planes guardados en storage');
            }

            if (response.data.quoterId) {
                setQuoterId(response.data.quoterId);
            }

            console.log('✅ Cotización exitosa');
            return response;
        } catch (error) {
            console.error('❌ Error en cotización:', error);
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
        console.log('🔄 Seleccionando plan');
        setIsLoading(true);
        try {
            const response = await quoteService.selectPlan(planData);
            console.log('🔄 Respuesta selectPlan:', response.data);
            console.log('✅ Plan seleccionado exitosamente');
        } catch (error) {
            console.error('❌ Error al seleccionar plan:', error);
            const message = error instanceof Error ? error.message : 'Error al seleccionar plan';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

    const getAvailableVehicles = useCallback(async () => {
        console.log('🔄 Obteniendo vehículos disponibles');
        setIsLoading(true);
        try {
            const response = await quoteService.getAvailableVehicles();
            console.log('🔄 Respuesta getAvailableVehicles:', response.data);

            if (response.data?.user) {
                await updateUserData(response.data.user);
            }

            if (response.data.brands) {
                setAvailableVehicles(response.data.brands);
            }

            return response;
        } catch (error) {
            console.error('❌ Error al obtener vehículos:', error);
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
            console.error('Error al limpiar datos de cotización:', error);
        }
    }, []);

    const searchPlanById = useCallback(async (
        planId: string
    ): Promise<ApiResponse> => {
        console.log('🔄 Buscando plan por ID:', planId);
        setIsLoading(true);
        try {
            const response = await quoteService.searchPlanById(planId);
            return response;
        } catch (error) {
            console.error('❌ Error al buscar plan:', error);
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
            console.log('✅ Transacción generada exitosamente');
        } catch (error) {
            console.error('❌ Error al generar transacción:', error);
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

            await clearQuoteData();
            console.log('✅ Cotización finalizada exitosamente');
        } catch (error) {
            console.error('❌ Error al finalizar cotización:', error);
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