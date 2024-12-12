import { searchCompanies, quoteVehicle } from './quoteService';
import { QuoteVehicleParams, InsurancePlan, Company, Vehicle } from '@/types/quote';

interface QuotationFlowResponse {
  plans: InsurancePlan[];
  referredId: string;
  vehicle: Vehicle;
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
        return {
          plans: response.data.plans.map(plan => ({
            ...plan,
            insuranceCompany: company.name
          })),
          referralID: response.data.referredId
        };
      } catch (error) {
        console.log(`Error al cotizar con ${company.name}:`, error);
        return { plans: [], referralID: null };
      }
    });

    // 3. Ejecutar todas las cotizaciones en paralelo
    const results = await Promise.all(quotePromises);
    
    // 4. Filtrar y aplanar los resultados
    const allPlans = results.map(result => result.plans).flat().filter(plan => plan !== null);
    // Obtener el primer referralID válido
    const referralID = results.find(result => result.referralID)?.referralID;
    
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
      referredId: referralID || quoteData.referredId as string,
      vehicle
    };
  } catch (error) {
    console.error('Error en el flujo de cotización:', error);
    throw error;
  }
}; 