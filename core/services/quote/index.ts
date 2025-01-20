import { api } from '../api/config';
import type { 
    SearchResponse, 
    QuoteVehicleParams, 
    QuoteVehicleResponse, 
    SelectPlanParams,
    VehiclesResponse,
    QuoteResult,
    GenerateTransactionParams,
    FinalizeQuoteParams,
    ApiResponse
} from '@/core/types';

export const quoteService = {
    // Búsqueda de compañías aseguradoras
    searchCompanies(): Promise<SearchResponse> {
        return api.get('/quoter/search/insurers')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    },

    // Búsqueda de vehículo
    searchVehicle(ownerId: string, ppu: string): Promise<SearchResponse> {
        return api.post('/quoter/search/vehicle', { ownerId, ppu })
            .then(response => {
                return response.data; // Esto ya devuelve el objeto con message, status y data
            })
            .catch(error => {
                console.error('❌ Error en searchVehicle:', error.response?.data);
                throw error;
            });
    },

    // Cotización de vehículo
    quoteVehicle(quoteData: QuoteVehicleParams): Promise<QuoteVehicleResponse> {
        return api.post('/quoter/search/plan', quoteData)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    },

    // Selección de plan
    selectPlan(planData: SelectPlanParams): Promise<QuoteVehicleResponse> {
        return api.put('/quoter/select/plan', planData);
    },

    // Obtener vehículos disponibles
    getAvailableVehicles: async (): Promise<VehiclesResponse> => {
        const response = await api.get('/quoter/search/vehicle/brands');
        return response.data;
    },

    // Flujo completo de cotización
    async startQuotationFlow(quoteData: Omit<QuoteVehicleParams, 'insurerAlias'>): Promise<QuoteVehicleResponse> {
        try {
            // 1. Obtener compañías
            const companiesResponse = await this.searchCompanies();

            // Transformar el array de strings en array de Company
            const companies = (companiesResponse.data?.insurers || []).map(alias => ({
                name: alias,
                alias: alias
            }));
            
            if (companies.length === 0) {
                throw new Error('No hay compañías disponibles para cotizar');
            }

            // 2. Crear cotizaciones en paralelo con manejo individual de errores
            const quotePromises = companies.map(async (company): Promise<QuoteResult> => {
                try {
                    const quoteParams: QuoteVehicleParams = {
                        ...quoteData,
                        insurerAlias: company.alias,
                    };
                    const response = await this.quoteVehicle(quoteParams);
                    
                    if (!response.data?.plans) {
                        return {
                            plans: [],
                            quoterId: response.data?.quoterId || null
                        };
                    }

                    const plansWithInsurer = response.data.plans.map(plan => ({
                        ...plan,
                        insurer: response.data.insurer
                    }));

                    return {
                        plans: plansWithInsurer,
                        quoterId: response.data.quoterId,
                        insurer: response.data.insurer
                    };
                } catch (error) {
                    return {
                        plans: [],
                        quoterId: null
                    };
                }
            });

            // 3. Ejecutar cotizaciones con timeout
            const results = await Promise.all<QuoteResult>(
                quotePromises.map(p => 
                    Promise.race<QuoteResult>([
                        p,
                        new Promise<QuoteResult>((_, reject) => 
                            setTimeout(() => reject(new Error('Timeout en cotización')), 30000)
                        )
                    ])
                )
            );
            
            // 4. Filtrar y procesar resultados
            const allPlans = results
                .map((result: QuoteResult) => result.plans)
                .flat()
                .filter(plan => plan !== null && plan !== undefined);

            const quoterId = results.find((result: QuoteResult) => result.quoterId)?.quoterId;
            
            if (allPlans.length === 0) {
                throw new Error('No se encontraron planes disponibles');
            }

            if (!quoterId) {
                throw new Error('No se pudo obtener un quoterId válido');
            }

            return {
                message: 'Cotización exitosa',
                status: 200,
                data: {
                    plans: allPlans,
                    quoterId,
                    insurer: allPlans[0].insurer
                }
            };
        } catch (error) {
            console.error('Error en startQuotationFlow:', error);
            throw error;
        }
    },

    searchPlanById(planId: string): Promise<ApiResponse> {
        return api.get(`/plans/${planId}`);
    },

    generateTransaction(params: GenerateTransactionParams): Promise<any> {
        return api.put('/quoter/generate/transaction', params);
    },

    finalizeQuote(params: FinalizeQuoteParams): Promise<any> {
        return api.put('/quoter/finalize/quote', params);
    }
}; 