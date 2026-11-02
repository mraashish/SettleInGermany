import type { CollectionName } from '../../../src/content/collections';

export type Status = 'draft' | 'published' | 'unpublished';
export type Role = 'editor' | 'admin';
export type Json = Record<string, unknown>;

export interface Doc {
  id: string;
  collection: CollectionName;
  key: string;
  data: Json;
  sort_order: number;
  status: Status;
  has_changes: boolean;
  published_at: string | null;
  updated_at: string;
}

export interface Revision {
  id: number;
  action: 'create' | 'update' | 'publish' | 'unpublish';
  data: Json;
  note: string | null;
  created_at: string;
}

export interface Release {
  id: number;
  version: number;
  action: 'publish' | 'unpublish' | 'delete';
  collections: string[];
  document_ids: string[];
  note: string | null;
  created_at: string;
  processed_at: string | null;
  result: Json | null;
}

export interface Editor { user_id: string; email: string | null; role: Role }

export interface User { id: string; email: string | null }

/** Everything the CMS needs from the central database. */
export interface ContentStore {
  readonly mode: 'supabase' | 'demo';
  currentUser(): Promise<User | null>;
  onAuthChange(cb: (u: User | null) => void): () => void;
  signInWithPassword(email: string, password: string): Promise<void>;
  sendMagicLink(email: string): Promise<void>;
  signOut(): Promise<void>;
  role(): Promise<Role | null>;

  listDocuments(): Promise<Doc[]>;
  saveDocument(input: { id?: string; collection: CollectionName; data: Json; sort_order: number }): Promise<Doc>;
  deleteDocument(id: string): Promise<void>;
  reorder(items: { id: string; sort_order: number }[]): Promise<void>;
  validate(collection: CollectionName, data: Json): Promise<string[]>;

  publish(ids: string[], note: string): Promise<number>;
  unpublish(ids: string[], note: string): Promise<number>;
  revisions(id: string): Promise<Revision[]>;
  releases(): Promise<Release[]>;
  liveVersion(): Promise<{ version: number; published_at: string | null }>;
  /** Other editors' changes (Realtime). */
  subscribe(cb: () => void): () => void;

  listEditors(): Promise<Editor[]>;
  setEditorRole(userId: string, role: Role): Promise<void>;
  removeEditor(userId: string): Promise<void>;
  inviteEditor(email: string, role: Role): Promise<void>;
  upload(file: File): Promise<string>;
}
