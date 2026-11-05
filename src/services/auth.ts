import { createClient, type Session } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { kv } from '@/lib/kv';

/**
 * Optional account (Supabase Auth): Sign in with Apple, Google or email (6-digit code).
 * "Continue without account" keeps everything on device (HANDOFF §7.2).
 * Setup (Google provider, redirect URLs, email template): docs/CMS.md → "Accounts".
 */
const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const storage = {
  getItem: (k: string) => kv.get(k),
  setItem: (k: string, v: string) => kv.set(k, v),
  removeItem: (k: string) => kv.remove(k),
};

export const supabase = URL && ANON
  ? createClient(URL, ANON, {
      auth: { storage, autoRefreshToken: true, persistSession: true, flowType: 'pkce', detectSessionInUrl: Platform.OS === 'web' },
    })
  : null;

/** True when this build can create accounts. */
export const ACCOUNTS_ENABLED = !!supabase;

export class AuthError extends Error {
  constructor(public code: 'not_configured' | 'cancelled' | 'invalid_code' | 'failed', message?: string) {
    super(message ?? code);
  }
}

function db() {
  if (!supabase) throw new AuthError('not_configured');
  return supabase;
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Step 1 of email sign-in: we email a 6-digit code (works on every platform, no deep link needed). */
export async function sendEmailCode(email: string) {
  const { error } = await db().auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
  if (error) throw new AuthError('failed', error.message);
}

/** Step 2: verify the code from the email. */
export async function verifyEmailCode(email: string, code: string): Promise<Session> {
  const { data, error } = await db().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
  if (error || !data.session) throw new AuthError('invalid_code', error?.message);
  return data.session;
}

export async function signInWithAppleToken(identityToken: string) {
  const { error } = await db().auth.signInWithIdToken({ provider: 'apple', token: identityToken });
  if (error) throw new AuthError('failed', error.message);
}

/** Where Google sends the user back: the app's scheme on iOS/Android, this page on the web. */
export const authRedirectUri = () =>
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? `${window.location.origin}/onboarding/8`
    : makeRedirectUri({ scheme: 'settleingermany', path: 'auth/callback' });

/**
 * Google sign-in. Apps: opens Google in an in-app browser and exchanges the returned
 * code for a session. Web: redirects the page; the session is picked up on return.
 */
export async function signInWithGoogle(): Promise<Session | null> {
  const client = db();
  const redirectTo = authRedirectUri();
  if (Platform.OS === 'web') {
    const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) throw new AuthError('failed', error.message);
    return null; // page navigates away
  }
  const { data, error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } });
  if (error || !data.url) throw new AuthError('failed', error?.message);
  const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (res.type !== 'success') throw new AuthError('cancelled');
  const code = new globalThis.URL(res.url).searchParams.get('code');
  if (!code) throw new AuthError('failed', 'No sign-in code returned');
  const { data: s, error: e2 } = await client.auth.exchangeCodeForSession(code);
  if (e2 || !s.session) throw new AuthError('failed', e2?.message);
  return s.session;
}

export async function signOut() {
  await supabase?.auth.signOut();
}

export function displayNameFrom(session: Session | null): string | null {
  const m = session?.user.user_metadata as { full_name?: string; name?: string } | undefined;
  const full = m?.full_name ?? m?.name;
  return full ? full.split(' ')[0] : null;
}
