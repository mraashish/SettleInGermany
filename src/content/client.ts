/**
 * Content client — reads the central content database (Supabase `published_content`).
 *
 *  - Live: when EXPO_PUBLIC_SUPABASE_URL is set, every collection is read from the
 *    database, and `useContentSync()` (src/content/sync.ts) refetches whatever an
 *    editor publishes, on iOS, Android and web at the same moment.
 *  - Baseline: `snapshot.generated.json` is written at build time (npm run content:snapshot)
 *    so static web pages and a first app launch without network have the real content.
 *  - Fallback: with no database configured, the bundled seed content is used.
 *
 * Screens use the TanStack Query hooks below; the persisted query cache keeps opened
 * guides working offline (HANDOFF §7.3).
 */
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { supabase } from '@/services/auth';
import { type CollectionName, type Collections, isSingleton } from './collections';
import * as seed from './seed';
import snapshot from './snapshot.generated.json';
import type { Lang, Localized } from './types';

export type { CollectionName, Collections } from './collections';

const SEED: Collections = {
  guides: seed.guides, tasks: seed.tasks, cities: seed.cities, rules: seed.rules, ruleChanges: seed.ruleChanges,
  providers: seed.providers, phrases: seed.phrases, helpServices: seed.helpServices, scamWarnings: seed.scamWarnings, embassies: seed.embassies,
};

const SNAPSHOT = snapshot as unknown as { generatedAt: string | null; collections: Partial<Collections> };
const SNAPSHOT_AT = SNAPSHOT.generatedAt ? Date.parse(SNAPSHOT.generatedAt) : 0;

/** True when the app reads the central database. */
export const CMS_LIVE = !!supabase;

/** What the app can show before (or without) a network response. */
function baseline<K extends CollectionName>(name: K): Collections[K] | undefined {
  return (SNAPSHOT.collections[name] as Collections[K] | undefined) ?? (CMS_LIVE ? undefined : SEED[name]);
}

export async function fetchCollection<K extends CollectionName>(name: K): Promise<Collections[K]> {
  if (!supabase) return SEED[name];
  const { data, error } = await supabase
    .from('published_content')
    .select('data')
    .eq('collection', name)
    .order('sort_order', { ascending: true })
    .order('key', { ascending: true });
  if (error) throw error;
  const docs = (data ?? []).map((r) => r.data as unknown);
  return (isSingleton(name) ? (docs[0] ?? SEED[name]) : docs) as Collections[K];
}

/**
 * For static rendering (generateStaticParams / generateMetadata): uses the build
 * snapshot when present so the generated pages match the content baked into them.
 */
export async function staticCollection<K extends CollectionName>(name: K): Promise<Collections[K]> {
  return (SNAPSHOT.collections[name] as Collections[K] | undefined) ?? fetchCollection(name);
}

const useCollection = <K extends CollectionName>(name: K) =>
  useQuery({
    queryKey: ['cms', name],
    queryFn: () => fetchCollection(name),
    initialData: baseline(name),
    // Snapshot/seed data counts as old, so the live version is fetched right away.
    initialDataUpdatedAt: SNAPSHOT.collections[name] ? SNAPSHOT_AT : 0,
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

export { isOutdated } from './freshness';
