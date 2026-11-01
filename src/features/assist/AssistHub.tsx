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
  { id: 'reply', title: 'Write a reply', sub: 'A formal German letter or email', href: '/assist/reply' },
  { id: 'chat', title: 'Ask a question', sub: 'Answers from our guides', href: '/assist/ask' },
  { id: 'scam', title: 'Housing scam checker', sub: 'Paste a listing or message', href: '/assist/scam-check' },
  { id: 'contract', title: 'Rental contract explainer', sub: 'Clause by clause', href: '/assist/contract' },
  { id: 'form', title: 'Form assistant', sub: 'Fill official forms field by field', href: '/assist/forms/anmeldung' },
  { id: 'jobkit', title: 'Job application kit', sub: 'CV, cover letter, interview', href: '/assist/job-kit' },
  { id: 'practice', title: 'Conversation practice', sub: 'Role-play the immigration office or a flat viewing', href: '/assist/practice' },
];

/** Free scan dots + "N free scans left this month" — shown BEFORE a scan starts. */
export function ScanQuota({ compact }: { compact?: boolean }) {
  const { c } = useTheme();
  const usage = useUsage().data;
  const { premium } = useEntitlement();
  if (premium) return null;
  const left = usage?.scansLeft ?? 3;
  const per = usage?.scansPerMonth ?? 3;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <View accessible accessibilityRole="image" accessibilityLabel={`${left} of ${per} free scans left`} style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: per }).map((_, i) => (
          <View key={i} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: i < left ? c.accent : c.divider, borderWidth: 1, borderColor: i < left ? c.accent : c.borderStrong }} />
        ))}
      </View>
      <Text size={14} weight="600" style={{ flex: compact ? undefined : 1 }}>{left} free scans left this month</Text>
      {!compact ? <Link href="/premium"><Text size={14} weight="700" color="primary">See Premium</Text></Link> : null}
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
          <Text size={20} lineHeight={26} weight="700" color={c.heroText} heading>Scan a letter</Text>
          <AILabel />
        </View>
        <Text color={c.heroSub}>Who sent it, what they want, your deadline and what to do — in plain words.</Text>
        <Button variant="premium" label="Start scan" disabled={!online} onPress={() => router.push('/assist/scan')} />
      </View>
      <SectionTitle>More help</SectionTitle>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          {r.map((x) => <PremiumTile key={x.id} title={x.title} sub={x.sub} href={x.href} locked={!premium} />)}
          {r.length < cols ? Array.from({ length: cols - r.length }).map((_, k) => <View key={k} style={{ flex: 1 }} />) : null}
        </View>
      ))}
      <SectionTitle>Recent</SectionTitle>
      <Card>
        <EmptyState icon={FileText} title="Nothing saved yet" body="Letters and replies you choose to save show up here. We don’t keep anything unless you ask." />
      </Card>
      <AiDisclaimer />
    </Screen>
  );
}
