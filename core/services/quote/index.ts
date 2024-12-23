import { api } from '../api/config';
import type { 
    SearchResponse, 
    QuoteVehicleParams, 
    QuoteVehicleResponse, 
    SelectPlanParams,
    VehiclesResponse, 
    Vehicle,
    InsurancePlan,
    QuoteResult
} from '@/core/types';

export const quoteService = {
    // Búsqueda de compañías aseguradoras
    searchCompanies(): Promise<SearchResponse> {
        return api.get('/referred/search/companies');
    },

    // Búsqueda de vehículo
    searchVehicle(ownerId: string, ppu: string): Promise<SearchResponse> {
        return api.post('/referred/search/vehicle', { ownerId, ppu });
    },

    // Cotización de vehículo
    quoteVehicle(quoteData: QuoteVehicleParams): Promise<QuoteVehicleResponse> {
        return api.post('/referred/vehicle/quote', quoteData);
    },

    // Selección de plan
    selectPlan(planData: SelectPlanParams): Promise<QuoteVehicleResponse> {
        return api.put('/referred/select/plan', planData);
    },

    // Obtener vehículos disponibles
    getAvailableVehicles(): Promise<VehiclesResponse> {
        return api.get('/referred/search/available/vehicles');
    },

    // Flujo completo de cotización
    async startQuotationFlow(quoteData: Omit<QuoteVehicleParams, 'companyAlias'>): Promise<QuoteVehicleResponse> {

        try {
            // 1. Obtener compañías
            const companiesResponse = await this.searchCompanies();
            const companies = companiesResponse.data.companies || [];
            
            if (companies.length === 0) {
                throw new Error('No hay compañías disponibles para cotizar');
            }

            // 2. Crear cotizaciones en paralelo con manejo individual de errores
            const quotePromises = companies.map(async (company): Promise<QuoteResult> => {
                try {
                    const quoteParams: QuoteVehicleParams = {
                        ...quoteData,
                        companyAlias: company.alias,
                    };
                    const response = await this.quoteVehicle(quoteParams);
                    
                    return {
                        plans: response.data.plans.map(plan => ({
                            ...plan,
                            insuranceCompany: company.name
                        })),
                        quoterId: response.data.quoterId,
                        vehicle: response.data.vehicle,
                        user: response.data.user
                    };
                } catch (error) {
                    console.log(`Error al cotizar con ${company.name}:`, error);
                    return {
                        plans: [],
                        quoterId: null,
                        vehicle: null,
                        user: null
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
                .filter(plan => plan !== null);

            // Buscar explícitamente un quoterId válido
            const quoterId = results.find((result: QuoteResult) => result.quoterId)?.quoterId;
            
            if (allPlans.length === 0) {
                throw new Error('No se encontraron planes disponibles');
            }

            // 5. Construir el objeto Vehicle completo
            const vehicle: Vehicle = {
                ppu: quoteData.ppu,
                type: 'AUTO',
                brand: quoteData.brand,
                model: quoteData.model,
                year: quoteData.year,
                colour: quoteData.colour || 'NO ESPECIFICADO',
                engineNum: quoteData.engineNum || 'NO ESPECIFICADO',
                chassisNum: quoteData.chassisNum || 'NO ESPECIFICADO',
                manufacturer: quoteData.brand
            };

            // 6. Obtener datos de usuario y tokens del primer resultado válido
            const validResult = results.find((result: QuoteResult) => result.user);
            
            // Validar quoterId
            const finalQuoterId = quoterId || quoteData.quoterId;
            if (!finalQuoterId) {
                throw new Error('No se pudo obtener un quoterId válido');
            }

            return {
                message: 'Cotización exitosa',
                status: 200,
                data: {
                    plans: allPlans,
                    quoterId: finalQuoterId,
                    vehicle,
                    user: validResult?.user || null,
                    // Removemos tokens ya que serán manejados por el interceptor
                }
            };
        } catch (error) {
            console.error('Error en el flujo de cotización:', error);
            throw error;
        }
    }
}; 