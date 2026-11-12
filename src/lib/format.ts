/**
 * Numbers, money and dates in the reader's language — without relying on the
 * platform's Intl data (many browsers and phones ship no Nepali locale data and
 * silently fall back to English).
 *
 *  - en: 5 Nov 2026 · €1,172.68
 *  - ne: ५ नोभेम्बर २०२६ · €१,१७२.६८   (Devanagari digits, as in the Nepali texts)
 *  - hi: 5 नवंबर 2026 · €1,172.68     (Western digits, as in the Hindi texts)
 *
 * Amounts use the English convention (comma for thousands, point for cents) in every
 * language — the German “€1.172,68” is easy to misread for people from Nepal and India.
 */
export type Lang = 'en' | 'ne' | 'hi';

const DEV = '०१२३४५६७८९';
const asLang = (lang: string | undefined): Lang => (lang === 'ne' || lang === 'hi' ? lang : 'en');

/** ASCII digits → Devanagari digits. */
export const toDevanagari = (s: string) => s.replace(/[0-9]/g, (d) => DEV[+d]);
/** Devanagari digits → ASCII digits (for parsing what people type on a Nepali keyboard). */
export const toAsciiDigits = (s: string) => s.replace(/[०-९]/g, (d) => String(DEV.indexOf(d)));

/** Digits in the reader's script: Devanagari for Nepali, unchanged otherwise. */
export const digits = (s: string | number, lang?: string) => (asLang(lang) === 'ne' ? toDevanagari(String(s)) : String(s));

/**
 * For Nepali UI text: Devanagari digits, except where Latin digits belong —
 * level codes and labels glued to letters (A1, B1, § 32a) and phone-like numbers.
 */
export function localizeDigits(text: string, lang?: string): string {
  if (asLang(lang) !== 'ne' || !/[0-9]/.test(text)) return text;
  const kept: string[] = [];
  // Placeholders use letters only, so the digit pass below can't touch them.
  const tag = (i: number) => `\u0000${String.fromCharCode(65 + i)}\u0000`;
  const protectedText = text.replace(/\+?\d[\d \-/]{6,}\d/g, (m) => {
    kept.push(m);
    return tag(kept.length - 1);
  });
  return protectedText
    .replace(/(?<![A-Za-z0-9§])\d+(?:[.,:]\d+)*(?![A-Za-z0-9])/g, (m) => toDevanagari(m))
    .replace(/\u0000([A-Z])\u0000/g, (_, c: string) => kept[c.charCodeAt(0) - 65]);
}

/** 1172.68 → "1,172.68" (Devanagari digits for Nepali). */
export function formatNumber(n: number, lang?: string, fractionDigits = 0): string {
  const fixed = Math.abs(n).toFixed(fractionDigits);
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const out = (n < 0 ? '−' : '') + grouped + (frac ? '.' + frac : '');
  return digits(out, lang);
}

/** Euro amount: €1,172.68 / €१,१७२.६८. */
export const formatMoney = (n: number, lang?: string, fractionDigits = 0) =>
  `${n < 0 ? '−' : ''}€${formatNumber(Math.abs(n), lang, fractionDigits)}`;

const MONTHS: Record<Lang, { short: string[]; long: string[] }> = {
  en: {
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  ne: {
    short: ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'],
    long: ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'],
  },
  hi: {
    short: ['जन॰', 'फ़र॰', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुल॰', 'अग॰', 'सित॰', 'अक्तू॰', 'नव॰', 'दिस॰'],
    long: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्तूबर', 'नवंबर', 'दिसंबर'],
  },
};

/** Monday-first weekday names. */
const WEEKDAYS: Record<Lang, { short: string[]; long: string[] }> = {
  en: { short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], long: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  ne: { short: ['सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि', 'आइत'], long: ['सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार', 'आइतबार'] },
  hi: { short: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'], long: ['सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'] },
};

export const monthName = (month: number, lang?: string, style: 'short' | 'long' = 'long') => MONTHS[asLang(lang)][style][month];
/** day: 0 = Monday … 6 = Sunday. */
export const weekdayName = (day: number, lang?: string, style: 'short' | 'long' = 'short') => WEEKDAYS[asLang(lang)][style][day];

export interface DateParts {
  weekday?: 'short' | 'long';
  day?: 'numeric';
  month?: 'short' | 'long';
  year?: 'numeric';
}

/** "Mon, 23 Nov 2026" · "सोम, २३ नोभेम्बर २०२६" · "सोम, 23 नव॰ 2026". Local calendar date. */
export function formatDateParts(d: Date, lang?: string, parts: DateParts = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  const L = asLang(lang);
  const bits: string[] = [];
  if (parts.day) bits.push(digits(d.getDate(), L));
  if (parts.month) bits.push(monthName(d.getMonth(), L, parts.month));
  if (parts.year) bits.push(digits(d.getFullYear(), L));
  const main = bits.join(' ');
  if (!parts.weekday) return main;
  const wd = weekdayName((d.getDay() + 6) % 7, L, parts.weekday);
  return main ? `${wd}, ${main}` : wd;
}
