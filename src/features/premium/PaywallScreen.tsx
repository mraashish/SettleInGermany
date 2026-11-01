import { router } from 'expo-router';
import { Check, Sparkles, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { formatDate } from '@/lib/deadline';
import { useLayout } from '@/lib/useLayout';
import { getPackages, purchase, restore, storeName } from '@/services/purchases';
import { useTheme } from '@/theme/ThemeProvider';
import { elevation2 } from '@/theme/tokens';
import { Button, Icon, Pill, Text } from '@/ui';

const FEATURES = [
  'Scan every letter — no monthly limit',
  'Formal German replies, with a translation',
  'Ask questions in Nepali, Hindi or English',
  'Check flat listings and rental contracts',
  'No ads anywhere',
];

/**
 * Paywall (Paywall / WebPaywall): price after trial stated clearly, cancel note,
 * restore purchases (apps), terms + privacy, visible close. No countdowns, no fake scarcity.
 * iOS: sheet with grabber + close. Android: full-screen dialog with ✕. Web: centred dialog / full page.
 */
export function PaywallScreen() {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const { webWide } = useLayout();
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');
  const [pkgs, setPkgs] = useState<{ monthly?: PurchasesPackage; annual?: PurchasesPackage }>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => { void getPackages().then(setPkgs).catch(() => undefined); }, []);
  const [trialEndDate] = useState(() => new Date(Date.now() + 7 * 86400000));
  const trialEnd = formatDate(trialEndDate, i18n.language, { day: 'numeric', month: 'long' });
  const price = plan === 'annual' ? '€29.99 a year' : '€3.99 a month';
  const close = () => (router.canGoBack() ? router.back() : router.replace('/assist'));
  const buy = async () => {
    const p = plan === 'annual' ? pkgs.annual : pkgs.monthly;
    if (!p) { setMsg('Purchases aren’t available right now. Please try again later.'); return; }
    setBusy(true);
    try { if (await purchase(p)) close(); } catch { setMsg('The purchase didn’t go through. You haven’t been charged.'); } finally { setBusy(false); }
  };

  const option = (id: 'annual' | 'monthly', title: string, sub: string, badge?: string) => {
    const on = plan === id;
    return (
      <Pressable accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setPlan(id)}
        style={{ minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: on ? 2 : 1, borderColor: on ? c.primary : c.border, backgroundColor: on ? c.primaryTint : c.surface, borderRadius: 16, paddingHorizontal: on ? 15 : 16, paddingVertical: 10 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? c.primary : c.fieldBorder, alignItems: 'center', justifyContent: 'center' }}>
          {on ? <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c.primary }} /> : null}
        </View>
        <View style={{ flex: 1 }}><Text weight="700">{title}</Text><Text variant="caption" color="muted">{sub}</Text></View>
        {badge ? <Pill label={badge} tone="accent" /> : null}
      </Pressable>
    );
  };

  const body = (
    <View style={{ gap: 16 }}>
      <View style={{ alignItems: 'center', gap: 10 }}>
        <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Sparkles} size={32} color="onAccent" /></View>
        <Pill label={t('common.premium')} tone="accent" center />
        <Text size={26} lineHeight={32} weight="700" align="center" heading={1}>Understand every German letter in seconds</Text>
      </View>
      <View style={{ gap: 10 }}>
        {FEATURES.map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.successBg, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Check} size={14} color="successText" strokeWidth={3} /></View>
            <Text style={{ flex: 1 }}>{f}</Text>
          </View>
        ))}
      </View>
      <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
        {option('annual', 'Yearly · €29.99', '€2.50 a month, billed once a year', 'Save 37%')}
        {option('monthly', 'Monthly · €3.99', 'Billed every month')}
      </View>
      <Button size="large" label="Start 7-day free trial" loading={busy} onPress={buy} />
      <Text size={14} align="center" color="text2">Free until {trialEnd}, then {price}.{'\n'}Cancel any time before then and you pay nothing.</Text>
      <Text variant="caption" align="center" color="muted">
        {Platform.OS === 'web' ? 'Cancel any time in Me › Subscription.' : `Cancel in your ${storeName} settings.`}
      </Text>
      {msg ? <Text size={14} align="center" color="danger" accessibilityRole="alert">{msg}</Text> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        {Platform.OS !== 'web' ? <Button variant="text" fullWidth={false} label={t('paywall.restore')} onPress={async () => { if (await restore()) close(); else setMsg('No purchases to restore on this account.'); }} /> : null}
        <Button variant="text" fullWidth={false} label={t('me.terms')} onPress={() => router.push('/terms')} />
        <Button variant="text" fullWidth={false} label="Privacy" onPress={() => router.push('/privacy-policy')} />
      </View>
      <Text variant="caption" align="center" color="muted">{t('paywall.freeStays')}</Text>
    </View>
  );

  const closeBtn = (
    <Pressable accessibilityRole="button" accessibilityLabel={t('nav.close')} onPress={close} style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Icon icon={X} />
    </Pressable>
  );

  if (Platform.OS === 'web' && webWide) {
    return (
      <View style={{ flex: 1, backgroundColor: c.scrim, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View accessibilityViewIsModal style={{ width: 520, maxWidth: '100%', maxHeight: '96%', backgroundColor: c.surface, borderRadius: 20, ...elevation2 }}>
          <View style={{ alignItems: 'flex-end', padding: 4 }}>{closeBtn}</View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 28 }}>{body}</ScrollView>
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView edges={th.platform === 'ios' ? ['bottom'] : ['top', 'bottom']} style={{ flex: 1, backgroundColor: c.surface }}>
      <View style={{ flexDirection: 'row', justifyContent: th.platform === 'android' ? 'flex-start' : 'flex-end', padding: 4 }}>{closeBtn}</View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>{body}</ScrollView>
    </SafeAreaView>
  );
}
