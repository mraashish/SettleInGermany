import { describe, expect, it } from '@jest/globals';

import en from '@/i18n/locales/en';
import hi from '@/i18n/locales/hi';
import ne from '@/i18n/locales/ne';
import { has, usedKeys } from '../../scripts/i18n-keys';

const flat = (o: object, p = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [p + k] : flat(v as object, `${p}${k}.`)));

describe('translations', () => {
  const { static: keys } = usedKeys();

  it.each([['en', en], ['ne', ne], ['hi', hi]])('%s has every key used in the code', (_l, dict) => {
    expect(keys.filter((k) => !has(dict, k))).toEqual([]);
  });

  it.each([['ne', ne], ['hi', hi]])('%s has exactly the English keys and keeps every {{variable}}', (_l, dict) => {
    expect(flat(dict).sort()).toEqual(flat(en).sort());
    for (const k of flat(en)) {
      const vars = (s: string) => (s.match(/{{\w+}}/g) ?? []).sort().join(',');
      const get = (d: object) => k.split('.').reduce<unknown>((o, x) => (o as Record<string, unknown>)[x], d) as string;
      expect([k, vars(get(dict))]).toEqual([k, vars(get(en))]);
    }
  });

  it('Nepali and Hindi are actually translated (not English copies)', () => {
    const same = (d: object) => flat(en).filter((k) => {
      const get = (x: object) => k.split('.').reduce<unknown>((o, y) => (o as Record<string, unknown>)[y], x) as string;
      return /[a-z]{4,}/.test(get(en)) && get(en) === get(d);
    });
    // Brand/German words may stay identical; everything else must be translated.
    expect(same(ne).length).toBeLessThan(10);
    expect(same(hi).length).toBeLessThan(10);
  });
});
