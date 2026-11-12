import { describe, expect, it } from '@jest/globals';

import { GERMAN_CITIES, searchCities } from '@/content/germanCities';
import * as seed from '@/content/seed';
import { providerForAge, yearlyCostForAge } from '@/features/tools/providerForYou';
import { formatDate } from '@/lib/deadline';
import { formatMoney, localizeDigits } from '@/lib/format';

describe('numbers and dates in the reader’s language', () => {
  it('formats money the same way in every language, with Devanagari digits for Nepali', () => {
    expect(formatMoney(1172.68, 'en', 2)).toBe('€1,172.68');
    expect(formatMoney(1172.68, 'hi', 2)).toBe('€1,172.68');
    expect(formatMoney(1172.68, 'ne', 2)).toBe('€१,१७२.६८');
  });
  it('writes dates without relying on the platform’s locale data', () => {
    expect(formatDate('2026-11-23', 'en', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })).toBe('Mon, 23 Nov 2026');
    expect(formatDate('2026-11-23', 'ne')).toBe('२३ नोभेम्बर २०२६');
    expect(formatDate('2026-11-23', 'hi', { day: 'numeric', month: 'long', year: 'numeric' })).toBe('23 नवंबर 2026');
  });
  it('uses one digit system in Nepali text but keeps levels and phone numbers', () => {
    expect(localizeDigits('९ मध्ये चरण 2', 'ne')).toBe('९ मध्ये चरण २');
    expect(localizeDigits('जर्मन B1 र § 32a, 2026', 'ne')).toBe('जर्मन B1 र § 32a, २०२६');
    expect(localizeDigits('0800 111 0 111', 'ne')).toBe('0800 111 0 111');
    expect(localizeDigits('Step 2', 'en')).toBe('Step 2');
  });
});

describe('city search', () => {
  it('finds English names and ignores matches in the middle of a word', () => {
    expect(searchCities(GERMAN_CITIES, 'Munich')).toEqual(['München']);
    expect(searchCities(GERMAN_CITIES, 'Mün')).toEqual(['München', 'Münster']);
    expect(searchCities(GERMAN_CITIES, 'muenchen')).toEqual(['München']);
    expect(searchCities(GERMAN_CITIES, 'xyz')).toEqual([]);
  });
});

describe('bank accounts for a given age', () => {
  const bank = (id: string) => seed.providers.find((p) => p.id === id)!;
  it('knows who is free at 27', () => {
    expect(providerForAge(bank('commerzbank'), 27).kind).toBe('free');
    expect(providerForAge(bank('deutsche-bank'), 27).kind).toBe('free');
    expect(providerForAge(bank('n26'), 27).kind).toBe('free');
    expect(providerForAge(bank('sparkasse'), 27).kind).toBe('check');
  });
  it('shows the fee once the free period is over', () => {
    expect(providerForAge(bank('ing'), 29)).toEqual({ kind: 'paid', monthly: 4.9 });
    expect(yearlyCostForAge(bank('commerzbank'), 29)).toBeCloseTo(118.8);
  });
});
