import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronDown, ChevronUp, Phone, Star, Volume2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEmbassies, useL, usePhrases, useRuleChanges, useScamWarnings } from '@/content/client';
import type { Source } from '@/content/types';
import { createPersistedStore } from '@/lib/createStore';
import { usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Chip, Icon, Pill, playGerman, Screen, SectionTitle, SourcesList, Text } from '@/ui';
import { SearchField } from '../guides/GuidesScreen';

const favs = createPersistedStore<{ ids: string[] }>('phrase-favs.v1', { ids: [] });
const dedupe = (s: Source[]) => [...new Map(s.map((x) => [x.url, x])).values()];

export function PhrasebookScreen() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const lang = usePrefs((s) => s.language);
  const { data: phrases = [] } = usePhrases();
  const { ids } = favs.useStore();
  const situations = [...new Set(phrases.map((p) => p.situation.en))];
  const [sit, setSit] = useState<string>('');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [q, setQ] = useState('');
  const current = sit || situations[0] || '';
  const list = phrases.filter((p) => {
    if (q) return `${p.german} ${l(p.meaning)} ${p.meaning.en}`.toLowerCase().includes(q.toLowerCase());
    if (onlyFavs) return ids.includes(p.id);
    return p.situation.en === current;
  });
  const back = { label: t('tools.title'), href: '/tools' };
  return (
    <Screen title={t('tools.phrasebook')} large={false} back={back} crumbs={[{ label: t('tools.title'), href: '/tools' }, { label: t('tools.phrasebook') }]}
      description={t('phrases.description')}>
      <SearchField value={q} onChange={setQ} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Chip label={`★ ${t('phrases.favourites')}`} selected={!q && onlyFavs} onPress={() => { setQ(''); setOnlyFavs(true); }} />
        {situations.map((s) => {
          const label = l(phrases.find((p) => p.situation.en === s)?.situation);
          return <Chip key={s} label={label} selected={!q && !onlyFavs && current === s} onPress={() => { setQ(''); setOnlyFavs(false); setSit(s); }} />;
        })}
      </View>
      <Text variant="caption" color="muted">{t('phrases.meaningIn', { lang: t(`languages.${lang}`), count: list.length })}</Text>
      {list.length === 0 ? <Text color="muted">{onlyFavs ? t('phrases.noFavourites') : t('guides.noResults', { q })}</Text> : null}
      {list.map((p) => {
        const fav = ids.includes(p.id);
        const translit = lang === 'hi' ? p.transliteration.hi : p.transliteration.ne;
        return (
          <View key={p.id} accessibilityRole={'article' as never} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 14, gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Text lang="de" size={17} weight="600" style={{ flex: 1 }}>{p.german}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`${t('common.playPronunciation')}: ${p.german}`} onPress={() => playGerman({ term: p.german, audioUrl: p.audioUrl })} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Volume2} size={20} color="primary" /></Pressable>
              <Pressable accessibilityRole="button" accessibilityState={{ selected: fav }} accessibilityLabel={fav ? t('phrases.removeFav') : t('phrases.addFav')} onPress={() => favs.set((s) => ({ ids: fav ? s.ids.filter((x) => x !== p.id) : [...s.ids, p.id] }))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon={Star} size={20} color={fav ? 'warningBorder' : 'muted'} fill={fav ? c.warningBorder : 'none'} />
              </Pressable>
            </View>
            {translit && lang !== 'en' ? <Text color="text3" devanagari>{translit}</Text> : null}
            <Text>{l(p.meaning)}</Text>
            {lang !== 'en' ? <Text variant="caption" color="muted">{p.meaning.en}</Text> : null}
          </View>
        );
      })}
      <Text variant="caption" color="muted">{t('phrases.translitNote')}</Text>
    </Screen>
  );
}

