import { Link } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React, { useState, useSyncExternalStore } from 'react';
import { Modal, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useLayout } from '@/lib/useLayout';
import { closeConsentSettings, useConsentUi } from '@/services/consent';
import { setConsent, usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { elevation2 } from '@/theme/tokens';
import { Button, Icon, Text, ToggleRow } from '@/ui';

/**
 * Consent (Consent.dc.html / WebConsent.dc.html). Shown on first launch / first web
 * visit before ANY personalised ads or non-essential tracking. "Accept all",
 * "Reject all" and "Settings" have equal visual weight.
 */
const noopSubscribe = () => () => undefined;

export function ConsentHost() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const insets = useSafeAreaInsets();
  const { webWide } = useLayout();
  const consent = usePrefs((s) => s.consent);
  const { settingsOpen } = useConsentUi();
  const [bannerMode, setMode] = useState<'banner' | 'settings'>('banner');
  const mode = settingsOpen ? 'settings' : bannerMode;
  // Toggle drafts start from the saved choice; null = untouched.
  const [adsDraft, setAds] = useState<boolean | null>(null);
  const [analyticsDraft, setAnalytics] = useState<boolean | null>(null);
  const ads = adsDraft ?? consent.personalisedAds;
  const analytics = analyticsDraft ?? consent.analytics;
  // Never part of the static HTML: consent is per visitor (server snapshot = false).
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const visible = mounted && (!consent.decided || settingsOpen);
  if (!visible) return null;

  const finish = (personalisedAds: boolean, a: boolean) => {
    setConsent({ personalisedAds, analytics: a });
    closeConsentSettings();
    setMode('banner');
    setAds(null);
    setAnalytics(null);
  };
  const btnR = th.platform === 'android' ? 999 : 12;
  const eq = { minHeight: 52, borderRadius: btnR } as const;

  const content = mode === 'banner' ? (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon icon={ShieldCheck} color="primary" />
        </View>
        <Text size={22} lineHeight={28} weight="700" heading nativeID="consent-title">{t('consent.title')}</Text>
      </View>
      {Platform.OS === 'web' ? (
        <Text size={15} lineHeight={23} color="text2">{t('consent.webBody')}</Text>
      ) : (
        <>
          <Text size={15} lineHeight={23} color="text2">{t('consent.body1')}</Text>
          <Text size={15} lineHeight={23} color="text2">{t('consent.body2')}</Text>
        </>
      )}
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/privacy-policy" onPress={closeConsentSettings}><Text size={14} weight="600" color="primary">{t('me.privacyPolicy')}</Text></Link>
        <Link href="/how-we-make-money" onPress={closeConsentSettings}><Text size={14} weight="600" color="primary">{t('consent.partners')}</Text></Link>
      </View>
      <View style={{ flexDirection: webWide ? 'row' : 'column', gap: 10, paddingTop: 4 }}>
        <Button variant="secondary" label={t('consent.acceptAll')} onPress={() => finish(true, true)} style={{ ...eq, flex: webWide ? 1 : undefined }} />
        <Button variant="secondary" label={t('consent.rejectAll')} onPress={() => finish(false, false)} style={{ ...eq, flex: webWide ? 1 : undefined }} />
        <Button variant="secondary" label={t('consent.settings')} onPress={() => setMode('settings')} style={{ ...eq, flex: webWide ? 1 : undefined }} />
      </View>
      <Text size={12} lineHeight={17} color="muted" align="center">{t('consent.footNote')}</Text>
    </>
  ) : (
    <>
      <Text size={22} lineHeight={28} weight="700" heading>{t('consent.settingsTitle')}</Text>
      <Text size={15} color="text2">{t('consent.settingsBody')}</Text>
      <View>
        <ToggleRow title={t('consent.essential')} body={`${t('consent.essentialBody')} · ${t('consent.alwaysOn')}`} value disabled />
        <ToggleRow title={t('consent.ads')} body={t('consent.adsBody')} value={ads} onChange={setAds} />
        <ToggleRow title={t('consent.analytics')} body={t('consent.analyticsBody')} value={analytics} onChange={setAnalytics} />
      </View>
      <Button label={t('consent.save')} onPress={() => finish(ads, analytics)} style={eq} />
      <View style={{ flexDirection: webWide ? 'row' : 'column', gap: 10 }}>
        <Button variant="secondary" label={t('consent.acceptAll')} onPress={() => finish(true, true)} style={{ ...eq, flex: webWide ? 1 : undefined }} />
        <Button variant="secondary" label={t('consent.rejectAll')} onPress={() => finish(false, false)} style={{ ...eq, flex: webWide ? 1 : undefined }} />
      </View>
    </>
  );

  return (
    <Modal visible transparent animationType="slide" onRequestClose={() => (consent.decided ? closeConsentSettings() : undefined)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(20,22,21,0.45)', justifyContent: webWide ? 'center' : 'flex-end', alignItems: webWide ? 'center' : 'stretch' }}>
        <View
          accessibilityViewIsModal
          aria-modal
          role="dialog"
          aria-labelledby="consent-title"
          style={[
            { backgroundColor: c.surface, maxHeight: '90%' },
            webWide
              ? { width: 640, maxWidth: '94%', borderRadius: 20, ...elevation2 }
              : { borderTopLeftRadius: th.platform === 'android' ? 28 : 16, borderTopRightRadius: th.platform === 'android' ? 28 : 16 },
          ]}
        >
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 + insets.bottom, gap: 14 }}>
            {!webWide ? <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: c.borderStrong }} /> : null}
            {content}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
