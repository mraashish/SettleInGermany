import { Minus, Plus, Trash2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCities, useRules } from '@/content/client';
import { createPersistedStore } from '@/lib/createStore';
import { formatDate } from '@/lib/deadline';
import { usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { AdSlot, Button, Card, Chip, Icon, ProgressBar, Screen, SectionTitle, Text, TextField } from '@/ui';

const back = { label: 'Tools', href: '/tools' };
const crumbs = (title: string) => [{ label: 'Tools', href: '/tools' }, { label: 'Calculators' }, { label: title }];
const eur = (n: number) => `€${n.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`;

function Stepper({ label, value, onChange, step = 10 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  const { c } = useTheme();
  const btn = (icon: typeof Plus, d: number, a11y: string) => (
    <Pressable accessibilityRole="button" accessibilityLabel={`${a11y} ${label}`} onPress={() => onChange(Math.max(0, value + d))}
      style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Icon icon={icon} size={18} color="primary" />
    </Pressable>
  );
  return (
    <View accessibilityRole="adjustable" accessibilityLabel={`${label}, ${value} euros per month`} accessibilityValue={{ text: eur(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => onChange(Math.max(0, value + (e.nativeEvent.actionName === 'increment' ? step : -step)))}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, borderTopWidth: 1, borderColor: c.divider }}>
      <Text style={{ flex: 1 }}>{label}</Text>
      {btn(Minus, -step, 'Less')}
      <Text weight="700" style={{ minWidth: 64, textAlign: 'center' }}>{eur(value)}</Text>
      {btn(Plus, step, 'More')}
    </View>
  );
}

/** Starting values are placeholders until the CMS provides typical costs per city. */
const DEFAULT_BUDGET = { Rent: 0, 'Health insurance': 0, Food: 0, Phone: 0, Transit: 0, 'Broadcasting fee': 0, Other: 0 };

export function BudgetScreen() {
  const th = useTheme();
  const { c } = th;
  const profile = usePrefs((s) => s.profile);
  const { data: cities = [] } = useCities();
  const { data: rules } = useRules();
  const city = cities.find((x) => x.slug === profile.city)?.name ?? '[city]';
  const [items, setItems] = useState<Record<string, number>>(DEFAULT_BUDGET);
  const total = Object.values(items).reduce((a, b) => a + b, 0);
  return (
    <Screen title="Budget planner" large={false} back={back} crumbs={crumbs('Budget planner')}>
      <View style={{ flexDirection: 'row', gap: 8 }}><Chip label={`City: ${city}`} selected /><Chip label="Living: shared flat" /></View>
      <Card padded={false} style={{ paddingHorizontal: 16 }}>
        {Object.entries(items).map(([k, v]) => <Stepper key={k} label={k} value={v} onChange={(n) => setItems((x) => ({ ...x, [k]: n }))} />)}
      </Card>
      <View style={{ backgroundColor: c.heroBg, borderRadius: th.shape.card, padding: 16, gap: 4 }} accessibilityLiveRegion="polite">
        <Text color={c.heroSub}>Your month in {city}</Text>
        <Text size={32} lineHeight={38} weight="700" color={c.heroText}>{eur(total)}</Text>
        <Text size={14} color={c.heroSub}>Compare: your blocked account pays out {rules?.blockedAccountMonthly ? eur(rules.blockedAccountMonthly) : '[€ monthly amount]'}.</Text>
      </View>
      <Text variant="caption" color="muted">Starting values are typical for {city} · checked {rules?.lastVerified ?? '[date]'}. Change them to match your life.</Text>
      <AdSlot format="banner" placement="budget-results" />
    </Screen>
  );
}

export function NetPayScreen() {
  const { c } = useTheme();
  const { data: rules } = useRules();
  const [wage, setWage] = useState('14.00');
  const [hours, setHours] = useState('10');
  const [kind, setKind] = useState<'mini' | 'student' | 'unsure'>('mini');
  const gross = (parseFloat(wage.replace(',', '.')) || 0) * (parseFloat(hours) || 0) * 4.33;
  // TODO(product owner): deduction rates come from the CMS Rules; without them we only show gross.
  const known = !!rules?.miniJobLimitMonthly;
  return (
    <Screen title="Net pay" large={false} back={back} crumbs={crumbs('Net pay')}>
      <Text color="text2">See what reaches your bank account from a student job.</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><TextField label="Hourly wage (€)" value={wage} onChangeText={setWage} keyboardType="decimal-pad" /></View>
        <View style={{ flex: 1 }}><TextField label="Hours a week" value={hours} onChangeText={setHours} keyboardType="number-pad" /></View>
      </View>
      <View accessibilityRole="radiogroup" accessibilityLabel="Type of job" style={{ gap: 8 }}>
        <Text size={14} weight="600">Type of job</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Chip label="Mini job" selected={kind === 'mini'} onPress={() => setKind('mini')} />
          <Chip label="Working student" selected={kind === 'student'} onPress={() => setKind('student')} />
          <Chip label="Not sure" selected={kind === 'unsure'} onPress={() => setKind('unsure')} />
        </View>
      </View>
      <Card style={{ gap: 8 }}>
        <Text color="muted">You keep about</Text>
        <Text size={28} weight="700">{known ? eur(gross) : '€[net]'} / month</Text>
        {[['Gross pay', eur(gross)], ['Tax', '€[—]'], ['Pension contribution', '€[—]']].map(([k, v]) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: c.divider, paddingTop: 8 }}><Text color="text3">{k}</Text><Text weight="600">{v}</Text></View>
        ))}
      </Card>
      <Text size={14} color="text2">In plain words: [One or two sentences on why these deductions apply, from the content system.]</Text>
      <Text variant="caption" color="muted">Estimate only, not tax advice. Limits and rates checked {rules?.lastVerified ?? '[date]'}.</Text>
      <AdSlot format="banner" placement="netpay-results" />
    </Screen>
  );
}

