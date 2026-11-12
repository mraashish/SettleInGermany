import { Minus, Plus, RotateCcw, Search, Trash2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useMyCity } from '@/content/city';
import { useCities, useL, useRules } from '@/content/client';
import { searchCities } from '@/content/germanCities';
import type { Localized } from '@/content/types';
import { createPersistedStore } from '@/lib/createStore';
import { formatDate } from '@/lib/deadline';
import { formatMoney, toAsciiDigits } from '@/lib/format';
import { wageTaxClass1 } from '@/lib/incomeTax';
import { parseDate } from '../reminders/dates';
import i18n from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { AdSlot, Button, Card, Chip, Icon, ProgressBar, Screen, SectionTitle, SourcesList, Text, TextField, ToggleRow } from '@/ui';

/** Euro amounts in the reader's language (€1,172.68 · €१,१७२.६८). */
const eur = (n: number, digits = 0) => formatMoney(n, i18n.language, digits);
const num = (s: string) => {
  const n = parseFloat(toAsciiDigits(s).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

function useBack() {
  const { t } = useTranslation();
  return {
    back: { label: t('tools.title'), href: '/tools' },
    crumbs: (title: string) => [{ label: t('tools.title'), href: '/tools' }, { label: t('tools.calculators') }, { label: title }],
  };
}

/** A euro amount you can type directly, or nudge with − / +. */
function MoneyRow({ label, value, onChange, step = 10 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const [text, setText] = useState<string | null>(null);
  const btn = (icon: typeof Plus, d: number, a11y: string) => (
    <Pressable accessibilityRole="button" accessibilityLabel={`${a11y}: ${label}`} onPress={() => { setText(null); onChange(Math.max(0, Math.round((value + d) * 100) / 100)); }}
      style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Icon icon={icon} size={18} color="primary" />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 60, borderTopWidth: 1, borderColor: c.divider, paddingVertical: 6 }}>
      <Text style={{ flex: 1 }}>{label}</Text>
      {btn(Minus, -step, t('tools.less'))}
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: c.fieldBorder, borderRadius: th.shape.field, backgroundColor: c.surface, paddingHorizontal: 8, minHeight: 44, width: 96 }}>
        <Text color="muted">€</Text>
        <TextInput
          accessibilityLabel={t('tools.amountFor', { label })}
          value={text ?? String(value)}
          onChangeText={(s) => { setText(s); onChange(Math.max(0, num(s))); }}
          onBlur={() => setText(null)}
          keyboardType="decimal-pad"
          inputMode="decimal"
          selectTextOnFocus
          maxFontSizeMultiplier={1.6}
          style={{ flex: 1, minWidth: 0, fontFamily: fonts.bold, fontSize: 16, color: c.text, textAlign: 'right', paddingVertical: 8 }}
        />
      </View>
      {btn(Plus, step, t('tools.more'))}
    </View>
  );
}

type BudgetItem = { id: string; label: Localized; value: number; custom?: boolean };
/** The user's own numbers, per city (slug → items). Typical values stay in the content database. */
const budgetStore = createPersistedStore<{ city: string | null; byCity: Record<string, BudgetItem[]> }>('budget.v3', { city: null, byCity: {} });

/** Small city picker: type to search all cities that have a city page. */
function CityPicker({ value, onChange }: { value: string | null; onChange: (slug: string) => void }) {
  const { t } = useTranslation();
  const { data: cities = [] } = useCities();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const current = cities.find((x) => x.slug === value);
  const withBudget = cities.filter((x) => x.budget?.length);
  const names = searchCities(withBudget.map((x) => x.name), q).slice(0, 8);
  const matches = names.map((n) => withBudget.find((x) => x.name === n)!).filter(Boolean);
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip label={t('tools.cityChip', { city: current?.name ?? '—' })} selected />
        <Button variant="text" fullWidth={false} icon={Search} label={t('tools.changeCity')} onPress={() => setOpen((o) => !o)} />
      </View>
      {open ? (
        <Card style={{ gap: 4 }}>
          <TextField label={t('tools.searchCity')} value={q} onChangeText={setQ} autoFocus placeholder="Berlin" />
          {q.trim() && !matches.length ? <Text size={14} color="text2">{t('tools.noCityFound', { city: q.trim() })}</Text> : null}
          {matches.map((x) => (
            <Pressable key={x.slug} accessibilityRole="button" onPress={() => { onChange(x.slug); setOpen(false); setQ(''); }} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text weight={x.slug === value ? '700' : '400'}>{x.name}</Text>
            </Pressable>
          ))}
        </Card>
      ) : null}
    </View>
  );
}

