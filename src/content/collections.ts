/**
 * The content collections stored in the central database (HANDOFF §8).
 * Shared by the apps, the CMS admin (cms/) and the database scripts — the DB function
 * `public.content_key()` mirrors KEY_FIELD, keep them in sync.
 */
import type {
  City, EmbassyContact, Guide, HelpService, Phrase, Provider, RoadmapTask, RuleChange, Rules, ScamWarning,
} from './types';

export type Collections = {
  guides: Guide[];
  tasks: RoadmapTask[];
  cities: City[];
  rules: Rules;
  ruleChanges: RuleChange[];
  providers: Provider[];
  phrases: Phrase[];
  helpServices: HelpService[];
  scamWarnings: ScamWarning[];
  embassies: EmbassyContact[];
};

export type CollectionName = keyof Collections;

export const COLLECTIONS: CollectionName[] = [
  'guides', 'tasks', 'cities', 'rules', 'ruleChanges', 'providers', 'phrases', 'helpServices', 'scamWarnings', 'embassies',
];

/** Field inside each document that is its unique key. `rules` is a single document. */
export const KEY_FIELD: Record<CollectionName, string | null> = {
  guides: 'slug',
  tasks: 'id',
  cities: 'slug',
  rules: null,
  ruleChanges: 'id',
  providers: 'id',
  phrases: 'id',
  helpServices: 'id',
  scamWarnings: 'id',
  embassies: 'country',
};

export const SINGLETON_KEY = 'default';

/** Collections that are one object rather than a list. */
export const isSingleton = (c: CollectionName) => KEY_FIELD[c] === null;

export function documentKey(collection: CollectionName, data: Record<string, unknown>): string {
  const f = KEY_FIELD[collection];
  return f ? String(data[f] ?? '') : SINGLETON_KEY;
}
