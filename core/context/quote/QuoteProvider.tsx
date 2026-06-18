import React, { useState, useCallback, useEffect, useRef } from 'react';
import { QuoteContext } from './QuoteContext';
import { quoteService } from '@/core/services/quote';
import { useUser } from '../user/useUser';
import { useAuth } from '../auth/useAuth';
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
    type OwnerDataDraft,
    type ApiResponse,
} from '@/core/types';

const EMPTY_OWNER_DATA: OwnerDataDraft = {
    ownerName: '',
    ownerPaternalSur: '',
    ownerMaternalSur: '',
    street: '',
    streetNumber: '',
    department: '',
    city: '',
    commune: '',
};

const buildOwnerDataDraft = (quoteData: QuoteVehicleParams): OwnerDataDraft => {
    if (quoteData.ownerRelationOption !== '0') {
        return { ...EMPTY_OWNER_DATA };
    }

    return {
        ...EMPTY_OWNER_DATA,
        ownerName: quoteData.purchaserName.trim(),
        ownerPaternalSur: quoteData.purchaserPaternalSur.trim(),
        ownerMaternalSur: quoteData.purchaserMaternalSur.trim(),
    };
};

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { updateUserData } = useUser();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [plans, setPlans] = useState<InsurancePlan[]>([]);
    const [quoterId, setQuoterId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [availableVehicles, setAvailableVehicles] = useState<Brand[]>([]);
    const [ownerDataDraft, setOwnerDataDraft] = useState<OwnerDataDraft>(EMPTY_OWNER_DATA);
    const transactionPromiseRef = useRef<Promise<void> | null>(null);

    const resetQuoteState = useCallback(() => {
        setVehicle(null);
        setPlans([]);
        setQuoterId(null);
        setError(null);
        setOwnerDataDraft(EMPTY_OWNER_DATA);
    }, []);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated) {
            resetQuoteState();
            void storage.quote.clearQuote();
            return;
        }

        let cancelled = false;

        const loadQuoteData = async () => {
            try {
                const [storedVehicle, storedPlans, storedQuoterId, storedOwnerData] = await Promise.all([
                    storage.quote.getVehicle(),
                    storage.quote.getPlans(),
                    storage.quote.getQuoterId(),
                    storage.quote.getOwnerData(),
                ]);

                if (cancelled) return;

                if (storedVehicle) setVehicle(storedVehicle);
                if (storedPlans) setPlans(storedPlans);
                if (storedQuoterId) setQuoterId(storedQuoterId);
                if (storedOwnerData) setOwnerDataDraft(storedOwnerData);
            } catch (error) {
            }
        };

        loadQuoteData();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, isAuthLoading, resetQuoteState]);

    const searchVehicle = useCallback(async (
        ownerId: string,
        ppu: string
    ): Promise<SearchResponse> => {
        setIsLoading(true);
        try {
            setOwnerDataDraft(EMPTY_OWNER_DATA);
            await storage.quote.setOwnerData(null);
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
            const message = error instanceof Error ? error.message : 'Error al buscar vehiculo';
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
            const nextOwnerData = buildOwnerDataDraft(quoteData);
            setOwnerDataDraft(nextOwnerData);
            await storage.quote.setOwnerData(nextOwnerData);
            const sameVehicle = vehicle?.ppu === quoteData.ppu;
            const quotedVehicle: Vehicle = {
                ppu: quoteData.ppu,
                brand: quoteData.brand,
                model: quoteData.model,
                year: quoteData.year,
                type: sameVehicle ? vehicle.type : '',
                colour: quoteData.colour || (sameVehicle ? vehicle.colour : ''),
                engineNum: quoteData.engineNum || (sameVehicle ? vehicle.engineNum : ''),
                chassisNum: quoteData.chassisNum || (sameVehicle ? vehicle.chassisNum : ''),
                manufacturer: sameVehicle ? vehicle.manufacturer : '',
                isFound: quoteData.requestType === 'Auto',
            };

            setVehicle(quotedVehicle);
            await storage.quote.setVehicle(quotedVehicle);

            if (response.data.plans) {
                setPlans(response.data.plans);
                await storage.quote.setPlans(response.data.plans);
            }

            if (response.data.quoterId) {
                setQuoterId(response.data.quoterId);
                await storage.quote.setQuoterId(response.data.quoterId);
            }

            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al iniciar cotizacion';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [vehicle]);

    const selectPlan = useCallback(async (
        planData: SelectPlanParams
    ): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await quoteService.selectPlan(planData);
            if (response.data?.user) {
                await updateUserData(response.data.user);
            }
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
            const message = error instanceof Error ? error.message : 'Error al obtener vehiculos disponibles';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [updateUserData]);

    const clearQuoteData = useCallback(async () => {
        resetQuoteState();

        try {
            await storage.quote.clearQuote();
        } catch (error) {
        }
    }, [resetQuoteState]);

    const updateOwnerDataDraft = useCallback((values: Partial<OwnerDataDraft>) => {
        setOwnerDataDraft(current => {
            const updated = { ...current, ...values };
            void storage.quote.setOwnerData(updated);
            return updated;
        });
    }, []);

    const hydrateQuoteSession = useCallback(async ({
        vehicle,
        plans,
        quoterId,
    }: {
        vehicle: Vehicle;
        plans: InsurancePlan[];
        quoterId: string;
    }) => {
        setVehicle(vehicle);
        setPlans(plans);
        setQuoterId(quoterId);

        await Promise.all([
            storage.quote.setVehicle(vehicle),
            storage.quote.setPlans(plans),
            storage.quote.setQuoterId(quoterId),
        ]);
    }, []);

    const searchPlanById = useCallback(async (
        planId: string
    ): Promise<ApiResponse> => {
        setIsLoading(true);
        try {
            const response = await quoteService.searchPlanById(planId);
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
        if (transactionPromiseRef.current) {
            return transactionPromiseRef.current;
        }

        const transactionPromise = (async () => {
            setIsLoading(true);
            try {
                const response = await quoteService.generateTransaction(params);
                if (response.data?.user) {
                    await updateUserData(response.data.user);
                }
            } finally {
                setIsLoading(false);
                transactionPromiseRef.current = null;
            }
        })();

        transactionPromiseRef.current = transactionPromise;
        return transactionPromise;
    }, [updateUserData]);

    return (
        <QuoteContext.Provider
            value={{
                vehicle,
                plans,
                quoterId,
                isLoading,
                error,
                ownerDataDraft,
                searchVehicle,
                startQuotationFlow,
                selectPlan,
                availableVehicles,
                getAvailableVehicles,
                clearQuoteData,
                searchPlanById,
                generateTransaction,
                updateOwnerDataDraft,
                hydrateQuoteSession,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
};
