import { searchCompanies, quoteVehicle } from './quoteService';
import { QuoteVehicleParams, InsurancePlan, Company } from '@/types/quote';

export const startQuotationFlow = async (quoteData: Omit<QuoteVehicleParams, 'companyAlias'>) => {
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
          companyAlias: company.alias
        };
        
        const response = await quoteVehicle(quoteParams);
        return response.data.plans.map(plan => ({
          ...plan,
          insuranceCompany: company.name // Aseguramos que el nombre de la compañía sea consistente
        }));
      } catch (error) {
        console.log(`Error al cotizar con ${company.name}:`, error);
        return []; // Retornamos array vacío en caso de error
      }
    });

    // 3. Ejecutar todas las cotizaciones en paralelo
    const results = await Promise.all(quotePromises);
    
    // 4. Filtrar y aplanar los resultados
    const allPlans = results.flat().filter(plan => plan !== null);
    
    if (allPlans.length === 0) {
      throw new Error('No se encontraron planes disponibles');
    }

    return {
      vehicle: {
        ppu: quoteData.ppu,
        brand: quoteData.brand,
        model: quoteData.model,
        year: quoteData.year
      },
      plans: allPlans
    };
  } catch (error) {
    console.error('Error en el flujo de cotización:', error);
    throw error;
  }
}; 