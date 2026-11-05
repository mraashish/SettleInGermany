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
      <Link href="/get-help"><Text variant="caption" weight="600" color="primary">{t('assist.humanHelp')}</Text></Link>
    </Text>
  );
}

export function NeedsInternet() {
  const { t } = useTranslation();
  const { c } = useTheme();
  return (
    <View accessibilityRole="alert" style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: c.divider, borderRadius: 12, padding: 12 }}>
      <Icon icon={WifiOff} size={20} color="text3" />
      <Text size={14} color="text3" style={{ flex: 1 }}>{t('common.needsInternet')}. {t('assist.offlineNote')}</Text>
    </View>
  );
}

/** Premium AI tools show a soft upgrade card to free users (demo mode unlocks for review). */
export function usePremiumUnlocked() {
  const { premium } = useEntitlement();
  return premium || AI_DEMO;
}

export function AiScreen({ children, title, premiumOnly, ...rest }: ScreenProps & { premiumOnly?: boolean }) {
  const { t } = useTranslation();
  const online = useOnline();
  const unlocked = usePremiumUnlocked();
  return (
    <Screen
      {...rest}
      title={title}
      ai
      large={rest.large ?? false}
      customHeader={rest.customHeader}
      back={rest.back ?? { label: t('nav.assist'), href: '/assist' }}
      crumbs={rest.crumbs ?? [{ label: t('nav.assist'), href: '/assist' }, { label: title }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AILabel />
        <Text size={13} color="muted">{t('assist.disclaimer')}</Text>
      </View>
      {!online ? <NeedsInternet /> : null}
      {premiumOnly && !unlocked ? (
        <UpgradeCard title={t('assist.partOfPremium', { title })} body={t('assist.partOfPremiumBody')} />
      ) : children}
      <AiDisclaimer />
    </Screen>
  );
}
