import { describe, expect, it } from '@jest/globals';

import { guides, providers, tasks } from '@/content/seed';

describe('content rules', () => {
  it('every guide has a source-ready shape and a last-verified date', () => {
    for (const g of guides) {
      expect(g.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(g.term.term.length).toBeGreaterThan(0);
    }
  });

  it('tasks only link to guides that exist', () => {
    const slugs = new Set(guides.map((g) => g.slug));
    for (const t of tasks) if (t.guideSlug) expect(slugs.has(t.guideSlug)).toBe(true);
  });

  it('comparisons include non-partners (HANDOFF §7.7)', () => {
    for (const cat of ['blocked', 'bank'] as const) {
      expect(providers.some((p) => p.category === cat && !p.isPartner)).toBe(true);
    }
  });

  it('referral partners always have a referral URL so the disclosure shows', () => {
    for (const p of providers) if (p.isPartner) expect(p.referralUrl).toBeTruthy();
  });
});
