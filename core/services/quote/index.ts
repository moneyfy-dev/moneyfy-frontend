import { api } from '../api/config';
import type {
    SearchResponse,
    QuoteVehicleParams,
    QuoteVehicleResponse,
    SelectPlanParams,
    VehiclesResponse,
    QuoteResult,
    GenerateTransactionParams,
    Insurer,
    ApiResponse
} from '@/core/types';

const EMPTY_QUOTE_RESULT: QuoteResult = {
    plans: [],
    quoterId: null,
};

export class NoQuotePlansError extends Error {
    details: QuoteResult[];

    constructor(details: QuoteResult[]) {
        super('No se encontraron planes disponibles');
        this.name = 'NoQuotePlansError';
        this.details = details;
    }
}

const normalizeInsurer = (
    planInsurer: unknown,
    responseInsurer: QuoteVehicleResponse['data']['insurer']
): Insurer => {
    if (responseInsurer && typeof responseInsurer === 'object') {
        return responseInsurer as Insurer;
    }

    if (planInsurer && typeof planInsurer === 'object') {
        return planInsurer as Insurer;
    }

    if (typeof planInsurer === 'string') {
        return {
            insurerId: '',
            name: planInsurer,
            alias: '',
            darkLogo: '',
            lightLogo: '',
        };
    }

    return {
        insurerId: '',
        name: '',
        alias: '',
        darkLogo: '',
        lightLogo: '',
    };
};

const getInsurerAliases = (response: SearchResponse): string[] => {
    const rawInsurers = response.data?.insurers as unknown[] | undefined;

    if (!Array.isArray(rawInsurers)) {
        return [];
    }

    return rawInsurers
        .map((insurer) => {
            if (typeof insurer === 'string') {
                return insurer;
            }

            if (
                insurer &&
                typeof insurer === 'object' &&
                'alias' in insurer &&
                typeof insurer.alias === 'string'
            ) {
                return insurer.alias;
            }

            return null;
        })
        .filter((alias): alias is string => !!alias);
};

const buildQuoteResponse = (response: QuoteVehicleResponse): QuoteVehicleResponse => {
    const plans = (response.data?.plans || []).map((plan) => ({
        ...plan,
        planId: (plan as any).uniquePlan || plan.planId || (plan as any).quoterPlanId || (plan as any).idPlan || (plan as any).id || '',
        insurer: normalizeInsurer(plan.insurer, response.data?.insurer),
    }));
    const insurer = normalizeInsurer(plans[0]?.insurer, response.data.insurer);

    return {
        ...response,
        data: {
            ...response.data,
            plans,
            insurer,
        }
    };
};

export const quoteService = {
    searchCompanies(config?: Record<string, unknown>): Promise<SearchResponse> {
        return api.get('/quoter/search/insurers', config as any)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },

    searchVehicle(ownerId: string, ppu: string): Promise<SearchResponse> {
        return api.post('/quoter/search/vehicle', { ownerId, ppu })
            .then(response => response.data);
    },

    quoteVehicle(quoteData: QuoteVehicleParams, config?: Record<string, unknown>): Promise<QuoteVehicleResponse> {
        return api.post('/quoter/search/plan', quoteData, config as any)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },

    selectPlan(planData: SelectPlanParams): Promise<any> {
        return api.put('/quoter/select/plan', planData, {
            skipGlobalErrorMessage: true,
        } as any);
    },

    getAvailableVehicles: async (): Promise<VehiclesResponse> => {
        const response = await api.get('/quoter/search/vehicle/brands');
        return response.data;
    },

    async startQuotationFlow(quoteData: Omit<QuoteVehicleParams, 'insurerAlias'>): Promise<QuoteVehicleResponse> {
        try {
            let insurerAliases: string[] = [];

            try {
                const companiesResponse = await this.searchCompanies({
                    skipGlobalErrorMessage: true,
                });
                insurerAliases = getInsurerAliases(companiesResponse);
            } catch {
            }

            if (insurerAliases.length === 0) {
                throw new Error('No hay aseguradoras configuradas para cotizar');
            }

            const results: QuoteResult[] = [];
            let activeQuoterId = quoteData.quoterId || '';

            for (const insurerAlias of insurerAliases) {
                try {
                    const quoteRequest = this.quoteVehicle(
                        {
                            ...quoteData,
                            quoterId: activeQuoterId || undefined,
                            insurerAlias,
                        },
                        {
                            skipGlobalErrorMessage: true,
                        }
                    );
                    const response = buildQuoteResponse(await Promise.race([
                        quoteRequest,
                        new Promise<QuoteVehicleResponse>((_, reject) => {
                            setTimeout(() => reject(new Error('Tiempo de espera agotado al cotizar')), 30000);
                        }),
                    ]));

                    if (response.data?.quoterId) {
                        activeQuoterId = response.data.quoterId;
                    }

                    if (!response.data?.plans?.length) {
                        results.push({
                            plans: [],
                            quoterId: response.data?.quoterId || null,
                            insurer: response.data?.insurer,
                            insurerAlias,
                            error: response.data?.error,
                            errorMessage: response.data?.errorMessage,
                        });
                        continue;
                    }

                    results.push({
                        plans: response.data.plans,
                        quoterId: response.data.quoterId,
                        insurer: response.data.insurer,
                        insurerAlias,
                        error: response.data.error,
                        errorMessage: response.data.errorMessage,
                    });
                } catch (error) {
                    results.push({
                        ...EMPTY_QUOTE_RESULT,
                        insurerAlias,
                        error: String((error as any)?.response?.status || ''),
                        errorMessage: (error as any)?.response?.data?.message || (error as Error)?.message || 'Error al cotizar',
                    });
                }
            }

            const allPlans = results
                .map((result) => result.plans)
                .flat()
                .filter((plan) => plan !== null && plan !== undefined);

            const quoterId = activeQuoterId || results.find((result) => result.quoterId)?.quoterId;

            if (allPlans.length === 0) {
                throw new NoQuotePlansError(results);
            }

            if (!quoterId) {
                throw new Error('No se pudo obtener un quoterId valido');
            }

            return {
                message: 'Cotizacion exitosa',
                status: 200,
                data: {
                    plans: allPlans,
                    quoterId,
                    insurer: allPlans[0].insurer
                }
            };
        } catch (error) {
            throw error;
        }
    },

    searchPlanById(planId: string): Promise<ApiResponse> {
        return api.get(`/plans/${planId}`);
    },

    generateTransaction(params: GenerateTransactionParams): Promise<any> {
        return api.put('/quoter/generate/transaction', params);
    }
};
