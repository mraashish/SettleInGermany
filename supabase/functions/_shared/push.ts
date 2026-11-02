/**
 * Pure helpers for rule-change push notifications (no Deno / network imports, so
 * they are unit-tested by Jest in src/__tests__/push.test.ts).
 */
export type Lang = 'en' | 'ne' | 'hi';

export interface RuleChangeDoc {
  id: string;
  date: string;
  affects: { nationalities?: string[]; statuses?: string[]; cities?: string[] };
  summary: { en: string; ne?: string; hi?: string };
  guideSlug?: string;
}

export interface PushToken {
  token: string;
  nationality: string | null;
  status: string | null;
  city: string | null;
  language: string | null;
}

export interface ExpoMessage {
  to: string;
  title: string;
  body: string;
  sound: null;
  data: { href: string; ruleChangeId: string };
}

const TITLE: Record<Lang, string> = { en: 'Rule change', ne: 'नियम परिवर्तन', hi: 'नियम में बदलाव' };

/** Same rule as the app's "For me" filter: every listed dimension must match. */
export function affectsProfile(a: RuleChangeDoc['affects'], t: Pick<PushToken, 'nationality' | 'status' | 'city'>): boolean {
  const ok = (list: string[] | undefined, v: string | null) => !list?.length || (!!v && list.includes(v));
  return ok(a.nationalities, t.nationality) && ok(a.statuses, t.status) && ok(a.cities, t.city);
}

export function buildMessages(rc: RuleChangeDoc, tokens: PushToken[]): ExpoMessage[] {
  return tokens
    .filter((t) => affectsProfile(rc.affects ?? {}, t))
    .map((t) => {
      const lang = (['en', 'ne', 'hi'].includes(t.language ?? '') ? t.language : 'en') as Lang;
      return {
        to: t.token,
        title: TITLE[lang],
        body: rc.summary[lang] ?? rc.summary.en,
        sound: null,
        data: { href: rc.guideSlug ? `/guides/${rc.guideSlug}` : '/alerts', ruleChangeId: rc.id },
      };
    });
}

export function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
