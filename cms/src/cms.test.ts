import { beforeEach, describe, expect, it } from 'vitest';

import { COLLECTIONS } from '../../src/content/collections';
import { COLLECTION_DEFS, missingTranslations, slugify } from './schema';

const mem = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
  key: () => null,
  length: 0,
};

describe('schema', () => {
  it('defines an editor for every collection in the database', () => {
    expect(COLLECTION_DEFS.map((d) => d.name).sort()).toEqual([...COLLECTIONS].sort());
  });
  it('makes URL slugs from titles', () => {
    expect(slugify('Register your address in Größe!')).toBe('register-your-address-in-grosse');
  });
  it('finds missing Nepali / Hindi text, including nested lists', () => {
    const guides = COLLECTION_DEFS.find((d) => d.name === 'guides')!;
    const m = missingTranslations(guides.fields, { title: { en: 'A', ne: 'क', hi: 'क' }, steps: [{ title: { en: 'Step' } }] });
    expect(m).toEqual(['Steps 1 › Title']);
  });
});

describe('demo store (same rules as the database)', () => {
  beforeEach(() => mem.clear());

  it('publishes a release with one version bump and keeps drafts private', async () => {
    const { createDemoStore } = await import('./store/demoStore');
    const s = createDemoStore();
    const v0 = (await s.liveVersion()).version;
    const doc = await s.saveDocument({ collection: 'phrases', data: { id: 'p-x', german: 'Hallo', meaning: { en: 'Hello' }, situation: { en: 'Bank' }, transliteration: {} }, sort_order: 999 });
    expect(doc.status).toBe('draft');
    expect(doc.has_changes).toBe(true);
    const v1 = await s.publish([doc.id], 'test');
    expect(v1).toBe(v0 + 1);
    const after = (await s.listDocuments()).find((d) => d.id === doc.id)!;
    expect(after.status).toBe('published');
    expect(after.has_changes).toBe(false);
    expect((await s.releases())[0]).toMatchObject({ version: v1, action: 'publish', collections: ['phrases'] });
  });

  it('refuses to publish incomplete content', async () => {
    const { createDemoStore } = await import('./store/demoStore');
    const s = createDemoStore();
    const doc = await s.saveDocument({ collection: 'providers', data: { id: 'bad', name: 'P', category: 'bank', url: 'https://p.example', isPartner: true }, sort_order: 1 });
    await expect(s.publish([doc.id], '')).rejects.toThrow(/referral URL/);
  });

  it('rejects duplicate keys', async () => {
    const { createDemoStore } = await import('./store/demoStore');
    const s = createDemoStore();
    await expect(s.saveDocument({ collection: 'guides', data: { slug: 'register-your-address' }, sort_order: 1 })).rejects.toThrow(/already uses/);
  });
});
