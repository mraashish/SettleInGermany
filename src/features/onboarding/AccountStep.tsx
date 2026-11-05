import * as AppleAuthentication from 'expo-apple-authentication';
import { Mail } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  ACCOUNTS_ENABLED, AuthError, displayNameFrom, getSession, sendEmailCode, signInWithAppleToken, signInWithGoogle, verifyEmailCode,
} from '@/services/auth';
import { prefsStore, setProfile, usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Checkbox, Text, TextField } from '@/ui';

/**
 * Onboarding step 8 / Me › Sign in: optional account. Every option needs the 16+
 * confirmation first; "Continue without account" never does (data stays on device).
 */
export function AccountStep({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const th = useTheme();
  const age = usePrefs((s) => s.ageConfirmed16);
  const [mode, setMode] = useState<'choose' | 'email' | 'code'>('choose');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'error' | 'info'; text: string } | null>(null);

  const finish = (name: string | null) => {
    prefsStore.set({ accountMode: 'account' });
    if (name && !prefsStore.get().profile.name) setProfile({ name });
    onDone();
  };

  // Web: Google sends the user back to this page with a session.
  useEffect(() => {
    if (Platform.OS !== 'web' || !ACCOUNTS_ENABLED) return;
    void getSession().then((s) => { if (s && prefsStore.get().accountMode !== 'account') finish(displayNameFrom(s)); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guard = () => {
    if (!age) { setMsg({ tone: 'error', text: t('onboarding.ageRequired') }); return false; }
    if (!ACCOUNTS_ENABLED) { setMsg({ tone: 'info', text: t('onboarding.accountsOff') }); return false; }
    return true;
  };
  const fail = (e: unknown) => {
    const c = e instanceof AuthError ? e.code : 'failed';
    if (c === 'cancelled') return;
    setMsg({ tone: 'error', text: c === 'invalid_code' ? t('onboarding.codeWrong') : c === 'not_configured' ? t('onboarding.accountsOff') : t('onboarding.signInFailed') });
  };
  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setMsg(null);
    try { await fn(); } catch (e) { fail(e); } finally { setBusy(false); }
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Checkbox checked={age} onChange={(v) => { prefsStore.set({ ageConfirmed16: v }); setMsg(null); }} label={t('onboarding.age')} tone={msg?.text === t('onboarding.ageRequired') ? 'danger' : 'default'} />
        <Text style={{ flex: 1 }} color="text2" onPress={() => prefsStore.set({ ageConfirmed16: !age })}>{t('onboarding.age')}</Text>
      </View>

      {mode === 'choose' ? (
        <>
          {Platform.OS === 'ios' ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={th.scheme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={12}
              style={{ height: 52 }}
              onPress={() => {
                if (!guard()) return;
                void run(async () => {
                  try {
                    const cred = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL, AppleAuthentication.AppleAuthenticationScope.FULL_NAME] });
                    if (!cred.identityToken) throw new AuthError('failed');
                    await signInWithAppleToken(cred.identityToken);
                    finish(cred.fullName?.givenName ?? null);
                  } catch (e) {
                    if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') throw new AuthError('cancelled');
                    throw e;
                  }
                });
              }}
            />
          ) : null}
          <Button variant="secondary" label={t('onboarding.google')} loading={busy} onPress={() => {
            if (!guard()) return;
            void run(async () => { const s = await signInWithGoogle(); if (s) finish(displayNameFrom(s)); });
          }} />
          <Button variant="secondary" icon={Mail} label={t('onboarding.email')} onPress={() => { if (guard()) setMode('email'); }} />
        </>
      ) : mode === 'email' ? (
        <>
          <TextField label={t('onboarding.emailLabel')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" autoFocus />
          <Button label={t('onboarding.sendCode')} loading={busy} disabled={!/^\S+@\S+\.\S+$/.test(email)} onPress={() => run(async () => {
            await sendEmailCode(email);
            setMode('code');
            setMsg({ tone: 'info', text: t('onboarding.codeSent', { email }) });
          })} />
          <Button variant="text" label={t('nav.back')} onPress={() => { setMode('choose'); setMsg(null); }} />
        </>
      ) : (
        <>
          <TextField label={t('onboarding.codeLabel')} value={code} onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" autoFocus />
          <Button label={t('onboarding.verifyCode')} loading={busy} disabled={code.length !== 6} onPress={() => run(async () => {
            const s = await verifyEmailCode(email, code);
            finish(displayNameFrom(s));
          })} />
          <Button variant="text" label={t('onboarding.resendCode')} onPress={() => run(async () => { await sendEmailCode(email); setMsg({ tone: 'info', text: t('onboarding.codeSent', { email }) }); })} />
        </>
      )}

      {msg ? (
        <View accessibilityRole="alert" style={{ backgroundColor: msg.tone === 'error' ? th.c.dangerBg : th.c.primaryTint, borderRadius: 12, padding: 12 }}>
          <Text size={14} color={msg.tone === 'error' ? 'danger' : 'text'}>{msg.text}</Text>
        </View>
      ) : null}
    </View>
  );
}
