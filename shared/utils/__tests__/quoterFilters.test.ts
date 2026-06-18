import type { Quoter } from '@/core/types';
import { buildQuoterSearchText, isQuoterInDateRange } from '../quoterFilters';

const quoter = {
  quoterOwnerData: {
    name: 'Carolina',
    paternalSurname: 'Pérez',
    maternalSurname: 'Soto',
  },
  quoterPurchaserData: {
    name: 'Alejandro',
    paternalSurname: 'Osses',
    maternalSurname: 'Riquelme',
  },
  quoterCarData: {
    brand: 'Toyota',
    model: 'Yaris',
    ppu: 'CTJZ47',
  },
} as Quoter;

describe('quoter filters', () => {
  it('includes owner, purchaser and vehicle information in search text', () => {
    const searchText = buildQuoterSearchText(quoter);

    expect(searchText).toContain('carolina pérez soto');
    expect(searchText).toContain('alejandro osses riquelme');
    expect(searchText).toContain('toyota yaris ctjz47');
  });

  it('includes records from the complete end date', () => {
    expect(
      isQuoterInDateRange(
        '2026-06-15T22:45:00.000',
        null,
        new Date('2026-06-15T00:00:00'),
      ),
    ).toBe(true);
  });

  it('excludes records after the selected end date', () => {
    expect(
      isQuoterInDateRange(
        '2026-06-16T00:00:00.000',
        null,
        new Date('2026-06-15T00:00:00'),
      ),
    ).toBe(false);
  });
});
