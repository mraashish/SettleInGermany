/// <reference types="node" />
/**
 * Writes src/content/snapshot.generated.json from the central database, so the static
 * website (SEO pages) and a first app launch without network contain the latest
 * published content. Runs before `expo export` (npm run build:web) and in EAS builds
 * (eas-build-post-install). Without EXPO_PUBLIC_SUPABASE_URL it leaves the file empty
 * and the app uses its bundled seed content.
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { type CollectionName, COLLECTIONS, isSingleton } from '../src/content/collections';

const root = join(__dirname, '..');
for (const f of ['.env.local', '.env']) {
  if (existsSync(join(root, f))) process.loadEnvFile(join(root, f));
}

const out = join(root, 'src', 'content', 'snapshot.generated.json');
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
  if (!url || !key) {
    writeFileSync(out, `${JSON.stringify({ generatedAt: null, collections: {} })}\n`);
    console.log('content:snapshot skipped (no EXPO_PUBLIC_SUPABASE_URL) — the app will use seed content.');
    return;
  }
  const rows: { collection: CollectionName; data: unknown }[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const res = await fetch(`${url}/rest/v1/published_content?select=collection,data&order=collection.asc,sort_order.asc,key.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + pageSize - 1}` },
    });
    if (!res.ok) throw new Error(`Snapshot failed: ${res.status} ${await res.text()}`);
    const page = (await res.json()) as typeof rows;
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  const stateRes = await fetch(`${url}/rest/v1/content_state?select=version`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const [{ version } = { version: null }] = stateRes.ok ? ((await stateRes.json()) as { version: number }[]) : [];

  const collections: Record<string, unknown> = {};
  for (const c of COLLECTIONS) {
    const docs = rows.filter((r) => r.collection === c).map((r) => r.data);
    if (isSingleton(c)) {
      if (docs[0]) collections[c] = docs[0];
    } else {
      collections[c] = docs;
    }
  }
  writeFileSync(out, `${JSON.stringify({ generatedAt: new Date().toISOString(), version, collections })}\n`);
  console.log(`content:snapshot wrote ${rows.length} documents (content version ${version}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
