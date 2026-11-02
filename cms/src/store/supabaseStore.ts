import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { CollectionName } from '../../../src/content/collections';
import type { ContentStore, Doc, Editor, Json, Release, Revision, Role, User } from './types';

const DOC_COLUMNS = 'id, collection, key, data, sort_order, status, has_changes, published_at, updated_at';

const toUser = (u: { id: string; email?: string | null } | null | undefined): User | null => (u ? { id: u.id, email: u.email ?? null } : null);

function fail(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

/** The central content database (Supabase). Row-level security does the access control. */
export function createSupabaseStore(url: string, anonKey: string): ContentStore {
  const db: SupabaseClient = createClient(url, anonKey, { auth: { persistSession: true, detectSessionInUrl: true } });

  return {
    mode: 'supabase',
    async currentUser() {
      const { data } = await db.auth.getUser();
      return toUser(data.user);
    },
    onAuthChange(cb) {
      const { data } = db.auth.onAuthStateChange((_e, s) => cb(toUser(s?.user)));
      return () => data.subscription.unsubscribe();
    },
    async signInWithPassword(email, password) {
      const { error } = await db.auth.signInWithPassword({ email, password });
      fail(error);
    },
    async sendMagicLink(email) {
      const { error } = await db.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin, shouldCreateUser: false } });
      fail(error);
    },
    async signOut() {
      await db.auth.signOut();
    },
    async role() {
      const { data, error } = await db.rpc('cms_current_role');
      fail(error);
      return (data as Role | null) ?? null;
    },

    async listDocuments() {
      const { data, error } = await db.from('content_documents').select(DOC_COLUMNS).order('collection').order('sort_order').order('key');
      fail(error);
      return (data ?? []) as Doc[];
    },
    async saveDocument({ id, collection, data, sort_order }) {
      const q = id
        ? db.from('content_documents').update({ data, sort_order }).eq('id', id)
        : db.from('content_documents').insert({ collection, key: '-', data, sort_order });
      const { data: row, error } = await q.select(DOC_COLUMNS).single();
      if (error?.code === '23505') throw new Error('Another document in this collection already uses this slug / id.');
      fail(error);
      return row as Doc;
    },
    async deleteDocument(id) {
      const { error, count } = await db.from('content_documents').delete({ count: 'exact' }).eq('id', id);
      fail(error);
      if (!count) throw new Error('Only admins can delete documents.');
    },
    async reorder(items) {
      for (const it of items) {
        const { error } = await db.from('content_documents').update({ sort_order: it.sort_order }).eq('id', it.id);
        fail(error);
      }
    },
    async validate(collection: CollectionName, data: Json) {
      const { data: errs, error } = await db.rpc('content_validate', { p_collection: collection, p_data: data });
      fail(error);
      return (errs as string[]) ?? [];
    },

    async publish(ids, note) {
      const { data, error } = await db.rpc('publish_documents', { p_ids: ids, p_note: note || null });
      fail(error);
      return Number(data);
    },
    async unpublish(ids, note) {
      const { data, error } = await db.rpc('unpublish_documents', { p_ids: ids, p_note: note || null });
      fail(error);
      return Number(data);
    },
    async revisions(id) {
      const { data, error } = await db.from('content_revisions').select('id, action, data, note, created_at').eq('document_id', id).order('id', { ascending: false }).limit(50);
      fail(error);
      return (data ?? []) as Revision[];
    },
    async releases() {
      const { data, error } = await db.from('content_events').select('*').order('id', { ascending: false }).limit(30);
      fail(error);
      return (data ?? []) as Release[];
    },
    async liveVersion() {
      const { data, error } = await db.from('content_state').select('version, published_at').single();
      fail(error);
      return { version: Number(data?.version ?? 0), published_at: (data?.published_at as string) ?? null };
    },
    subscribe(cb) {
      const ch = db
        .channel('cms-documents')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'content_documents' }, () => cb())
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'content_state' }, () => cb())
        .subscribe();
      return () => void db.removeChannel(ch);
    },

    async listEditors() {
      const { data, error } = await db.from('cms_editors').select('user_id, email, role').order('email');
      fail(error);
      return (data ?? []) as Editor[];
    },
    async setEditorRole(userId, role) {
      const { error } = await db.from('cms_editors').update({ role }).eq('user_id', userId);
      fail(error);
    },
    async removeEditor(userId) {
      const { error } = await db.from('cms_editors').delete().eq('user_id', userId);
      fail(error);
    },
    async inviteEditor(email, role) {
      const { data, error } = await db.functions.invoke('invite-editor', { body: { email, role } });
      if (error) throw new Error((data as { error?: string } | null)?.error ?? error.message);
    },
    async upload(file) {
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, '_')}`;
      const { error } = await db.storage.from('content-media').upload(path, file, { contentType: file.type, upsert: false });
      fail(error);
      return db.storage.from('content-media').getPublicUrl(path).data.publicUrl;
    },
  };
}
