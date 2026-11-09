/**
 * German income tax 2026 (basic tariff, single person) — § 32a EStG as amended for 2026,
 * plus the solidarity surcharge (SolzG 1995 § 3, § 4). Used by the net pay calculator.
 *
 * Official sources:
 *  - § 32a EStG: https://www.gesetze-im-internet.de/estg/__32a.html
 *  - Lohnsteuer-Handbuch 2026, table of figures (Arbeitnehmer-Pauschbetrag 1,230 €,
 *    Sonderausgaben-Pauschbetrag 36 €, solidarity surcharge exemption 20,350 €).
 *
 * The 2026 tariff is fixed by law; the numbers here change only when the law does.
 */
export const TAX_YEAR = 2026;

/** § 32a Abs. 1 EStG 2026: zone limits and coefficients. */
export const TARIFF_2026 = {
  basicAllowance: 12348,
  zone2End: 17799,
  zone3End: 69878,
  zone4End: 277825,
} as const;

/** § 9a Nr. 1a EStG: lump sum for work-related expenses. */
export const EMPLOYEE_ALLOWANCE = 1230;
/** § 10c EStG: lump sum for special expenses. */
export const SPECIAL_EXPENSES_ALLOWANCE = 36;
/** SolzG 1995 § 3 Abs. 3 (2026): no surcharge up to this income-tax amount (single). */
export const SOLI_EXEMPTION = 20350;

/** Income tax for one year on taxable income `zvE` (euros), rounded down to whole euros. */
export function incomeTax2026(zvE: number): number {
  const x = Math.floor(Math.max(0, zvE));
  const t = TARIFF_2026;
  let tax: number;
  if (x <= t.basicAllowance) tax = 0;
  else if (x <= t.zone2End) {
    const y = (x - t.basicAllowance) / 10000;
    tax = (914.51 * y + 1400) * y;
  } else if (x <= t.zone3End) {
    const z = (x - t.zone2End) / 10000;
    tax = (173.1 * z + 2397) * z + 1034.87;
  } else if (x <= t.zone4End) tax = 0.42 * x - 11135.63;
  else tax = 0.45 * x - 19470.38;
  return Math.floor(tax);
}

/** Solidarity surcharge on a yearly income tax amount (single person). */
export function solidaritySurcharge(incomeTax: number): number {
  if (incomeTax <= SOLI_EXEMPTION) return 0;
  return Math.min(0.055 * incomeTax, 0.119 * (incomeTax - SOLI_EXEMPTION));
}

export interface WageTaxResult {
  /** Taxable income per year after allowances. */
  taxableYearly: number;
  incomeTaxMonthly: number;
  soliMonthly: number;
  churchTaxMonthly: number;
}

/**
 * Wage tax estimate for tax class I (single, no children) on a monthly gross wage.
 * Deducts the employee lump sum, the special-expenses lump sum and the employee's own
 * pension contribution (part of the Vorsorgepauschale). Health and care insurance paid
 * outside the job (students) are not part of the job's Vorsorgepauschale.
 */
export function wageTaxClass1(
  grossMonthly: number,
  opts: { pensionMonthly?: number; healthCareMonthly?: number; churchRate?: number } = {},
): WageTaxResult {
  const yearly = grossMonthly * 12;
  const deductions = EMPLOYEE_ALLOWANCE + SPECIAL_EXPENSES_ALLOWANCE + ((opts.pensionMonthly ?? 0) + (opts.healthCareMonthly ?? 0)) * 12;
  const taxableYearly = Math.max(0, yearly - deductions);
  const tax = incomeTax2026(taxableYearly);
  const soli = solidaritySurcharge(tax);
  const church = tax * (opts.churchRate ?? 0);
  return { taxableYearly, incomeTaxMonthly: tax / 12, soliMonthly: soli / 12, churchTaxMonthly: church / 12 };
}