export function BudgetScreen() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { back, crumbs } = useBack();
  const my = useMyCity();
  const { data: cities = [] } = useCities();
  const saved = budgetStore.useStore();
  const slug = saved.city ?? my.slug ?? 'leipzig';
  const page = cities.find((x) => x.slug === slug && x.budget?.length);
  const defaults: BudgetItem[] = (page?.budget ?? []).map((b, i) => ({ id: `d${i}`, label: b.label, value: b.value }));
  const items = saved.byCity[slug] ?? defaults;
  const save = (next: BudgetItem[]) => budgetStore.set((st) => ({ city: slug, byCity: { ...st.byCity, [slug]: next } }));
  const set = (id: string, value: number) => save(items.map((x) => (x.id === id ? { ...x, value } : x)));
  const remove = (id: string) => save(items.filter((x) => x.id !== id));
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const add = () => {
    if (!newLabel.trim()) return;
    save([...items, { id: `c${Date.now()}`, label: { en: newLabel.trim() }, value: num(newValue), custom: true }]);
    setNewLabel(''); setNewValue('');
  };
  const total = items.reduce((a, b) => a + b.value, 0);
  const { data: rules } = useRules();
  const name = page?.name ?? my.name;
  return (
    <Screen title={t('tools.budget')} large={false} back={back} crumbs={crumbs(t('tools.budget'))}>
      <Text color="text2">{t('tools.budgetIntro')}</Text>
      <CityPicker value={slug} onChange={(s) => budgetStore.set({ city: s })} />
      {items.length === 0 ? (
        <Card><Text color="text2">{t('tools.budgetNoCity')}</Text></Card>
      ) : (
        <Card padded={false} style={{ paddingHorizontal: 16 }}>
          {items.map((it) => (
            <View key={it.id}>
              <MoneyRow label={l(it.label)} value={it.value} onChange={(n) => set(it.id, n)} />
              <Pressable accessibilityRole="button" accessibilityLabel={t('tools.removeItem', { label: l(it.label) })} onPress={() => remove(it.id)}
                style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 4, alignItems: 'center', minHeight: 32, marginTop: -4, marginBottom: 4 }}>
                <Icon icon={Trash2} size={14} color="muted" /><Text size={12} color="muted">{t('tools.remove')}</Text>
              </Pressable>
            </View>
          ))}
        </Card>
      )}
      <Card style={{ gap: 8 }}>
        <Text weight="700">{t('tools.addItem')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
          <View style={{ flex: 2 }}><TextField label={t('tools.itemName')} value={newLabel} onChangeText={setNewLabel} placeholder={t('tools.itemPlaceholder')} /></View>
          <View style={{ flex: 1 }}><TextField label="€" value={newValue} onChangeText={setNewValue} keyboardType="decimal-pad" /></View>
        </View>
        <Button variant="secondary" icon={Plus} label={t('nav.add')} disabled={!newLabel.trim()} onPress={add} />
      </Card>
      <View accessibilityLiveRegion="polite" style={{ backgroundColor: c.heroBg, borderRadius: th.shape.card, padding: 16, gap: 4 }}>
        <Text color={c.heroSub}>{name ? t('tools.yourMonthIn', { city: name }) : t('tools.yourMonth')}</Text>
        <Text size={32} lineHeight={38} weight="700" color={c.heroText}>{eur(total)}</Text>
        {rules?.blockedAccountMonthly ? (
          <Text size={14} color={c.heroSub}>{t('tools.blockedCompare', { amount: eur(rules.blockedAccountMonthly) })}</Text>
        ) : null}
      </View>
      {saved.byCity[slug] ? <Button variant="text" fullWidth={false} icon={RotateCcw} label={t('tools.resetValues')} onPress={() => budgetStore.set((st) => { const rest = { ...st.byCity }; delete rest[slug]; return { byCity: rest }; })} /> : null}
      <Text variant="caption" color="muted">{t('tools.budgetNote')}</Text>
      <AdSlot format="banner" placement="budget-results" />
      <SourcesList sources={page?.sources} lastVerified={page?.lastVerified} />
    </Screen>
  );
}

type JobType = 'mini' | 'student';

