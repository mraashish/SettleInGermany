import type { Provider } from '@/content/types';

export type ForYou =
  | { kind: 'free' }
  | { kind: 'paid'; monthly: number }
  | { kind: 'check'; age: number }
  | { kind: 'unknown' };

/** What a bank account costs this person, given their age (students). */
export function providerForAge(p: Provider, age: number | null): ForYou {
  if (age == null || p.category !== 'bank') return { kind: 'unknown' };
  if (p.freeUpToAge == null) return { kind: 'free' };
  if (age <= p.freeUpToAge) return p.variesByBranch ? { kind: 'check', age: p.freeUpToAge } : { kind: 'free' };
  if (p.monthlyAfter != null) return { kind: 'paid', monthly: p.monthlyAfter };
  return p.variesByBranch ? { kind: 'check', age: p.freeUpToAge } : { kind: 'unknown' };
}

/** Sort key: what the account costs this person a year (unknown last). */
export function yearlyCostForAge(p: Provider, age: number | null): number {
  const f = providerForAge(p, age);
  if (f.kind === 'free') return 0;
  if (f.kind === 'check') return age != null && p.freeUpToAge != null && age <= p.freeUpToAge ? 1 : 500;
  if (f.kind === 'paid') return f.monthly * 12;
  return 1000;
}
