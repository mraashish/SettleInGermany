import { createDemoStore } from './demoStore';
import { createSupabaseStore } from './supabaseStore';
import type { ContentStore } from './types';

const url = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.EXPO_PUBLIC_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** One store for the whole CMS: the central database, or the demo store without config. */
export const store: ContentStore = url && key ? createSupabaseStore(url, key) : createDemoStore();
export * from './types';
