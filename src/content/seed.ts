/**
 * Bundled content: the same documents the central database is seeded with
 * (npm run db:seed-sql). The app falls back to it when no database is configured.
 *
 * Leipzig content, checked against official sources on the date in `data/util.ts`.
 * Every guide, the city page, rules, providers, help services, scam warnings and
 * embassy contacts carry the sources they are based on.
 *
 * TODO(product owner): native-speaker review of the Nepali and Hindi texts.
 */
import type { Guide } from './types';
import { guidesBefore } from './data/guidesBefore';
import { guidesFirst30a } from './data/guidesFirst30a';
import { guidesFirst30b } from './data/guidesFirst30b';
import { guidesLater } from './data/guidesLater';

export { cities, embassies, helpServices, phrases, providers, ruleChanges, rules, scamWarnings, tasks } from './data/data';

export const guides: Guide[] = [...guidesBefore, ...guidesFirst30a, ...guidesFirst30b, ...guidesLater];
