import * as WebBrowser from 'expo-web-browser';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useHelpServices, useL, useProviders } from '@/content/client';
import type { HelpService } from '@/content/types';
import { useTheme } from '@/theme/ThemeProvider';
import { AlertBanner, Card, Chip, DETag, Pill, Screen, SectionTitle, SourcesList, Text } from '@/ui';
import { LEGAL } from './legal';

export function MoneyScreen() {
  const { t } = useTranslation();
  const { data: providers = [] } = useProviders();
  const partners = providers.filter((p) => p.isPartner).length;
  const ways = ['ads', 'premium', 'referrals'] as const;
  const back = { label: t('nav.me'), href: '/me' };
  return (
    <Screen title={t('me.money')} large={false} back={back} crumbs={[{ label: t('nav.me'), href: '/me' }, { label: t('me.money') }]}
      description={t('money.intro')}>
      <Text color="text2">{t('money.intro')}</Text>
      {ways.map((w, i) => (
        <Card key={w} style={{ gap: 8 }}>
          <Text size={17} weight="700" heading>{i + 1}. {t(`money.${w}.title`)}</Text>
          <Text color="text2">{t(`money.${w}.body`)}</Text>
          {[1, 2, 3].map((n) => <Text key={n} size={14}>✓ {t(`money.${w}.p${n}`)}</Text>)}
        </Card>
      ))}
      <SectionTitle>{t('money.neverTitle')}</SectionTitle>
      <Card style={{ gap: 6 }}>{[1, 2, 3, 4].map((n) => <Text key={n} size={14} color="danger">✕ <Text size={14}>{t(`money.never${n}`)}</Text></Text>)}</Card>
      <Card style={{ gap: 4 }}>
        <Text weight="600">{t('money.partnersTitle')}</Text>
        <Text variant="caption" color="muted">{partners ? t('money.partnersCount', { count: partners }) : t('money.noPartners')}</Text>
        <Text weight="600" style={{ marginTop: 8 }}>{t('money.adPartners')}</Text>
        <Link href="/me/privacy"><Text size={14} color="primary" weight="600">{t('money.changeConsent')}</Text></Link>
      </Card>
      <Text size={14} color="text2">
        {t('money.feedback')}{' '}
        <Text size={14} weight="600" color="primary" onPress={() => void Linking.openURL('mailto:hello@settleingermany.app')}>{t('money.tellUs')}</Text>
      </Text>
    </Screen>
  );
}

const TOPICS = ['all', 'visa', 'housing', 'work', 'money', 'health', 'study'] as const;

function ServiceCard({ s }: { s: HelpService }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  return (
    <View accessibilityRole={'article' as never} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 16, gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Text weight="700" style={{ flex: 1 }}>{l(s.kind)}</Text>
        <Pill label={s.free ? t('help.free') : t('help.fee')} tone={s.free ? 'success' : 'neutral'} />
      </View>
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}><DETag /><Text lang="de" size={14} weight="500">{s.name}</Text></View>
      <Text color="text2">{l(s.description)}</Text>
      {s.cost ? <Text size={14} color="text2">{l(s.cost)}</Text> : null}
      {s.address ? <Text size={14} color="text2">📍 {s.address}</Text> : null}
      <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
        {s.phone ? (
          <Pressable accessibilityRole="button" onPress={() => void Linking.openURL(`tel:${s.phone!.replace(/[^\d+]/g, '')}`)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text weight="700" color="primary">☎ {s.phone}</Text>
          </Pressable>
        ) : null}
        {s.email ? (
          <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(`mailto:${s.email}`)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text weight="600" color="primary">{s.email}</Text>
          </Pressable>
        ) : null}
        {s.url ? (
          <Pressable accessibilityRole="link" onPress={() => void WebBrowser.openBrowserAsync(s.url!)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text weight="600" color="primary">{t('common.website')} ↗</Text>
          </Pressable>
        ) : null}
      </View>
      <SourcesList sources={s.sources} title={t('guides.sourceShort')} />
    </View>
  );
}

export function HelpScreen() {
  const { t } = useTranslation();
  const { data = [] } = useHelpServices();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('all');
  const list = data.filter((s) => topic === 'all' || s.topics?.includes(topic));
  return (
    <Screen title={t('me.help')} large={false} back={{ label: t('nav.me'), href: '/me' }} crumbs={[{ label: t('nav.me'), href: '/me' }, { label: t('me.help') }]}
      description={t('help.description')}>
      <Text color="text2">{t('help.intro')}</Text>
      <AlertBanner kind="info" title={t('help.dangerTitle')} body={t('help.dangerBody')}
        action={<Link href="/tools/safety"><Text size={14} weight="600" color="primary">{t('tools.safety')}</Text></Link>} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TOPICS.filter((x) => x === 'all' || data.some((s) => s.topics?.includes(x))).map((x) => (
          <Chip key={x} label={t(`help.topics.${x}`)} selected={topic === x} onPress={() => setTopic(x)} />
        ))}
      </View>
      {list.map((s) => <ServiceCard key={s.id} s={s} />)}
      <Text variant="caption" color="muted">{t('help.noMoney')}</Text>
    </Screen>
  );
}

/** Legal pages. The operator details in the Impressum must come from the product owner. */
export function LegalPage({ kind }: { kind: 'impressum' | 'privacy' | 'terms' }) {
  const { t, i18n } = useTranslation();
  const doc = LEGAL[kind];
  return (
    <Screen title={t(`legal.${kind}`)} large={false} back={{ label: t('nav.me'), href: '/me' }} crumbs={[{ label: t('nav.me'), href: '/me' }, { label: t(`legal.${kind}`) }]}>
      {i18n.language !== 'en' ? <AlertBanner kind="info" body={t('legal.englishOnly')} /> : null}
      {doc.sections.map((s) => (
        <View key={s.title} style={{ gap: 6 }}>
          <Text size={17} weight="700" heading>{s.title}</Text>
          {s.body.map((p, i) => <Text key={i} color="text2">{p}</Text>)}
        </View>
      ))}
      <Text variant="caption" color="muted">{doc.updated}</Text>
    </Screen>
  );
}