type WorkDay = { id: string; date: string; place: string; hours: number };
const workStore = createPersistedStore<{ days: WorkDay[] }>('workdays.v1', { days: [] });

/** Two half days (≤ 4 h) count as one full day. */
const weight = (h: number) => (h > 4 ? 1 : h > 0 ? 0.5 : 0);

export function WorkLimitScreen() {
  const { i18n } = useTranslation();
  const { c } = useTheme();
  const { data: rules } = useRules();
  const { days } = workStore.useStore();
  const [place, setPlace] = useState('');
  const [hours, setHours] = useState('');
  const year = new Date().getFullYear();
  const used = useMemo(() => days.filter((d) => d.date.startsWith(String(year))).reduce((a, d) => a + weight(d.hours), 0), [days, year]);
  const limit = rules?.studentWorkFullDays ?? 0;
  const log = () => {
    const h = parseFloat(hours);
    if (!h) return;
    workStore.set((s) => ({ days: [{ id: `w${Date.now()}`, date: new Date().toISOString().slice(0, 10), place: place || 'Work', hours: h }, ...s.days] }));
    setHours(''); setPlace('');
  };
  return (
    <Screen title="Work-day limit" large={false} back={back} crumbs={crumbs('Work-day limit')}>
      <Card style={{ gap: 10 }}>
        <Text color="muted">This year you’ve used · 1 Jan – 31 Dec {year}</Text>
        <Text size={24} weight="700">{used} of {limit || '[limit]'} full days</Text>
        <ProgressBar value={used} max={limit || 1} label={limit && used / limit >= 0.8 ? `Close to your limit. ${limit - used} full days left this year.` : 'Two half days count as one full day.'} />
        <Text variant="caption" color="muted">Limit for your permit, from our rules · checked {rules?.lastVerified ?? '[date]'}</Text>
      </Card>
      <SectionTitle>Log a work day</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}><TextField label="Where" value={place} onChangeText={setPlace} placeholder="Café" /></View>
        <View style={{ flex: 1 }}><TextField label="Hours" value={hours} onChangeText={setHours} keyboardType="decimal-pad" /></View>
      </View>
      <Button label="Log a work day" onPress={log} />
      {days.length ? (
        <>
          <SectionTitle>Recent days</SectionTitle>
          <Card padded={false} style={{ paddingHorizontal: 16 }}>
            {days.slice(0, 10).map((d, i) => (
              <View key={d.id} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
                <View style={{ flex: 1 }}><Text weight="600">{formatDate(d.date, i18n.language, { weekday: 'short', day: 'numeric', month: 'short' })}</Text><Text variant="caption" color="muted">{d.place} · {d.hours} hours</Text></View>
                <Text size={13} weight="600" color={weight(d.hours) === 1 ? 'text' : 'muted'}>{weight(d.hours) === 1 ? 'Full day' : 'Half day'}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Delete day" onPress={() => workStore.set((s) => ({ days: s.days.filter((x) => x.id !== d.id) }))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Trash2} size={18} color="muted" /></Pressable>
              </View>
            ))}
          </Card>
        </>
      ) : null}
      <Text size={14} color="text2">[Short rule on which university jobs don’t count, from the content system.]</Text>
      <AdSlot format="banner" placement="worklimit-results" />
    </Screen>
  );
}
