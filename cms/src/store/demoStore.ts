import { COLLECTIONS, type CollectionName, documentKey } from '../../../src/content/collections';
import * as seed from '../../../src/content/seed';
import type { ContentStore, Doc, Json, Release, Revision } from './types';
import { validateLocal } from './validate';

/**
 * In-browser stand-in for the database, used when the CMS has no Supabase
 * configuration — handy for trying the editor. Same rules as the database
 * (drafts, validation, one version per release), saved in localStorage only.
 */
const KEY = 'cms-demo-v1';
type State = { docs: (Doc & { published: Json | null })[]; revisions: Record<string, Revision[]>; releases: Release[]; version: number; publishedAt: string | null };

const hash = (d: Json) => JSON.stringify(d);
const now = () => new Date().toISOString();

function initial(): State {
  const docs: State['docs'] = [];
  for (const c of COLLECTIONS) {
    const v = seed[c] as unknown;
    (Array.isArray(v) ? v : [v]).forEach((data: Json, i: number) => {
      const ok = validateLocal(c, data).length === 0;
      docs.push({
        id: crypto.randomUUID(), collection: c, key: documentKey(c, data), data, sort_order: i * 10,
        status: ok ? 'published' : 'draft', has_changes: !ok, published_at: ok ? now() : null, updated_at: now(), published: ok ? data : null,
      });
    });
  }
  return { docs, revisions: {}, releases: [], version: 1, publishedAt: now() };
}

export function createDemoStore(): ContentStore {
  let st: State;
  try {
    st = JSON.parse(localStorage.getItem(KEY) ?? '') as State;
  } catch {
    st = initial();
  }
  const listeners = new Set<() => void>();
  const save = () => {
    localStorage.setItem(KEY, JSON.stringify(st));
    listeners.forEach((l) => l());
  };
  const view = (d: State['docs'][number]): Doc => ({ ...d, has_changes: d.status !== 'unpublished' && (d.published == null || hash(d.published) !== hash(d.data)) });
  const rev = (id: string, action: Revision['action'], data: Json, note: string | null = null) => {
    (st.revisions[id] ??= []).unshift({ id: Date.now() + Math.random(), action, data, note, created_at: now() });
  };
  const bump = (action: Release['action'], ids: string[], note: string) => {
    st.version += 1;
    st.publishedAt = now();
    const cols = [...new Set(ids.map((id) => st.docs.find((d) => d.id === id)?.collection ?? ''))].filter(Boolean);
    st.releases.unshift({ id: st.version, version: st.version, action, collections: cols, document_ids: ids, note: note || null, created_at: now(), processed_at: now(), result: { webDeploy: 'demo: not sent' } });
    return st.version;
  };
  const user = { id: 'demo', email: 'demo@localhost' };

  return {
    mode: 'demo',
    currentUser: async () => user,
    onAuthChange: () => () => undefined,
    signInWithPassword: async () => undefined,
    sendMagicLink: async () => undefined,
    signOut: async () => {
      localStorage.removeItem(KEY);
      st = initial();
      save();
    },
    role: async () => 'admin',

    listDocuments: async () => st.docs.map(view).sort((a, b) => a.collection.localeCompare(b.collection) || a.sort_order - b.sort_order),
    async saveDocument({ id, collection, data, sort_order }) {
      const key = documentKey(collection, data);
      if (!key.trim()) throw new Error('The document key (slug / id) is required');
      if (st.docs.some((d) => d.collection === collection && d.key === key && d.id !== id)) throw new Error('Another document in this collection already uses this slug / id.');
      let d = st.docs.find((x) => x.id === id);
      if (!d) {
        d = { id: crypto.randomUUID(), collection, key, data, sort_order, status: 'draft', has_changes: true, published_at: null, updated_at: now(), published: null };
        st.docs.push(d);
        rev(d.id, 'create', data);
      } else {
        if (hash(d.data) !== hash(data)) rev(d.id, 'update', data);
        Object.assign(d, { key, data, sort_order, updated_at: now() });
      }
      save();
      return view(d);
    },
    async deleteDocument(id) {
      const d = st.docs.find((x) => x.id === id);
      st.docs = st.docs.filter((x) => x.id !== id);
      if (d?.status === 'published') bump('delete', [id], '');
      save();
    },
    async reorder(items) {
      items.forEach((it) => { const d = st.docs.find((x) => x.id === it.id); if (d) d.sort_order = it.sort_order; });
      save();
    },
    validate: async (c, data) => validateLocal(c, data),

    async publish(ids, note) {
      for (const id of ids) {
        const d = st.docs.find((x) => x.id === id)!;
        const errs = validateLocal(d.collection as CollectionName, d.data);
        if (errs.length) throw new Error(`Cannot publish ${d.collection}/${d.key}: ${errs.join('; ')}`);
      }
      for (const id of ids) {
        const d = st.docs.find((x) => x.id === id)!;
        Object.assign(d, { status: 'published', published: d.data, published_at: now() });
        rev(id, 'publish', d.data, note || null);
      }
      const v = bump('publish', ids, note);
      save();
      return v;
    },
    async unpublish(ids, note) {
      for (const id of ids) {
        const d = st.docs.find((x) => x.id === id)!;
        Object.assign(d, { status: 'unpublished', published: null });
        rev(id, 'unpublish', d.data, note || null);
      }
      const v = bump('unpublish', ids, note);
      save();
      return v;
    },
    revisions: async (id) => st.revisions[id] ?? [],
    releases: async () => st.releases,
    liveVersion: async () => ({ version: st.version, published_at: st.publishedAt }),
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    listEditors: async () => [{ user_id: 'demo', email: 'demo@localhost', role: 'admin' }],
    setEditorRole: async () => undefined,
    removeEditor: async () => undefined,
    inviteEditor: async () => {
      throw new Error('Inviting editors needs the Supabase project (demo mode).');
    },
    upload: async (file) => URL.createObjectURL(file),
  };
}