export function NetPayScreen() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const { back, crumbs } = useBack();
  const { data: r } = useRules();
  const [wage, setWage] = useState(r?.minimumWage ? r.minimumWage.toFixed(2).replace('.', ',') : '');
  const [hours, setHours] = useState('10');
  const [optOut, setOptOut] = useState(false);
  const [church, setChurch] = useState(false);
  const gross = num(wage) * num(hours) * (52 / 12);
  const limit = r?.miniJobLimitMonthly ?? 0;
  const type: JobType = limit && gross <= limit ? 'mini' : 'student';
  const pensionPct = type === 'mini' ? (optOut ? 0 : (r?.miniJobPensionPercent ?? 0)) : (r?.studentPensionPercent ?? 0);
  const pension = (gross * pensionPct) / 100;
  // Mini-jobs: the employer usually pays the 2% flat tax. Other jobs: official 2026 tariff, tax class I.
  const tax = type === 'mini'
    ? { taxableYearly: 0, incomeTaxMonthly: 0, soliMonthly: 0, churchTaxMonthly: 0 }
    : wageTaxClass1(gross, { pensionMonthly: pension, churchRate: church ? 0.09 : 0 });
  const net = gross - pension - tax.incomeTaxMonthly - tax.soliMonthly - tax.churchTaxMonthly;
  const belowMinimum = r?.minimumWage && num(wage) > 0 && num(wage) < r.minimumWage;
  const tooManyHours = r?.studentWeeklyHours && num(hours) > r.studentWeeklyHours;
  const rows: [string, string][] = [
    [t('tools.grossPay'), eur(gross, 2)],
    [t('tools.pension', { pct: String(pensionPct) }), `− ${eur(pension, 2)}`],
    [t('tools.incomeTax'), `− ${eur(tax.incomeTaxMonthly, 2)}`],
    ...(tax.soliMonthly ? [[t('tools.solidarity'), `− ${eur(tax.soliMonthly, 2)}`] as [string, string]] : []),
    ...(church && type !== 'mini' ? [[t('tools.churchTax'), `− ${eur(tax.churchTaxMonthly, 2)}`] as [string, string]] : []),
  ];
  return (
    <Screen title={t('tools.netpay')} large={false} back={back} crumbs={crumbs(t('tools.netpay'))}>
      <Text color="text2">{t('tools.netpayIntro')}</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><TextField label={t('tools.hourlyWage')} value={wage} onChangeText={setWage} keyboardType="decimal-pad" /></View>
        <View style={{ flex: 1 }}><TextField label={t('tools.hoursPerWeek')} value={hours} onChangeText={setHours} keyboardType="decimal-pad" /></View>
      </View>
      {belowMinimum ? <Text size={14} color="danger">{t('tools.belowMinimumWage', { wage: eur(r!.minimumWage!, 2) })}</Text> : null}
      <Card style={{ gap: 8 }}>
        <Text weight="700">{type === 'mini' ? t('tools.miniJob') : t('tools.workingStudent')}</Text>
        <Text size={14} color="text2">{type === 'mini' ? t('tools.miniJobExplain', { limit: eur(limit) }) : t('tools.workingStudentExplain', { limit: eur(limit) })}</Text>
        {type === 'mini' ? <ToggleRow title={t('tools.pensionOptOut')} body={t('tools.pensionOptOutBody')} value={optOut} onChange={setOptOut} /> : (
          <ToggleRow title={t('tools.churchMember')} body={t('tools.churchMemberBody')} value={church} onChange={setChurch} />
        )}
      </Card>
      <Card style={{ gap: 8 }} accessibilityLiveRegion="polite">
        <Text color="muted">{t('tools.youKeep')}</Text>
        <Text size={28} weight="700">{t('tools.perMonth', { amount: eur(net, 2) })}</Text>
        {rows.map(([k, v]) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, borderTopWidth: 1, borderColor: c.divider, paddingTop: 8 }}>
            <Text color="text3" style={{ flex: 1 }}>{k}</Text><Text weight="600">{v}</Text>
          </View>
        ))}
      </Card>
      <Text size={14} color="text2">
        {type === 'mini' ? t('tools.miniJobTax') : t('tools.taxCalcExplain', { allowance: eur(r?.basicTaxAllowance ?? 12348), taxable: eur(tax.taxableYearly) })}
      </Text>
      {type !== 'mini' ? <Text size={14} color="text2">{t('tools.taxPartYear')}</Text> : null}
      {tooManyHours ? <Text size={14} color="warningText">{t('tools.over20Hours', { hours: r!.studentWeeklyHours })}</Text> : null}
      <Text variant="caption" color="muted">{t('tools.estimateOnly')}</Text>
      <AdSlot format="banner" placement="netpay-results" />
      <SourcesList sources={r?.sources} lastVerified={r?.lastVerified} />
    </Screen>
  );
}

