import { BookOpenText, Calculator, CircleDollarSign, Clock, Landmark, Languages, MapPin, ShieldAlert, Wallet } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useMyCity } from '@/content/city';
import { Card, LinkRow, Overline, Screen } from '@/ui';

export function ToolsHub() {
  const { t } = useTranslation();
  const city = useMyCity();
  const groups = [
    { title: t('tools.compare'), items: [
      { title: t('tools.blocked'), sub: t('tools.blockedSub'), href: '/tools/compare/blocked-accounts', icon: Landmark },
      { title: t('tools.bank'), sub: t('tools.bankSub'), href: '/tools/compare/bank-accounts', icon: Wallet },
    ] },
    { title: t('tools.calculators'), items: [
      { title: t('tools.budget'), sub: t('tools.budgetSub'), href: '/tools/budget', icon: Calculator },
      { title: t('tools.netpay'), sub: t('tools.netpaySub'), href: '/tools/net-pay', icon: CircleDollarSign },
      { title: t('tools.worklimit'), sub: t('tools.worklimitSub'), href: '/tools/work-limit', icon: Clock },
    ] },
    { title: t('tools.reference'), items: [
      { title: t('tools.phrasebook'), sub: t('tools.phrasebookSub'), href: '/tools/phrasebook', icon: Languages },
      { title: t('tools.safety'), sub: t('tools.safetySub'), href: '/tools/safety', icon: ShieldAlert },
      { title: t('tools.alerts'), sub: t('tools.alertsSub'), href: '/alerts', icon: BookOpenText },
      ...(city.page ? [{ title: t('guides.yourCity', { city: city.name }), sub: t('guides.cityBlurb'), href: `/guides/city/${city.slug}`, icon: MapPin }] : []),
    ] },
  ];
  return (
    <Screen title={t('tools.title')} crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('tools.title') }]}
      description={t('tools.description')}>
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
