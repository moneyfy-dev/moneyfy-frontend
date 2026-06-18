import { api } from '../api/config';
import { STORAGE_KEYS, type RegionsResponse, type Region } from '@/core/types';
import { storage } from '@/shared/utils/storage';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface RegionsCache {
  fetchedAt: number;
  regions: Region[];
}

let regionsRequest: Promise<Region[]> | null = null;

const normalizeRegions = (regions: Region[]) =>
  [...regions]
    .map((region) => ({
      ...region,
      locations: [...(region.locations || [])].sort((a, b) => a.localeCompare(b, 'es')),
    }))
    .sort((a, b) => a.region.localeCompare(b.region, 'es'));

export const catalogService = {
  async getRegions(force = false): Promise<Region[]> {
    if (!force) {
      const cached = await storage.get<RegionsCache>(STORAGE_KEYS.CATALOGS.REGIONS);
      const isFresh = cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS;

      if (isFresh) {
        return cached.regions;
      }
    }

    if (!regionsRequest) {
      regionsRequest = (async () => {
        try {
          const response = await api.get<RegionsResponse>('/regions/find/all', {
            skipGlobalSuccessMessage: true,
            skipGlobalErrorMessage: true,
          } as any);

          const regions = normalizeRegions(
            response.data?.data?.regions || response.data?.data?.cities || [],
          );

          await storage.set(STORAGE_KEYS.CATALOGS.REGIONS, {
            fetchedAt: Date.now(),
            regions,
          } satisfies RegionsCache);

          return regions;
        } catch (primaryError) {
          const fallbackResponse = await api.get<RegionsResponse>('/cities/find/all', {
            skipGlobalSuccessMessage: true,
            skipGlobalErrorMessage: true,
          } as any);

          const regions = normalizeRegions(
            fallbackResponse.data?.data?.regions || fallbackResponse.data?.data?.cities || [],
          );

          await storage.set(STORAGE_KEYS.CATALOGS.REGIONS, {
            fetchedAt: Date.now(),
            regions,
          } satisfies RegionsCache);

          return regions;
        } finally {
          regionsRequest = null;
        }
      })();
    }

    return regionsRequest;
  },
};
