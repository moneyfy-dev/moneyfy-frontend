import { searchCompanies, quoteVehicle } from './quoteService';
import { QuoteVehicleParams, InsurancePlan, Company, Vehicle } from '@/core/types';

interface QuotationFlowResponse {
  plans: InsurancePlan[];
  quoterId: string;
  vehicle: Vehicle;
}

// Primero, definimos una interfaz para el resultado de la cotización
interface QuoteResult {
  plans: InsurancePlan[];
  quoterId: string | null;
}

export const startQuotationFlow = async (quoteData: Omit<QuoteVehicleParams, 'companyAlias'>): Promise<QuotationFlowResponse> => {
  try {
    // 1. Obtener compañías
    const companiesResponse = await searchCompanies();
    const companies = companiesResponse.data.companies || [];
    
    if (companies.length === 0) {
      throw new Error('No hay compañías disponibles para cotizar');
    }

    // 2. Crear un array de promesas para las cotizaciones
    const quotePromises = companies.map(async (company: Company) => {
      try {
        const quoteParams: QuoteVehicleParams = {
          ...quoteData,
          companyAlias: company.alias,
        };
        const response = await quoteVehicle(quoteParams);
        console.log('response', response);
        return {
          plans: response.data.plans.map(plan => ({
            ...plan,
            insuranceCompany: company.name
          })),
          quoterId: response.data.quoterId
        };
      } catch (error) {
        console.log(`Error al cotizar con ${company.name}:`, error);
        return { plans: [], quoterId: null };
      }
    });

    // 3. Ejecutar todas las cotizaciones en paralelo
    // Modificar el Promise.all para manejar timeouts
const results = await Promise.all<QuoteResult>(
  quotePromises.map(p => 
    Promise.race<QuoteResult>([
      p,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout en cotización')), 30000)
      )
    ])
  )
);
    
    // 4. Filtrar y aplanar los resultados
    const allPlans = results
      .map((result: QuoteResult) => result.plans)
      .flat()
      .filter(plan => plan !== null);
    // Obtener el primer quoterID válido
    const quoterId = results.find(result => result.quoterId)?.quoterId;
    
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

    return {
      plans: allPlans,
      quoterId: quoterId || quoteData.quoterId as string,
      vehicle
    };
  } catch (error) {
    console.log('final deñl servicio', error);
    console.error('Error en el flujo de cotización:', error);
    throw error;
  }
}; 