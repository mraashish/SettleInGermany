import { describe, expect, it } from '@jest/globals';

import * as seed from '@/content/seed';
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


/** Walk every object in the seed and collect localized values ({ en: string, … }). */
function localizedValues(v: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(v)) v.forEach((x) => localizedValues(x, out));
  else if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.en === 'string') out.push(o);
    else Object.values(o).forEach((x) => localizedValues(x, out));
  }
  return out;
}

describe('Leipzig content (official sources, all languages)', () => {
  const all = {
    guides: seed.guides, tasks: seed.tasks, cities: seed.cities, rules: seed.rules, ruleChanges: seed.ruleChanges,
    providers: seed.providers, phrases: seed.phrases, helpServices: seed.helpServices, scamWarnings: seed.scamWarnings, embassies: seed.embassies,
  };

  it('has no placeholders left', () => {
    const text = JSON.stringify(all);
    expect(text).not.toMatch(/\[(—|X|date|Provider|Bank|Phone|What|When|Deadline|Asian|Nepali|Hindu|One-line|Two-line|€)/);
    expect(text).not.toContain('example.com');
  });

  it('every text is translated into Nepali and Hindi', () => {
    for (const v of localizedValues(all)) {
      expect(typeof v.ne).toBe('string');
      expect(typeof v.hi).toBe('string');
    }
  });

  it('every page names at least one official https source', () => {
    const withSources = [...seed.guides, ...seed.cities, ...seed.providers, ...seed.helpServices, ...seed.scamWarnings, ...seed.embassies, ...seed.ruleChanges, seed.rules];
    for (const x of withSources) {
      expect(x.sources?.length).toBeGreaterThan(0);
      for (const s of x.sources ?? []) expect(s.url).toMatch(/^https:\/\//);
    }
  });

  it('every guide has steps, a summary and a recent check date', () => {
    for (const g of seed.guides) {
      expect(g.steps.length).toBeGreaterThanOrEqual(3);
      expect(g.summary.what.en.length).toBeGreaterThan(20);
      expect(Date.parse(g.lastVerified)).toBeGreaterThan(Date.parse('2026-06-01'));
    }
  });

  it('every roadmap task opens a guide', () => {
    for (const t of seed.tasks) expect(t.guideSlug).toBeTruthy();
  });

  it('related links point to existing guides', () => {
    const slugs = new Set(seed.guides.map((g) => g.slug));
    for (const g of seed.guides) {
      for (const r of g.related) if (r.kind === 'guide') expect(slugs.has(r.href.replace('/guides/', ''))).toBe(true);
    }
  });

  it('rules are filled in', () => {
    expect(seed.rules.studentWorkFullDays).toBe(140);
    expect(seed.rules.blockedAccountMonthly).toBeGreaterThan(0);
    expect(seed.rules.miniJobLimitMonthly).toBeGreaterThan(0);
  });
});
