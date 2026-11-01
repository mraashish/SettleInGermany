import type { Guide, Localized } from '@/content/types';

/** Common misspellings → canonical German term (e.g. "anmeldun"). Extend from CMS later. */
const ALIASES: Record<string, string> = {
  anmeldun: 'anmeldung', anmeldng: 'anmeldung', 'anmeldung ': 'anmeldung', aufenthalt: 'aufenthaltstitel',
  steuerid: 'steuer-id', 'tax id': 'steuer-id', sperr: 'sperrkonto', 'blocked account': 'sperrkonto', rundfunk: 'rundfunkbeitrag',
};

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').trim();

export function matchGuide(g: Guide, q: string, l: (v: Localized) => string): boolean {
  const query = norm(ALIASES[norm(q)] ?? q);
  if (!query) return true;
  const hay = [l(g.title), g.title.en, g.term.term, g.slug.replace(/-/g, ' ')].map(norm).join(' | ');
  if (hay.includes(query)) return true;
  // forgiving prefix match for partial words ("anmeldun")
  return hay.split(/[\s|-]+/).some((w) => w.startsWith(query.slice(0, Math.max(4, query.length - 1))));
}
