import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Bell, Bookmark, CircleDollarSign, FileText, HelpCircle, LifeBuoy, Shield, Sparkles, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCities } from '@/content/client';
import { LANGUAGES, setLanguage } from '@/i18n';
import { formatDate } from '@/lib/deadline';
import { kv } from '@/lib/kv';
import { showPrivacyOptions } from '@/services/adsInit';
import { signOut } from '@/services/auth';
import { openConsentSettings } from '@/services/consent';
import { storeName, useEntitlement } from '@/services/purchases';
import { prefsStore, setConsent, usePrefs } from '@/store/prefs';
import { remindersStore } from '@/store/reminders';
import { roadmapStore } from '@/store/roadmap';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Card, Chip, LinkRow, Overline, Pill, Screen, Text, ToggleRow } from '@/ui';

function ProfileCard() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const p = usePrefs((s) => s.profile);
  const { data: cities = [] } = useCities();
  const city = cities.find((x) => x.slug === p.city)?.name;
  const { premium, expires } = useEntitlement();
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={22} weight="700" color={c.onPrimary}>{(p.name ?? '?').slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text size={17} weight="700">{p.name ?? t('me.signedOut')}</Text>
          <Text variant="caption" color="muted">{[p.status, p.nationality && `from ${p.nationality}`, city].filter(Boolean).join(' · ') || '—'}</Text>
          <Text variant="caption" color="muted">Stage: {t(`stages.${p.stage}`)}</Text>
        </View>
        <Button variant="text" fullWidth={false} label="Edit" onPress={() => router.push('/onboarding/2')} />
      </View>
      {premium ? <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Pill label="Premium" tone="accent" />{expires ? <Text variant="caption" color="muted">Renews {formatDate(expires)}</Text> : null}</View> : null}
    </Card>
  );
}

export function MeScreen() {
  const { t } = useTranslation();
  const { appearance, language, accountMode } = usePrefs();
  const groups = [
    { title: 'Your stuff', rows: [
      { title: t('reminders.title'), href: '/me/reminders', icon: Bell },
      { title: t('me.savedGuides'), href: '/guides?filter=saved', icon: Bookmark },
    ] },
    { title: 'Account', rows: [
      { title: t('me.subscription'), href: '/me/subscription', icon: Sparkles },
      { title: t('me.privacy'), href: '/me/privacy', icon: Shield },
    ] },
    { title: 'Help and information', rows: [
      { title: t('me.help'), href: '/get-help', icon: LifeBuoy },
      { title: t('me.money'), href: '/how-we-make-money', icon: CircleDollarSign },
      { title: t('me.impressum'), href: '/impressum', icon: FileText },
      { title: t('me.privacyPolicy'), href: '/privacy-policy', icon: HelpCircle },
    ] },
  ];
  return (
    <Screen title={t('me.title')} crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('me.title') }]}>
      <ProfileCard />
      <View style={{ gap: 8 }}>
        <Overline>{t('me.language')}</Overline>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {LANGUAGES.map((l) => <Chip key={l.code} label={l.native} selected={language === l.code} onPress={() => setLanguage(l.code)} />)}
        </View>
      </View>
      {Platform.OS !== 'web' ? (
        <View style={{ gap: 8 }}>
          <Overline>{t('me.appearance')}</Overline>
          <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {(['system', 'light', 'dark'] as const).map((a) => <Chip key={a} label={t(`me.${a}`)} selected={appearance === a} onPress={() => prefsStore.set({ appearance: a })} />)}
          </View>
        </View>
      ) : null}
      {groups.map((g) => (
        <View key={g.title} style={{ gap: 8 }}>
          <Overline>{g.title}</Overline>
          <Card padded={false} style={{ paddingHorizontal: 16 }}>
            {g.rows.map((r, i) => <LinkRow key={r.href} first={i === 0} {...r} />)}
          </Card>
        </View>
      ))}
      {accountMode === 'account' ? <Button variant="secondary" label="Sign out" onPress={() => { void signOut(); prefsStore.set({ accountMode: 'local' }); }} />
        : <Button variant="secondary" icon={User} label={t('nav.signIn')} onPress={() => router.push('/onboarding/8')} />}
      <Text variant="caption" color="muted" align="center">Version 1.0 · {t('common.generalInfo')}</Text>
    </Screen>
  );
}

