import { createClient, type Session } from '@supabase/supabase-js';

import { kv } from '@/lib/kv';

/**
 * Optional account (Supabase Auth): Sign in with Apple, Google, email.
 * "Continue without account" keeps everything on device (HANDOFF §7.2).
 */
const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const storage = {
  getItem: (k: string) => kv.get(k),
  setItem: (k: string, v: string) => kv.set(k, v),
  removeItem: (k: string) => kv.remove(k),
};

export const supabase = URL && ANON
  ? createClient(URL, ANON, { auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })
  : null;

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInWithEmail(email: string) {
  if (!supabase) throw new Error('Accounts are not configured yet');
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function signInWithAppleToken(identityToken: string) {
  if (!supabase) throw new Error('Accounts are not configured yet');
  const { error } = await supabase.auth.signInWithIdToken({ provider: 'apple', token: identityToken });
  if (error) throw error;
}

export async function signInWithGoogle(redirectTo: string) {
  if (!supabase) throw new Error('Accounts are not configured yet');
  return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } });
}

export async function signOut() {
  await supabase?.auth.signOut();
}
