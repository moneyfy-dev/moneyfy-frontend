import type { Quoter } from '@/core/types';

export function buildQuoterSearchText(quoter: Quoter): string {
  return [
    quoter.quoterOwnerData.name,
    quoter.quoterOwnerData.paternalSurname,
    quoter.quoterOwnerData.maternalSurname,
    quoter.quoterPurchaserData.name,
    quoter.quoterPurchaserData.paternalSurname,
    quoter.quoterPurchaserData.maternalSurname,
    quoter.quoterCarData.brand,
    quoter.quoterCarData.model,
    quoter.quoterCarData.ppu,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function isQuoterInDateRange(
  createdDate: string,
  start: Date | null,
  end: Date | null,
): boolean {
  const quoterDate = new Date(createdDate);
  if (Number.isNaN(quoterDate.getTime())) return false;

  const startOfRange = start ? new Date(start) : null;
  startOfRange?.setHours(0, 0, 0, 0);

  const endOfRange = end ? new Date(end) : null;
  endOfRange?.setHours(23, 59, 59, 999);

  return (!startOfRange || quoterDate >= startOfRange)
    && (!endOfRange || quoterDate <= endOfRange);
}