export function PrivacyScreen() {
  const { t } = useTranslation();
  const consent = usePrefs((s) => s.consent);
  const { premium } = useEntitlement();
  const [aiHistory, setAiHistory] = useState(true);
  const download = async () => {
    const data = JSON.stringify({ prefs: prefsStore.get(), roadmap: roadmapStore.get(), reminders: remindersStore.get() }, null, 2);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      a.download = 'settle-in-germany-data.json';
      a.click();
    } else await Share.share({ message: data, title: 'My data' });
  };
  const del = () => {
    const go = () => { kv.clear(); prefsStore.reset(); roadmapStore.reset(); remindersStore.reset(); void signOut(); router.replace('/onboarding/1'); };
    if (Platform.OS === 'web') { if (typeof window !== 'undefined' && window.confirm('Delete everything we store about you?')) go(); }
    else Alert.alert(t('me.deleteAccount'), 'This removes everything we store about you within 30 days.', [{ text: t('nav.cancel'), style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: go }]);
  };
  return (
    <Screen title={t('me.privacy')} large={false} back={{ label: t('me.title'), href: '/me' }} crumbs={[{ label: t('me.title'), href: '/me' }, { label: t('me.privacy') }]}>
      <Overline>{t('me.whatWeStore')}</Overline>
      <Card style={{ gap: 8 }}>
        {['Your profile: nationality, status, city, stage', 'Your checklist progress, reminder dates and notes', 'Letters and replies — only the ones you chose to save', 'We never keep photos of your documents'].map((x) => <Text key={x} color="text2">• {x}</Text>)}
      </Card>
      <Overline>Your choices</Overline>
      <Card style={{ paddingVertical: 4 }}>
        <ToggleRow title={t('me.personalisedAds')} body={premium ? 'You have Premium — no ads' : 'Free plan only'} value={consent.personalisedAds} disabled={premium} onChange={(v) => setConsent({ personalisedAds: v })} />
        <ToggleRow title="Usage statistics" body="Helps us fix what’s confusing" value={consent.analytics} onChange={(v) => setConsent({ analytics: v })} />
        <ToggleRow title="Keep recent AI activity" body="Shows your last letters and replies in Assist" value={aiHistory} onChange={setAiHistory} />
      </Card>
      <Button variant="text" fullWidth={false} label={t('me.cookieSettings')} onPress={() => { openConsentSettings(); void showPrivacyOptions(); }} />
      <Button variant="secondary" label={t('me.downloadData')} onPress={download} />
      <Button variant="destructive" label={t('me.deleteAccount')} onPress={del} />
      <Text variant="caption" color="muted">Deleting removes everything we store about you within 30 days. If you have Premium, cancel it in your store first.</Text>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Button variant="text" fullWidth={false} label={t('me.privacyPolicy')} onPress={() => router.push('/privacy-policy')} />
        <Button variant="text" fullWidth={false} label={t('me.impressum')} onPress={() => router.push('/impressum')} />
      </View>
    </Screen>
  );
}

export function SubscriptionScreen() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const { premium, expires } = useEntitlement();
  const manageUrl = Platform.select({ ios: 'https://apps.apple.com/account/subscriptions', android: 'https://play.google.com/store/account/subscriptions', default: process.env.EXPO_PUBLIC_RC_WEB_PORTAL ?? '' });
  return (
    <Screen title={t('me.subscription')} large={false} back={{ label: t('me.title'), href: '/me' }} crumbs={[{ label: t('me.title'), href: '/me' }, { label: t('me.subscription') }]}>
      {premium ? (
        <>
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Pill label="Premium" tone="accent" /><Pill label="✓ Active" tone="success" /></View>
            {[['Renews on', expires ? formatDate(expires) : '—'], ['Paid through', storeName ?? '']].map(([k, v]) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: c.divider, paddingTop: 8 }}><Text color="text3">{k}</Text><Text weight="600">{v}</Text></View>
            ))}
          </Card>
          {manageUrl ? <Button variant="secondary" label={`Manage or cancel in ${storeName} ↗`} onPress={() => void WebBrowser.openBrowserAsync(manageUrl)} /> : null}
          <Text variant="caption" color="muted">If you cancel, Premium stays on until the end of the period. All guides and checklists stay free.</Text>
        </>
      ) : (
        <>
          <Card style={{ gap: 6 }}><Text weight="700">{t('me.free')}</Text><Text color="text2">{t('paywall.freeStays')} 3 letter scans a month.</Text></Card>
          <Button variant="premium" label="See Premium" onPress={() => router.push('/premium')} />
        </>
      )}
    </Screen>
  );
}
