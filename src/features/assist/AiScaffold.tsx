import { Link } from 'expo-router';
import { WifiOff } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AI_DEMO } from '@/services/ai';
import { useOnline } from '@/services/network';
import { useEntitlement } from '@/services/purchases';
import { useTheme } from '@/theme/ThemeProvider';
import { AILabel, Icon, Screen, type ScreenProps, Text, UpgradeCard } from '@/ui';

/** Every AI screen: "AI" label, general-information notice, link to human help. Never ads. */
export function AiDisclaimer({ deleted }: { deleted?: boolean }) {
  const { t } = useTranslation();
  return (
    <Text variant="caption" color="muted">
      {t('common.generalInfo')} {deleted ? `${t('assist.deletedNote')} ` : ''}
      <Link href="/get-help"><Text variant="caption" weight="600" color="primary">Get human help</Text></Link>
    </Text>
  );
}

export function NeedsInternet() {
  const { t } = useTranslation();
  const { c } = useTheme();
  return (
    <View accessibilityRole="alert" style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: c.divider, borderRadius: 12, padding: 12 }}>
      <Icon icon={WifiOff} size={20} color="text3" />
      <Text size={14} color="text3" style={{ flex: 1 }}>{t('common.needsInternet')}. Your saved letters and guides still work offline.</Text>
    </View>
  );
}

/** Premium AI tools show a soft upgrade card to free users (demo mode unlocks for review). */
export function usePremiumUnlocked() {
  const { premium } = useEntitlement();
  return premium || AI_DEMO;
}

export function AiScreen({ children, title, premiumOnly, ...rest }: ScreenProps & { premiumOnly?: boolean }) {
  const online = useOnline();
  const unlocked = usePremiumUnlocked();
  return (
    <Screen
      {...rest}
      title={title}
      ai
      large={rest.large ?? false}
      customHeader={rest.customHeader}
      back={rest.back ?? { label: 'Assist', href: '/assist' }}
      crumbs={rest.crumbs ?? [{ label: 'Assist', href: '/assist' }, { label: title }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AILabel />
        <Text size={13} color="muted">AI answers are general information, not legal advice.</Text>
      </View>
      {!online ? <NeedsInternet /> : null}
      {premiumOnly && !unlocked ? (
        <UpgradeCard title={`${title} is part of Premium`} body="All guides, the roadmap, reminders and 3 letter scans a month stay free. Premium adds the AI tools and removes ads." />
      ) : children}
      <AiDisclaimer />
    </Screen>
  );
}