/** Safety & emergency — no ads on this screen (HANDOFF §7.6). */
export function SafetyScreen() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const nationality = usePrefs((s) => s.profile.nationality);
  const { data: embassies = [] } = useEmbassies();
  const { data: scams = [] } = useScamWarnings();
  const [open, setOpen] = useState<string | null>(null);
  const call = (n: string) => void Linking.openURL(`tel:${n.replace(/[^\d+]/g, '')}`);
  const nums = [
    ['112', t('safety.n112'), c.danger],
    ['110', t('safety.n110'), c.danger],
    ['116117', t('safety.n116117'), c.primary],
    ['0800 111 0 111', t('safety.nSeelsorge'), c.primary],
  ] as const;
  const sorted = [...embassies].sort((a, b) => Number(b.country === nationality) - Number(a.country === nationality));
  return (
    <Screen title={t('tools.safety')} large={false} back={{ label: t('tools.title'), href: '/tools' }} crumbs={[{ label: t('tools.title'), href: '/tools' }, { label: t('tools.safety') }]}>
      {nums.map(([n, label, col]) => (
        <Pressable key={n} accessibilityRole="button" accessibilityLabel={t('safety.callA11y', { number: n, label })} onPress={() => call(n)}
          style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text size={n.length > 6 ? 18 : 26} weight="700" color={col}>{n}</Text>
          <Text style={{ flex: 1 }}>{label}</Text>
          <Icon icon={Phone} color={col} />
        </Pressable>
      ))}
      <SectionTitle>{t('safety.embassies')}</SectionTitle>
      {sorted.map((e) => (
        <Card key={e.name} style={{ gap: 6 }}>
          <Text weight="700">{e.name}</Text>
          {e.address ? <Text color="text2">{e.address}</Text> : null}
          {e.note ? <Text size={14} color="text2">{l(e.note)}</Text> : null}
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            <Pressable accessibilityRole="button" onPress={() => call(e.phone)} style={{ minHeight: 44, justifyContent: 'center' }}><Text weight="700" color="primary">☎ {e.phone}</Text></Pressable>
            {e.email ? <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(`mailto:${e.email}`)} style={{ minHeight: 44, justifyContent: 'center' }}><Text weight="600" color="primary">{e.email}</Text></Pressable> : null}
            <Pressable accessibilityRole="link" onPress={() => void WebBrowser.openBrowserAsync(e.url)} style={{ minHeight: 44, justifyContent: 'center' }}><Text weight="600" color="primary">{t('common.website')} ↗</Text></Pressable>
          </View>
        </Card>
      ))}
      <SectionTitle>{t('safety.scams')}</SectionTitle>
      {scams.map((s) => {
        const on = open === s.id;
        return (
          <View key={s.id} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card }}>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: on }} onPress={() => setOpen(on ? null : s.id)} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text weight="600" style={{ flex: 1 }}>{l(s.title)}</Text>
              <Text size={13} color="primary" weight="600">{t('safety.whatToDo')}</Text>
              <Icon icon={on ? ChevronUp : ChevronDown} size={18} color="primary" />
            </Pressable>
            {on ? (
              <View style={{ paddingHorizontal: 16, paddingBottom: 14, gap: 8 }}>
                <Text size={14} weight="700">{t('safety.warningSigns')}</Text>
                {s.signs.map((x, i) => <Text key={i} size={14} color="text2">• {l(x)}</Text>)}
                {s.actions?.length ? <Text size={14} weight="700">{t('safety.whatToDo')}</Text> : null}
                {s.actions?.map((x, i) => <Text key={i} size={14} color="text2">{i + 1}. {l(x)}</Text>)}
                <SourcesList sources={s.sources} />
              </View>
            ) : null}
          </View>
        );
      })}
      <SourcesList sources={dedupe(embassies.flatMap((e) => e.sources ?? []))} />
    </Screen>
  );
}

export function AlertsScreen() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const p = usePrefs((s) => s.profile);
  const { data = [] } = useRuleChanges();
  const [mine, setMine] = useState(true);
  const affects = (a: (typeof data)[number]['affects']) =>
    (!a.nationalities?.length || (!!p.nationality && a.nationalities.includes(p.nationality))) &&
    (!a.statuses?.length || (!!p.status && a.statuses.includes(p.status))) &&
    (!a.cities?.length || (!!p.city && a.cities.includes(p.city)));
  const list = data.filter((x) => !mine || affects(x.affects));
  const group = (x: (typeof data)[number]) => {
    const parts = [
      ...(x.affects.statuses ?? []).map((s) => t(`profile.status.${s}`)),
      ...(x.affects.nationalities ?? []).map((n) => t(`profile.nationality.${n}`)),
      ...(x.affects.cities ?? []).map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    ];
    return parts.length ? parts.join(' · ') : t('alerts.everyone');
  };
  return (
    <Screen title={t('alerts.title')} large={false} back={{ label: t('nav.home'), href: '/' }} crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('alerts.title') }]}>
      <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label={t('alerts.forMe')} selected={mine} onPress={() => setMine(true)} />
        <Chip label={t('alerts.all')} selected={!mine} onPress={() => setMine(false)} />
      </View>
      {list.length === 0 ? <Text color="muted">{t('alerts.none')}</Text> : null}
      {list.map((x) => (
        <View key={x.id} accessibilityRole={'article' as never} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 16, gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Text size={13} color="muted">{x.date}</Text>
            <Pill label={group(x)} tone={affects(x.affects) ? 'tint' : 'neutral'} />
          </View>
          {x.title ? <Text weight="700">{l(x.title)}</Text> : null}
          <Text color={x.title ? 'text2' : 'text'} weight={x.title ? '400' : '700'}>{l(x.summary)}</Text>
          {x.guideSlug ? <Text size={14} weight="600" color="primary" onPress={() => router.push(`/guides/${x.guideSlug}`)}>{t('alerts.readGuide')}</Text> : null}
          <SourcesList sources={x.sources} title={t('guides.sourceShort')} />
        </View>
      ))}
      <Text variant="caption" color="muted">
        {p.status ? t('alerts.notifyNoteProfile', { profile: [p.status && t(`profile.status.${p.status}`), p.nationality && t(`profile.nationality.${p.nationality}`), p.cityName ?? p.city].filter(Boolean).join(' · ') }) : t('alerts.notifyNote')}
      </Text>
    </Screen>
  );
}
