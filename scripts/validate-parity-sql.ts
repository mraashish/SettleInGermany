/// <reference types="node" />
/**
 * Prints SQL that checks the CMS demo validator (cms/src/store/validate.ts) gives the
 * same answers as the database's public.content_validate(). Used by scripts/test-db.sh.
 */
import { COLLECTIONS, type CollectionName } from '../src/content/collections';
import * as seed from '../src/content/seed';
import { validateLocal } from '../cms/src/store/validate';

type J = Record<string, unknown>;
const cases: [CollectionName, J][] = [];
for (const c of COLLECTIONS) {
  const v = (seed as Record<string, unknown>)[c];
  for (const d of (Array.isArray(v) ? v : [v]) as J[]) {
    cases.push([c, d]);
    cases.push([c, { ...d, title: { en: '' }, name: '', german: '', summary: { en: '' }, kind: { en: '' } }]);
  }
}
cases.push(['guides', { ...seed.guides[0], slug: 'Bad Slug' }], ['guides', { ...seed.guides[0], stage: 'later' }]);
cases.push(['providers', { ...seed.providers[0], referralUrl: '' }], ['providers', { ...seed.providers[0], url: 'ftp://x' }]);
cases.push(['tasks', { id: '' }]);

const lit = (a: string[]) => (a.length ? `array[${a.map((s) => `'${s.replace(/'/g, "''")}'`).join(',')}]::text[]` : `'{}'::text[]`);
console.log('do $$ begin');
cases.forEach(([c, d], i) => {
  const exp = validateLocal(c, d);
  console.log(`  if public.content_validate('${c}', $j$${JSON.stringify(d)}$j$::jsonb) is distinct from ${lit(exp)} then raise exception 'validator parity case ${i} (${c}): db=% js=%', public.content_validate('${c}', $j$${JSON.stringify(d)}$j$::jsonb), ${lit(exp)}; end if;`);
});
console.log('end $$;');
console.log(`select 'validator parity: ${cases.length} cases match' as result;`);
