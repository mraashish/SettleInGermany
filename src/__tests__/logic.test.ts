import { describe, expect, it } from '@jest/globals';

import { guides } from '@/content/seed';
import { isOutdated } from '@/content/client';
import { daysUntil, taskDueDate, toneForDays } from '@/lib/deadline';
import { tabForPath } from '@/lib/navigation';
import { matchGuide } from '@/features/guides/search';

const l = (v: { en: string }) => v.en;

describe('deadline chip tones (HANDOFF §6)', () => {
  it('neutral > 30 d, warning ≤ 30 d, danger ≤ 7 d or expired', () => {
    expect(toneForDays(47)).toBe('neutral');
    expect(toneForDays(31)).toBe('neutral');
    expect(toneForDays(30)).toBe('warning');
    expect(toneForDays(8)).toBe('warning');
    expect(toneForDays(7)).toBe('danger');
    expect(toneForDays(-3)).toBe('danger');
  });

  it('counts deadlines from the arrival date', () => {
    expect(taskDueDate({ id: 'x', stage: 'first30', group: { en: '' }, title: { en: '' }, deadlineDaysAfterArrival: 14 }, '2026-10-18')).toBe('2026-11-01');
    expect(taskDueDate({ id: 'x', stage: 'first30', group: { en: '' }, title: { en: '' }, deadlineDaysAfterArrival: 14 }, null)).toBeNull();
  });

  it('daysUntil ignores time of day', () => {
    expect(daysUntil('2026-11-06', new Date('2026-11-01T23:00:00'))).toBe(5);
  });
});

describe('guide freshness', () => {
  it('flags guides verified more than 6 months ago', () => {
    const now = new Date('2026-11-01');
    expect(isOutdated('2026-03-02', now)).toBe(true);
    expect(isOutdated('2026-10-14', now)).toBe(false);
    expect(isOutdated('[date]', now)).toBe(false);
  });
});

describe('search', () => {
  const anmeldung = guides.find((g) => g.slug === 'register-your-address')!;
  it('finds guides by German term, including common misspellings', () => {
    expect(matchGuide(anmeldung, 'Anmeldung', l)).toBe(true);
    expect(matchGuide(anmeldung, 'anmeldun', l)).toBe(true);
    expect(matchGuide(anmeldung, 'register', l)).toBe(true);
    expect(matchGuide(anmeldung, 'sperrkonto', l)).toBe(false);
  });
});

describe('tab bar', () => {
  it('maps routes to tabs and hides the bar on full-screen flows', () => {
    expect(tabForPath('/')).toBe('home');
    expect(tabForPath('/roadmap/first30')).toBe('home');
    expect(tabForPath('/guides/register-your-address')).toBe('guides');
    expect(tabForPath('/assist/letters/1')).toBe('assist');
    expect(tabForPath('/tools/budget')).toBe('tools');
    expect(tabForPath('/me/privacy')).toBe('me');
    expect(tabForPath('/onboarding/3')).toBeNull();
    expect(tabForPath('/premium')).toBeNull();
    expect(tabForPath('/assist/scan')).toBeNull();
  });
});
