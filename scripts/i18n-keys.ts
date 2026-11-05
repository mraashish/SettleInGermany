/// <reference types="node" />
/**
 * Lists translation keys used in the code (t('…')) that are missing from a locale.
 * Run: npx tsx scripts/i18n-keys.ts [en|ne|hi]   — also used by the Jest i18n test.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function usedKeys(root = join(__dirname, '..')): { static: string[]; dynamic: string[] } {
  const files: string[] = [];
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (f === 'node_modules' || f.startsWith('.') || f === '__tests__' || f === 'locales') continue;
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|jsx?)$/.test(f)) files.push(p);
    }
  };
  walk(join(root, 'src'));
  walk(join(root, 'app'));
  const st = new Set<string>();
  const dy = new Set<string>();
  for (const f of files) {
    const s = readFileSync(f, 'utf8');
    for (const m of s.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) st.add(m[1]);
    for (const m of s.matchAll(/\bt\(\s*`([^`]+)`/g)) dy.add(m[1]);
  }
  return { static: [...st].sort(), dynamic: [...dy].sort() };
}

export function has(obj: unknown, key: string): boolean {
  return key.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj) !== undefined;
}

if (require.main === module) {
  const lang = process.argv[2] ?? 'en';
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dict = require(`../src/i18n/locales/${lang}`).default;
  const { static: keys, dynamic } = usedKeys();
  const missing = keys.filter((k) => !has(dict, k));
  console.log(missing.join('\n'));
  console.error(`${missing.length} missing of ${keys.length}; dynamic patterns: ${dynamic.join(' | ')}`);
}
