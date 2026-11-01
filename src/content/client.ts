/**
 * Content client. With EXPO_PUBLIC_CMS_URL set it reads the headless CMS
 * (`GET {CMS}/{collection}?locale=xx`); otherwise it serves the bundled seed.
 * Screens use the TanStack Query hooks below; the persisted query cache makes
 * opened guides work offline (HANDOFF §7.3).
 *
 * TODO(product owner): choose CMS + hosting (HANDOFF §12) and map its API here.
 */
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import * as seed from './seed';
import type {
  City, EmbassyContact, Guide, HelpService, Lang, Localized, Phrase, Provider, RoadmapTask, RuleChange, Rules, ScamWarning,
} from './types';

const CMS = process.env.EXPO_PUBLIC_CMS_URL;

type Collections = {
  guides: Guide[]; tasks: RoadmapTask[]; cities: City[]; rules: Rules; ruleChanges: RuleChange[];
  providers: Provider[]; phrases: Phrase[]; helpServices: HelpService[]; scamWarnings: ScamWarning[]; embassies: EmbassyContact[];
};

const SEED: Collections = {
  guides: seed.guides, tasks: seed.tasks, cities: seed.cities, rules: seed.rules, ruleChanges: seed.ruleChanges,
  providers: seed.providers, phrases: seed.phrases, helpServices: seed.helpServices, scamWarnings: seed.scamWarnings, embassies: seed.embassies,
};

export async function fetchCollection<K extends keyof Collections>(name: K): Promise<Collections[K]> {
  if (!CMS) return SEED[name];
  const res = await fetch(`${CMS}/${name}`);
  if (!res.ok) throw new Error(`CMS ${name}: ${res.status}`);
  return (await res.json()) as Collections[K];
}

const useCollection = <K extends keyof Collections>(name: K) =>
  useQuery({
    queryKey: ['cms', name],
    queryFn: () => fetchCollection(name),
    // Seed data is available synchronously so static web pages render full content.
    initialData: CMS ? undefined : SEED[name],
    staleTime: 1000 * 60 * 30,
  });

export const useGuides = () => useCollection('guides');
export const useTasks = () => useCollection('tasks');
export const useCities = () => useCollection('cities');
export const useRules = () => useCollection('rules');
export const useRuleChanges = () => useCollection('ruleChanges');
export const useProviders = () => useCollection('providers');
export const usePhrases = () => useCollection('phrases');
export const useHelpServices = () => useCollection('helpServices');
export const useScamWarnings = () => useCollection('scamWarnings');
export const useEmbassies = () => useCollection('embassies');

export function useGuide(slug: string | undefined) {
  const q = useGuides();
  return { ...q, data: q.data?.find((x) => x.slug === slug) };
}

/** Resolve a localized field to the current UI language (falls back to English). */
export function useL() {
  const { i18n } = useTranslation();
  const lang = (i18n.language as Lang) ?? 'en';
  return (v: Localized | undefined) => (v ? (v[lang] ?? v.en) : '');
}

/** Guides verified more than 6 months ago show "We're re-checking this guide". */
export function isOutdated(lastVerified: string, now = new Date()): boolean {
  const d = new Date(lastVerified);
  if (Number.isNaN(d.getTime())) return false;
  const six = new Date(now);
  six.setMonth(six.getMonth() - 6);
  return d < six;
}
