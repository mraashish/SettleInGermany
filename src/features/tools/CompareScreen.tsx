import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useProviders } from '@/content/client';
import type { ProviderCategory } from '@/content/types';
import { useLayout } from '@/lib/useLayout';
import { useTheme } from '@/theme/ThemeProvider';
import { AdSlot, Chip, DETag, ProviderCard, ProviderTable, Screen, Skeleton, Text } from '@/ui';

type Sort = 'fees' | 'speed';

const TOPICS: Record<string, { cat: ProviderCategory; title: string; de: string; guide: { label: string; href: string }; matters: [string, string][]; filters: string[] }> = {
  'blocked-accounts': {
    cat: 'blocked', title: 'Blocked accounts', de: 'Sperrkonto',
    guide: { label: 'Read the guide: open a blocked account step by step', href: '/guides/open-a-blocked-account' },
    matters: [
      ['The amount is fixed by law.', 'You deposit [€ yearly amount] and get [€ monthly amount] paid out each month. It is the same at every provider.'],
      ['Fees are the real difference.', 'Add the setup fee and 12 monthly fees to see the true cost of year one.'],
      ['Speed matters for your visa.', 'You need the confirmation before your embassy appointment in Kathmandu or New Delhi.'],
    ],
    filters: ['Accepted for Nepal', 'Accepted for India', 'Without insurance bundle'],
  },
  'bank-accounts': {
    cat: 'bank', title: 'Bank accounts', de: 'Girokonto',
    guide: { label: 'Read the guide: open a bank account', href: '/guides/open-a-bank-account' },
    matters: [
      ['Can you open it yet?', 'Some banks need your address registration first. Others open with just your passport.'],
      ['Check the monthly fee and its conditions.', '“Free” often means free only if a set amount comes in each month.'],
      ['You may need a girocard.', 'Some shops, offices and landlords still don’t take Visa or Mastercard debit cards.'],
    ],
    filters: ['Open without address registration', 'App in English', 'Has branches'],
  },
};

/**
 * Comparisons: referral links are labelled, sorting includes a non-commission option
 * (default: lowest fees), non-partners are listed too (HANDOFF §7.7).
 */
export function CompareScreen({ topic }: { topic: string }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const { desktop } = useLayout();
  const cfg = TOPICS[topic] ?? TOPICS['blocked-accounts'];
  const { data = [], isLoading } = useProviders();
  const [sort, setSort] = useState<Sort>('fees');
  const [filters, setFilters] = useState<string[]>([cfg.filters[0]]);
  const list = useMemo(() => data.filter((p) => p.category === cfg.cat).sort((a, b) => (sort === 'fees' ? a.feeSortKey - b.feeSortKey : a.speedSortKey - b.speedSortKey)), [data, cfg.cat, sort]);
  const sortLabel = sort === 'fees' ? t('tools.sortFees') : t('tools.sortSpeed');
  const checked = list[0]?.lastChecked ?? '[date]';

  return (
    <Screen title={cfg.title} large={false} back={{ label: t('tools.title'), href: '/tools' }}
      crumbs={[{ label: t('tools.title'), href: '/tools' }, { label: t('tools.compare') }, { label: cfg.title }]}
      hideWebTitle
      description={`Compare ${cfg.title.toLowerCase()} in Germany (${cfg.de}) by fees and opening time. Ranked by cost, never by commission.`}>
      <View style={{ gap: 6 }}>
        <Text size={24} lineHeight={30} weight="700" heading={1}>{cfg.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><DETag /><Text lang="de" weight="500">{cfg.de}</Text><Text color="muted">· Checked {checked}</Text></View>
      </View>
      <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 16, gap: 12 }}>
        <Text size={13} weight="700" color="primary" uppercase heading>What matters</Text>
        {cfg.matters.map(([h, b], i) => (
          <View key={h} style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}><Text size={13} weight="700" color="primary">{i + 1}</Text></View>
            <Text style={{ flex: 1 }} size={14}><Text size={14} weight="700">{h}</Text> {b}</Text>
          </View>
        ))}
        <Link href={cfg.guide.href as never}><Text size={14} weight="600" color="primary">{cfg.guide.label}</Text></Link>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <Text weight="600">{list.length} providers</Text>
        <View accessibilityRole="radiogroup" accessibilityLabel={t('tools.sortBy')} style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Text size={14} color="muted">{t('tools.sortBy')}:</Text>
          <Chip label={t('tools.sortFees')} selected={sort === 'fees'} onPress={() => setSort('fees')} />
          <Chip label={t('tools.sortSpeed')} selected={sort === 'speed'} onPress={() => setSort('speed')} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {cfg.filters.map((f) => <Chip key={f} label={f} selected={filters.includes(f)} onPress={() => setFilters((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]))} />)}
      </View>

      {isLoading ? <Skeleton /> : desktop ? <ProviderTable providers={list} /> : list.map((p, i) => (
        <ProviderCard key={p.id} provider={p} highlighted={i === 0} badge={i === 0 ? sortLabel : undefined} />
      ))}

      <Text variant="caption" color="muted">Ranking is by {sortLabel.toLowerCase()}, never by commission. Fees change — confirm on the provider’s site before you sign up.</Text>
      {/* Tools results: banner below results — never between input and result */}
      <AdSlot format="banner" placement="compare-results" />
      <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/how-we-make-money"><Text size={14} weight="600" color="primary">{t('common.howWeMakeMoney')}</Text></Link>
        <Link href={'mailto:content@settleingermany.app?subject=Wrong%20information' as never}><Text size={14} weight="600" color="primary">Report wrong information</Text></Link>
      </View>
    </Screen>
  );
}

export const COMPARE_TOPICS = Object.keys(TOPICS);
