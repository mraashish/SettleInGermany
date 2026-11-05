import { Link } from 'expo-router';
import { Calculator } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useGuides, useL, usePhrases } from '@/content/client';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, GuideCard, Icon, Overline, Screen, Text } from '@/ui';
import { SearchField } from './GuidesScreen';
import { matchGuide } from './search';

const TOOLS = [
  { key: 'tools.compareBlocked', href: '/tools/compare/blocked-accounts', keys: 'sperrkonto blocked account' },
  { key: 'tools.compareBank', href: '/tools/compare/bank-accounts', keys: 'girokonto bank konto' },
  { key: 'tools.budget', href: '/tools/budget', keys: 'budget money rent miete geld' },
  { key: 'tools.netpay', href: '/tools/net-pay', keys: 'net pay salary minijob mini job lohn werkstudent' },
  { key: 'tools.worklimit', href: '/tools/work-limit', keys: 'work limit days student job arbeitstage' },
  { key: 'tools.phrasebook', href: '/tools/phrasebook', keys: 'phrase german words speak sprache' },
  { key: 'tools.safety', href: '/tools/safety', keys: 'emergency police 112 notruf scam betrug embassy' },
]

/** Search guides, tools and German words — forgiving of misspellings ("anmeldun"). */
export function SearchScreen() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const l = useL();
  const [q, setQ] = useState('');
  const { data: guides = [] } = useGuides();
  const { data: phrases = [] } = usePhrases();
  const g = q ? guides.filter((x) => matchGuide(x, q, l)) : [];
  const tools = q ? TOOLS.filter((x) => `${t(x.key)} ${x.keys}`.toLowerCase().includes(q.toLowerCase())) : [];
  const words = q ? phrases.filter((p) => p.german.toLowerCase().includes(q.toLowerCase()) || l(p.meaning).toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <Screen title={t('nav.search')} back={{ label: t('nav.home'), href: '/' }} large={false}>
      <SearchField value={q} onChange={setQ} autoFocus />
      {g.length ? (
        <View style={{ gap: 8 }}><Overline>{t('guides.title')}</Overline>
          <Card padded={false} style={{ paddingHorizontal: 16 }}>{g.map((x, i) => <GuideCard key={x.slug} guide={x} first={i === 0} />)}</Card>
        </View>
      ) : null}
      {tools.length ? (
        <View style={{ gap: 8 }}><Overline>{t('tools.title')}</Overline>
          {tools.map((x) => (
            <Link key={x.href} href={x.href as never} asChild>
              <Pressable accessibilityRole="link" style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 12, paddingHorizontal: 14 }}>
                <Icon icon={Calculator} color="primary" /><Text weight="600">{t(x.key)}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
      {words.length ? (
        <View style={{ gap: 8 }}><Overline>{t('guides.germanWords')}</Overline>
          {words.map((p) => <Card key={p.id}><Text lang="de" weight="600">{p.german}</Text><Text color="muted">{l(p.meaning)}</Text></Card>)}
        </View>
      ) : null}
      {q && !g.length && !tools.length && !words.length ? <Text color="muted">{t('guides.noResults', { q })}</Text> : null}
    </Screen>
  );
}
