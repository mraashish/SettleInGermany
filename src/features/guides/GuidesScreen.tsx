import { Link, useLocalSearchParams } from 'expo-router';
import { Bookmark, ChevronRight, MapPin, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCities, useGuides, useL } from '@/content/client';
import type { Guide } from '@/content/types';
import { STAGES, type StageId, usePrefs } from '@/store/prefs';
import { useRoadmap } from '@/store/roadmap';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { AdSlot, Chip, EmptyState, ErrorState, GuideCard, Icon, Overline, Screen, Skeleton, Text } from '@/ui';
import { matchGuide } from './search';

type Filter = 'all' | StageId | 'saved';

export function SearchField({ value, onChange, autoFocus }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: th.platform === 'android' ? 56 : 44, borderRadius: th.platform === 'android' ? 28 : 12, backgroundColor: th.platform === 'android' ? c.divider : c.surface, borderWidth: th.platform === 'android' ? 0 : 1, borderColor: c.border, paddingHorizontal: 14 }}>
      <Icon icon={Search} size={20} color="muted" />
      <TextInput
        value={value} onChangeText={onChange} autoFocus={autoFocus} placeholder={t('guides.searchPlaceholder')} placeholderTextColor={c.muted}
        accessibilityLabel={t('home.searchLabel')} accessibilityRole="search" returnKeyType="search" autoCorrect={false}
        style={{ flex: 1, minHeight: 44, fontFamily: fonts.regular, fontSize: 16, color: c.text }}
      />
    </View>
  );
}

/** Native ad every 8 items (HANDOFF §7.6). */
function GuideList({ guides }: { guides: Guide[] }) {
  const th = useTheme();
  const chunks: Guide[][] = [];
  for (let i = 0; i < guides.length; i += 8) chunks.push(guides.slice(i, i + 8));
  return (
    <>
      {chunks.map((chunk, ci) => (
        <React.Fragment key={ci}>
          <View style={{ backgroundColor: th.c.surface, borderWidth: 1, borderColor: th.c.border, borderRadius: th.shape.card, paddingHorizontal: 16 }}>
            {chunk.map((g, i) => <GuideCard key={g.slug} guide={g} first={i === 0} />)}
          </View>
          {chunk.length === 8 ? <AdSlot format="native" placement="guides-list" /> : null}
        </React.Fragment>
      ))}
    </>
  );
}

export function GuidesScreen() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const params = useLocalSearchParams<{ filter?: string }>();
  const profile = usePrefs((s) => s.profile);
  const saved = useRoadmap((s) => s.savedGuides);
  const { data: guides, isLoading, isError, refetch, isRefetching } = useGuides();
  const { data: cities = [] } = useCities();
  const city = cities.find((x) => x.slug === profile.city);
  const [filter, setFilter] = useState<Filter>((params.filter as Filter) ?? profile.stage);
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    let out = guides ?? [];
    if (q.trim()) return out.filter((g) => matchGuide(g, q, l));
    if (filter === 'saved') out = out.filter((g) => saved.includes(g.slug));
    else if (filter !== 'all') out = out.filter((g) => g.stage === filter);
    return out;
  }, [guides, q, filter, saved, l]);

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('guides.all') },
    ...STAGES.map((s) => ({ id: s as Filter, label: s === 'living' ? t('stages.shortLiving') : s === 'career' ? t('stages.shortCareer') : t(`stages.${s}`) })),
    { id: 'saved', label: t('guides.saved') },
  ];

  return (
    <Screen title={t('guides.title')} crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('guides.title') }]}
      description="Step-by-step guides for living in Germany: registration, residence permit, bank account, tax ID and more — in English, Nepali and Hindi."
      onRefresh={() => void refetch()} refreshing={isRefetching} plainMain>
      <SearchField value={q} onChange={setQ} />
      <View accessibilityRole="tablist" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {filters.map((f) => <Chip key={f.id} label={f.label} selected={!q && filter === f.id} onPress={() => { setQ(''); setFilter(f.id); }} />)}
      </View>

      {city ? (
        <Link href={`/guides/city/${city.slug}`} asChild>
          <Pressable accessibilityRole="link" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.primaryTint, borderRadius: th.shape.card, padding: 14 }}>
            <Icon icon={MapPin} color="primary" />
            <View style={{ flex: 1 }}>
              <Text weight="700">{t('guides.yourCity', { city: city.name })}</Text>
              <Text variant="caption" color="text3">{t('guides.cityBlurb')}</Text>
            </View>
            <Icon icon={ChevronRight} color="primary" />
          </Pressable>
        </Link>
      ) : null}

      {isLoading ? <Skeleton lines={6} /> : isError && !guides ? <ErrorState onRetry={() => void refetch()} /> : (
        <>
          {!q ? <Overline>{t('guides.count', { count: list.length, stage: filters.find((f) => f.id === filter)?.label ?? '' })}</Overline> : null}
          {list.length === 0 ? (
            filter === 'saved' && !q
              ? <EmptyState icon={Bookmark} title={t('guides.noSaved')} body={t('guides.noSavedBody')} actionLabel={t('guides.all')} onAction={() => setFilter('all')} />
              : <EmptyState icon={Search} title={t('guides.noResults', { q })} body="Try a German word like “Anmeldung”, or browse all guides." actionLabel={t('guides.all')} onAction={() => { setQ(''); setFilter('all'); }} />
          ) : <GuideList guides={list} />}
        </>
      )}
    </Screen>
  );
}
