import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronDown, ChevronUp, Phone, Star, Volume2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { useEmbassies, useL, usePhrases, useRuleChanges, useScamWarnings } from '@/content/client';
import { createPersistedStore } from '@/lib/createStore';
import { usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Chip, Icon, Pill, playGerman, Screen, SectionTitle, Text } from '@/ui';
import { SearchField } from '../guides/GuidesScreen';

const favs = createPersistedStore<{ ids: string[] }>('phrase-favs.v1', { ids: [] });

export function PhrasebookScreen() {
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const lang = usePrefs((s) => s.language);
  const { data: phrases = [] } = usePhrases();
  const { ids } = favs.useStore();
  const situations = [...new Set(phrases.map((p) => l(p.situation)))];
  const [sit, setSit] = useState(situations[0] ?? '');
  const [q, setQ] = useState('');
  const list = phrases.filter((p) => (q ? `${p.german} ${l(p.meaning)}`.toLowerCase().includes(q.toLowerCase()) : l(p.situation) === sit));
  return (
    <Screen title="Phrasebook" large={false} back={{ label: 'Tools', href: '/tools' }} crumbs={[{ label: 'Tools', href: '/tools' }, { label: 'Phrasebook' }]}
      description="German phrases for the immigration office, citizen’s office, doctor, landlord and bank — with pronunciation and meaning in Nepali, Hindi and English.">
      <SearchField value={q} onChange={setQ} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {['Immigration office', 'Citizen’s office', 'Doctor', 'Pharmacy', 'Landlord', 'Bank', 'Workplace'].map((s) => <Chip key={s} label={s} selected={!q && sit === s} onPress={() => { setQ(''); setSit(s); }} />)}
      </View>
      <Text variant="caption" color="muted">Meaning shown in {lang === 'ne' ? 'नेपाली' : lang === 'hi' ? 'हिन्दी' : 'English'} · change in Me · {list.length} phrases</Text>
      {list.map((p) => {
        const fav = ids.includes(p.id);
        const translit = lang === 'hi' ? p.transliteration.hi : p.transliteration.ne;
        return (
          <View key={p.id} accessibilityRole={'article' as never} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 14, gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Text lang="de" size={17} weight="600" style={{ flex: 1 }}>{p.german}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`Play: ${p.german}`} onPress={() => playGerman({ term: p.german, audioUrl: p.audioUrl })} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Volume2} size={20} color="primary" /></Pressable>
              <Pressable accessibilityRole="button" accessibilityState={{ selected: fav }} accessibilityLabel={fav ? 'Remove from favourites' : 'Add to favourites'} onPress={() => favs.set((s) => ({ ids: fav ? s.ids.filter((x) => x !== p.id) : [...s.ids, p.id] }))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon={Star} size={20} color={fav ? 'warningBorder' : 'muted'} fill={fav ? c.warningBorder : 'none'} />
              </Pressable>
            </View>
            {translit ? <Text color="text3" devanagari>{translit}</Text> : null}
            <Text>{l(p.meaning)}</Text>
            {lang !== 'en' ? <Text variant="caption" color="muted">{p.meaning.en}</Text> : null}
          </View>
        );
      })}
      <Text variant="caption" color="muted">Spellings in Devanagari are a guide to sound. Tap play to hear the real German.</Text>
    </Screen>
  );
}

/** Safety & emergency — no ads on this screen (HANDOFF §7.6). */
export function SafetyScreen() {
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { data: embassies = [] } = useEmbassies();
  const { data: scams = [] } = useScamWarnings();
  const [open, setOpen] = useState<string | null>(null);
  const call = (n: string) => void Linking.openURL(`tel:${n}`);
  const nums = [['112', 'Ambulance and fire · tap to call', c.danger], ['110', 'Police', c.danger], ['116117', 'Doctor on call · not life-threatening', c.primary]] as const;
  return (
    <Screen title="Safety and emergency" large={false} back={{ label: 'Tools', href: '/tools' }} crumbs={[{ label: 'Tools', href: '/tools' }, { label: 'Safety' }]}>
      {nums.map(([n, label, col]) => (
        <Pressable key={n} accessibilityRole="button" accessibilityLabel={`Call ${n}: ${label}`} onPress={() => call(n)}
          style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, paddingHorizontal: 16 }}>
          <Text size={26} weight="700" color={col}>{n}</Text>
          <Text style={{ flex: 1 }}>{label}</Text>
          <Icon icon={Phone} color={col} />
        </Pressable>
      ))}
      <SectionTitle>Embassies and consulates</SectionTitle>
      <Card padded={false} style={{ paddingHorizontal: 16 }}>
        {embassies.map((e, i) => (
          <Pressable key={e.name} accessibilityRole="link" onPress={() => void WebBrowser.openBrowserAsync(e.url)} style={{ minHeight: 60, justifyContent: 'center', borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
            <Text weight="600">{e.name}</Text><Text variant="caption" color="muted">{e.phone} · [Opening hours]</Text>
          </Pressable>
        ))}
      </Card>
      <SectionTitle>Scam warnings</SectionTitle>
      {scams.map((s) => {
        const on = open === s.id;
        return (
          <View key={s.id} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card }}>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: on }} onPress={() => setOpen(on ? null : s.id)} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
              <Text weight="600" style={{ flex: 1 }}>{l(s.title)}</Text>
              <Text size={13} color="primary" weight="600">What to do</Text>
              <Icon icon={on ? ChevronUp : ChevronDown} size={18} color="primary" />
            </Pressable>
            {on ? <View style={{ paddingHorizontal: 16, paddingBottom: 14, gap: 6 }}>{s.signs.map((x, i) => <Text key={i} color="text2">{l(x)}</Text>)}</View> : null}
          </View>
        );
      })}
    </Screen>
  );
}

export function AlertsScreen() {
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
  const group = (x: (typeof data)[number]) => x.affects.cities?.length ? x.affects.cities.join(', ') : x.affects.nationalities?.length ? `Students from ${x.affects.nationalities.join(', ')}` : 'All students';
  return (
    <Screen title="Rule changes" large={false} back={{ label: 'Home', href: '/' }} crumbs={[{ label: 'Home', href: '/' }, { label: 'Rule changes' }]}>
      <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="For me" selected={mine} onPress={() => setMine(true)} />
        <Chip label="All alerts" selected={!mine} onPress={() => setMine(false)} />
      </View>
      {list.map((x, i) => (
        <View key={x.id} accessibilityRole={'article' as never} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 16, gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Text size={13} color="muted">{x.date}{i === 0 ? ' · new' : ''}</Text>
            <Pill label={group(x)} tone={affects(x.affects) ? 'tint' : 'neutral'} />
          </View>
          <Text weight="700">{l(x.summary)}</Text>
          {x.guideSlug ? <Text size={14} weight="600" color="primary" onPress={() => router.push(`/guides/${x.guideSlug}`)}>Read the updated guide →</Text> : null}
        </View>
      ))}
      <Text variant="caption" color="muted">We send a notification only when a change affects your profile{p.status ? `: ${[p.status, p.nationality, p.city].filter(Boolean).join(' · ')}` : ''}.</Text>
    </Screen>
  );
}
