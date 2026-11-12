import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useProviders, useRules } from '@/content/client';
import type { ProviderCategory, Source } from '@/content/types';
import { formatDate } from '@/lib/deadline';
import { createPersistedStore } from '@/lib/createStore';
import { digits, formatMoney, toAsciiDigits } from '@/lib/format';
import i18n from '@/i18n';
import { useLayout } from '@/lib/useLayout';
import { useTheme } from '@/theme/ThemeProvider';
import { AdSlot, DETag, ProviderCard, ProviderTable, Screen, Skeleton, SourcesList, Text, TextField } from '@/ui';
import { type ForYou, providerForAge, yearlyCostForAge } from './providerForYou';

const TOPICS: Record<string, { cat: ProviderCategory; key: 'blocked' | 'bank'; de: string; guide: string }> = {
  'blocked-accounts': { cat: 'blocked', key: 'blocked', de: 'Sperrkonto', guide: '/guides/open-a-blocked-account' },
  'bank-accounts': { cat: 'bank', key: 'bank', de: 'Girokonto', guide: '/guides/open-a-bank-account' },
};

const eur = (n: number, d = 0) => formatMoney(n, i18n.language, d);

/** The age typed on the bank comparison, remembered on this device. */
const compareStore = createPersistedStore<{ age: number | null }>('compare.v1', { age: null });

/**
 * Comparisons: referral links are labelled, the ranking is never by commission
 * (default: lowest fees), non-partners are listed too (HANDOFF §7.7).
 */
export function CompareScreen({ topic }: { topic: string }) {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const { desktop } = useLayout();
  const cfg = TOPICS[topic] ?? TOPICS['blocked-accounts'];
  const { data = [], isLoading } = useProviders();
  const { data: rules } = useRules();
  const { age } = compareStore.useStore();
  const isBank = cfg.cat === 'bank';
  const forAge = isBank && age != null;
  const list = useMemo(() => data
    .filter((p) => p.category === cfg.cat && !/\[.+\]/.test(p.name))
    .sort((a, b) => (forAge ? yearlyCostForAge(a, age) - yearlyCostForAge(b, age) : 0) || a.feeSortKey - b.feeSortKey), [data, cfg.cat, forAge, age]);
  // "Lowest fees" only when one provider really is cheaper than the next.
  const cost = (p: (typeof list)[number]) => (forAge ? yearlyCostForAge(p, age) : p.yearOneCost ?? p.feeSortKey);
  const uniqueCheapest = list.length > 1 && cost(list[0]) < cost(list[1]) && !(isBank && !forAge);
  const forYouLabel = (f: ForYou) =>
    f.kind === 'free' ? { tone: 'success' as const, label: t('compare.freeForYou') }
    : f.kind === 'paid' ? { tone: 'warning' as const, label: t('compare.paidForYou', { amount: eur(f.monthly, 2) }) }
    : f.kind === 'check' ? { tone: 'neutral' as const, label: t('compare.checkBranch', { age: f.age }) }
    : undefined;
  const title = t(`tools.${cfg.key}`);
  const checked = list.map((p) => p.lastChecked).sort().pop();
  const monthly = rules?.blockedAccountMonthly ?? 0;
  const matters = [1, 2, 3].map((n) => ({
    head: t(`compare.${cfg.key}.m${n}h`),
    body: t(`compare.${cfg.key}.m${n}b`, { monthly: eur(monthly), yearly: eur(monthly * 12) }),
  }));
  const sources: Source[] = [...new Map(list.flatMap((p) => p.sources ?? []).concat(cfg.key === 'blocked' ? rules?.sources?.filter((s) => /diplo|sperrkonto|blocked/i.test(s.url + s.title)) ?? [] : []).map((s) => [s.url, s])).values()];

  return (
    <Screen title={title} large={false} back={{ label: t('tools.title'), href: '/tools' }}
      crumbs={[{ label: t('tools.title'), href: '/tools' }, { label: t('tools.compare') }, { label: title }]}
      hideWebTitle
      description={t(`compare.${cfg.key}.description`)}>
      <View style={{ gap: 6 }}>
        <Text size={24} lineHeight={30} weight="700" heading={1}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <DETag /><Text lang="de" weight="500">{cfg.de}</Text>
          {checked ? <Text color="muted">· {t('tools.lastChecked', { date: formatDate(checked, i18n.language) })}</Text> : null}
        </View>
      </View>
      <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 16, gap: 12 }}>
        <Text size={13} weight="700" color="primary" uppercase heading>{t('compare.whatMatters')}</Text>
        {matters.map((m, i) => (
          <View key={m.head} style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}><Text size={13} weight="700" color="primary">{digits(i + 1, i18n.language)}</Text></View>
            <Text style={{ flex: 1 }} size={14}><Text size={14} weight="700">{m.head}</Text> {m.body}</Text>
          </View>
        ))}
        <Link href={cfg.guide as never}><Text size={14} weight="600" color="primary">{t(`compare.${cfg.key}.guideLink`)}</Text></Link>
      </View>

      {isBank ? (
        <View style={{ gap: 6 }}>
          <View style={{ maxWidth: 200 }}>
            <TextField label={t('compare.ageLabel')} value={age == null ? '' : String(age)} keyboardType="number-pad" inputMode="numeric"
              onChangeText={(v) => { const n = parseInt(toAsciiDigits(v), 10); compareStore.set({ age: Number.isFinite(n) && n > 0 && n < 100 ? n : null }); }} />
          </View>
          <Text size={14} color="text2">{forAge ? t('compare.ageSet') : t('compare.agePrompt')}</Text>
        </View>
      ) : null}

      <Text weight="600">{t('compare.count', { count: list.length })} · {forAge ? t('compare.sortedForYou') : t('compare.sortedBy')}</Text>

      {isLoading ? <Skeleton /> : desktop ? <ProviderTable providers={list} /> : list.map((p, i) => (
        <ProviderCard key={p.id} provider={p} highlighted={i === 0 && uniqueCheapest} badge={i === 0 && uniqueCheapest ? t('tools.sortFees') : undefined}
          forYou={forAge ? forYouLabel(providerForAge(p, age)) : undefined} />
      ))}

      <Text variant="caption" color="muted">{t('compare.rankingNote')}</Text>
      {/* Tools results: banner below results — never between input and result */}
      <AdSlot format="banner" placement="compare-results" />
      <SourcesList sources={sources} />
      <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/how-we-make-money"><Text size={14} weight="600" color="primary">{t('common.howWeMakeMoney')}</Text></Link>
        <Link href={'mailto:content@settleingermany.app?subject=Wrong%20information' as never}><Text size={14} weight="600" color="primary">{t('compare.reportWrong')}</Text></Link>
      </View>
    </Screen>
  );
}

export const COMPARE_TOPICS = Object.keys(TOPICS);