type WorkDay = { id: string; date: string; place: string; hours: number };
const workStore = createPersistedStore<{ days: WorkDay[] }>('workdays.v1', { days: [] });
const newId = () => `w${Date.now()}`;
/** Local calendar date, n days ago, as yyyy-mm-dd. */
const localIso = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function WorkLimitScreen() {
  const { t, i18n } = useTranslation();
  const { c } = useTheme();
  const { back, crumbs } = useBack();
  const { data: r } = useRules();
  const { days } = workStore.useStore();
  const [place, setPlace] = useState('');
  const [hours, setHours] = useState('');
  const [when, setWhen] = useState<'today' | 'yesterday' | 'other'>('today');
  const [otherDate, setOtherDate] = useState('');
  const date = when === 'today' ? localIso(0) : when === 'yesterday' ? localIso(1) : parseDate(otherDate);
  const fullDay = r?.fullDayHours ?? 4;
  /** More than `fullDay` hours = a full day; up to that = half a day (two half days = one full day). */
  const weight = (h: number) => (h > fullDay ? 1 : h > 0 ? 0.5 : 0);
  const year = new Date().getFullYear();
  const used = useMemo(() => days.filter((d) => d.date.startsWith(String(year))).reduce((a, d) => a + weight(d.hours), 0), [days, year, fullDay]); // eslint-disable-line react-hooks/exhaustive-deps
  const limit = r?.studentWorkFullDays ?? 0;
  const left = Math.max(0, limit - used);
  const log = () => {
    const h = num(hours);
    if (!h || !date) return;
    workStore.set((s) => ({ days: [{ id: newId(), date, place: place || t('tools.work'), hours: h }, ...s.days].sort((a, b) => b.date.localeCompare(a.date)) }));
    setHours(''); setPlace(''); setWhen('today'); setOtherDate('');
  };
  return (
    <Screen title={t('tools.worklimit')} large={false} back={back} crumbs={crumbs(t('tools.worklimit'))}>
      <Card style={{ gap: 10 }}>
        <Text color="muted">{t('tools.usedThisYear', { year })}</Text>
        <Text size={24} weight="700">{t('tools.usedOfLimit', { used, limit })}</Text>
        <ProgressBar value={used} max={limit || 1} label={limit && used / limit >= 0.8 ? t('tools.closeToLimit', { left }) : t('tools.daysLeft', { left })} />
        <Text size={14} color="text2">{t('tools.workRuleExplain', { full: limit, half: r?.studentWorkHalfDays ?? 0, hours: fullDay, weekly: r?.studentWeeklyHours ?? 20 })}</Text>
      </Card>
      <SectionTitle>{t('tools.logWorkDay')}</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}><TextField label={t('tools.where')} value={place} onChangeText={setPlace} placeholder={t('tools.wherePlaceholder')} /></View>
        <View style={{ flex: 1 }}><TextField label={t('tools.hours')} value={hours} onChangeText={setHours} keyboardType="decimal-pad" /></View>
      </View>
      <View style={{ gap: 8 }}>
        <Text size={14} weight="600">{t('tools.workDate')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {(['today', 'yesterday', 'other'] as const).map((w) => <Chip key={w} label={t(`tools.date_${w}`)} selected={when === w} onPress={() => setWhen(w)} />)}
        </View>
        {when === 'other' ? (
          <TextField label={t('reminders.date')} value={otherDate} onChangeText={setOtherDate} placeholder="10.11.2026"
            hint={otherDate.length >= 8 && !date ? t('reminders.dateError') : t('reminders.dateHint')} keyboardType="numbers-and-punctuation" />
        ) : null}
      </View>
      <Button label={t('tools.logWorkDay')} onPress={log} disabled={!num(hours) || !date} />
      {days.length ? (
        <>
          <SectionTitle>{t('tools.recentDays')}</SectionTitle>
          <Card padded={false} style={{ paddingHorizontal: 16 }}>
            {days.slice(0, 20).map((d, i) => (
              <View key={d.id} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
                <View style={{ flex: 1 }}>
                  <Text weight="600">{formatDate(d.date, i18n.language, { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                  <Text variant="caption" color="muted">{d.place} · {t('tools.hoursCount', { count: d.hours })}</Text>
                </View>
                <Text size={13} weight="600" color={weight(d.hours) === 1 ? 'text' : 'muted'}>{weight(d.hours) === 1 ? t('tools.fullDay') : t('tools.halfDay')}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={t('tools.deleteDay')} onPress={() => workStore.set((s) => ({ days: s.days.filter((x) => x.id !== d.id) }))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon icon={Trash2} size={18} color="muted" />
                </Pressable>
              </View>
            ))}
          </Card>
        </>
      ) : null}
      <Text variant="caption" color="muted">{t('tools.workLimitNote')}</Text>
      <AdSlot format="banner" placement="worklimit-results" />
      <SourcesList sources={r?.sources} lastVerified={r?.lastVerified} />
    </Screen>
  );
}
