import { api } from '../api/config';
import { STORAGE_KEYS, type CitiesResponse, type City } from '@/core/types';
import { storage } from '@/shared/utils/storage';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CitiesCache {
  fetchedAt: number;
  cities: City[];
}

let citiesRequest: Promise<City[]> | null = null;

const normalizeCities = (cities: City[]) =>
  [...cities]
    .map((city) => ({
      ...city,
      locations: [...(city.locations || [])].sort((a, b) => a.localeCompare(b, 'es')),
    }))
    .sort((a, b) => a.city.localeCompare(b.city, 'es'));

export const catalogService = {
  async getCities(force = false): Promise<City[]> {
    if (!force) {
      const cached = await storage.get<CitiesCache>(STORAGE_KEYS.CATALOGS.CITIES);
      const isFresh = cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS;

      if (isFresh) {
        return cached.cities;
      }
    }

    if (!citiesRequest) {
      citiesRequest = api
        .get<CitiesResponse>('/cities/find/all', {
          skipGlobalSuccessMessage: true,
          skipGlobalErrorMessage: true,
        } as any)
        .then(async (response) => {
          const cities = normalizeCities(response.data?.data?.cities || []);

          await storage.set(STORAGE_KEYS.CATALOGS.CITIES, {
            fetchedAt: Date.now(),
            cities,
          } satisfies CitiesCache);

          return cities;
        })
        .finally(() => {
          citiesRequest = null;
        });
    }

    return citiesRequest;
  },
};
