import { describe, expect, it } from '@jest/globals';

import { incomeTax2026, solidaritySurcharge, wageTaxClass1 } from '@/lib/incomeTax';

describe('income tax 2026 (§ 32a EStG)', () => {
  it('is zero up to the basic allowance', () => {
    expect(incomeTax2026(0)).toBe(0);
    expect(incomeTax2026(12348)).toBe(0);
  });
  it('matches published examples', () => {
    expect(incomeTax2026(50000)).toBe(10548);
  });
  it('is continuous at the zone limits', () => {
    for (const x of [17799, 69878, 277825]) {
      expect(Math.abs(incomeTax2026(x + 1) - incomeTax2026(x))).toBeLessThanOrEqual(1);
    }
  });
  it('charges no solidarity surcharge below the exemption', () => {
    expect(solidaritySurcharge(20000)).toBe(0);
    expect(solidaritySurcharge(30000)).toBeCloseTo(0.119 * (30000 - 20350), 2);
    expect(solidaritySurcharge(60000)).toBeCloseTo(0.055 * 60000, 2);
  });
  it('a 20-hour working-student job at €15/h pays little or no wage tax', () => {
    const gross = 15 * 20 * (52 / 12);
    const r = wageTaxClass1(gross, { pensionMonthly: gross * 0.093 });
    expect(r.taxableYearly).toBeLessThan(15000);
    expect(r.incomeTaxMonthly).toBeLessThan(40);
  });
});
