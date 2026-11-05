import { Link, router } from 'expo-router';
import { FileText } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useLayout } from '@/lib/useLayout';
import { useUsage } from '@/services/ai';
import { useOnline } from '@/services/network';
import { useEntitlement } from '@/services/purchases';
import { useTheme } from '@/theme/ThemeProvider';
import { AILabel, Button, Card, EmptyState, Icon, PremiumTile, Screen, SectionTitle, Text } from '@/ui';
import { AiDisclaimer, NeedsInternet } from './AiScaffold';

export const AI_TOOLS = [
  { id: 'reply', href: '/assist/reply' },
  { id: 'chat', href: '/assist/ask' },
  { id: 'scam', href: '/assist/scam-check' },
  { id: 'contract', href: '/assist/contract' },
  { id: 'form', href: '/assist/forms/anmeldung' },
  { id: 'jobkit', href: '/assist/job-kit' },
  { id: 'practice', href: '/assist/practice' },
]

/** Free scan dots + "N free scans left this month" — shown BEFORE a scan starts. */
export function ScanQuota({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const usage = useUsage().data;
  const { premium } = useEntitlement();
  if (premium) return null;
  const left = usage?.scansLeft ?? 3;
  const per = usage?.scansPerMonth ?? 3;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <View accessible accessibilityRole="image" accessibilityLabel={t('assist.scansLeftA11y', { left, per })} style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: per }).map((_, i) => (
          <View key={i} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: i < left ? c.accent : c.divider, borderWidth: 1, borderColor: i < left ? c.accent : c.borderStrong }} />
        ))}
      </View>
      <Text size={14} weight="600" style={{ flex: compact ? undefined : 1 }}>{t('assist.scansLeftMonth', { count: left })}</Text>
      {!compact ? <Link href="/premium"><Text size={14} weight="700" color="primary">{t('assist.seePremium')}</Text></Link> : null}
    </View>
  );
}

export function AssistHub() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const online = useOnline();
  const { premium } = useEntitlement();
  const { webWide } = useLayout();
  const cols = webWide ? 3 : 2;
  const rows: (typeof AI_TOOLS)[] = [];
  for (let i = 0; i < AI_TOOLS.length; i += cols) rows.push(AI_TOOLS.slice(i, i + cols));
  return (
    <Screen title={t('assist.title')} ai crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('assist.title') }]}>
      <ScanQuota />
      {!online ? <NeedsInternet /> : null}
      <View style={{ backgroundColor: c.heroBg, borderRadius: th.shape.card, padding: 20, gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}><Icon icon={FileText} color="onAccent" /></View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text size={20} lineHeight={26} weight="700" color={c.heroText} heading>{t('assist.scanTitle')}</Text>
          <AILabel />
        </View>
        <Text color={c.heroSub}>{t('assist.scanHeroBody')}</Text>
        <Button variant="premium" label={t('assist.startScan')} disabled={!online} onPress={() => router.push('/assist/scan')} />
      </View>
      <SectionTitle>{t('assist.moreHelp')}</SectionTitle>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          {r.map((x) => <PremiumTile key={x.id} title={t(`assist.tools.${x.id}`)} sub={t(`assist.tools.${x.id}Sub`)} href={x.href} locked={!premium} />)}
          {r.length < cols ? Array.from({ length: cols - r.length }).map((_, k) => <View key={k} style={{ flex: 1 }} />) : null}
        </View>
      ))}
      <SectionTitle>{t('assist.recent')}</SectionTitle>
      <Card>
        <EmptyState icon={FileText} title={t('assist.nothingSaved')} body={t('assist.nothingSavedBody')} />
      </Card>
      <AiDisclaimer />
    </Screen>
  );
}
