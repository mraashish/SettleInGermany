import { BookOpenText, Calculator, CircleDollarSign, Clock, Landmark, Languages, MapPin, ShieldAlert, Wallet } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { usePrefs } from '@/store/prefs';
import { Card, LinkRow, Overline, Screen } from '@/ui';

export function ToolsHub() {
  const { t } = useTranslation();
  const city = usePrefs((s) => s.profile.city);
  const groups = [
    { title: t('tools.compare'), items: [
      { title: t('tools.blocked'), sub: 'Sperrkonto · fees and opening time', href: '/tools/compare/blocked-accounts', icon: Landmark },
      { title: t('tools.bank'), sub: 'Girokonto · monthly fees and cards', href: '/tools/compare/bank-accounts', icon: Wallet },
    ] },
    { title: t('tools.calculators'), items: [
      { title: t('tools.budget'), sub: 'Your month, line by line', href: '/tools/budget', icon: Calculator },
      { title: t('tools.netpay'), sub: 'What reaches your bank account', href: '/tools/net-pay', icon: CircleDollarSign },
      { title: t('tools.worklimit'), sub: 'Full and half days this year', href: '/tools/work-limit', icon: Clock },
    ] },
    { title: t('tools.reference'), items: [
      { title: t('tools.phrasebook'), sub: 'German for offices, doctors, landlords', href: '/tools/phrasebook', icon: Languages },
      { title: 'Safety and emergency', sub: '112, embassies, scam warnings', href: '/tools/safety', icon: ShieldAlert },
      { title: t('tools.alerts'), sub: 'Changes that affect you', href: '/alerts', icon: BookOpenText },
      ...(city && city !== 'undecided' ? [{ title: t('tools.city'), sub: 'Offices, rent, community', href: `/guides/city/${city}`, icon: MapPin }] : []),
    ] },
  ];
  return (
    <Screen title={t('tools.title')} crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('tools.title') }]}
      description="Free tools for life in Germany: compare blocked accounts and banks, budget and net-pay calculators, work-day limit tracker and a German phrasebook.">
      {groups.map((g) => (
        <View key={g.title} style={{ gap: 8 }}>
          <Overline>{g.title}</Overline>
          <Card padded={false} style={{ paddingHorizontal: 16 }}>
            {g.items.map((it, i) => <LinkRow key={it.href} first={i === 0} {...it} />)}
          </Card>
        </View>
      ))}
    </Screen>
  );
}
