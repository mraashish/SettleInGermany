import { Minus, Plus, RotateCcw, Trash2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useMyCity } from '@/content/city';
import { useL, useRules } from '@/content/client';
import type { Localized } from '@/content/types';
import { createPersistedStore } from '@/lib/createStore';
import { formatDate } from '@/lib/deadline';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { AdSlot, Button, Card, Chip, Icon, ProgressBar, Screen, SectionTitle, SourcesList, Text, TextField, ToggleRow } from '@/ui';

const eur = (n: number, digits = 0) => `€${n.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
const num = (s: string) => {
  const n = parseFloat(s.replace(/\s/g, '').replace(',', '.'));
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

const budgetStore = createPersistedStore<{ city: string | null; items: { label: Localized; value: number }[] }>('budget.v2', { city: null, items: [] });

export function BudgetScreen() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { back, crumbs } = useBack();
  const { name, page, slug } = useMyCity();
  const defaults = page?.budget ?? [];
  const saved = budgetStore.useStore();
  const items = saved.city === slug && saved.items.length ? saved.items : defaults;
  const set = (i: number, value: number) => budgetStore.set({ city: slug, items: items.map((x, j) => (j === i ? { ...x, value } : x)) });
  const total = items.reduce((a, b) => a + b.value, 0);
  const { data: rules } = useRules();
  return (
    <Screen title={t('tools.budget')} large={false} back={back} crumbs={crumbs(t('tools.budget'))}>
      <Text color="text2">{t('tools.budgetIntro')}</Text>
      {name ? <Chip label={t('tools.cityChip', { city: name })} selected /> : null}
      {items.length === 0 ? (
        <Card><Text color="text2">{t('tools.budgetNoCity')}</Text></Card>
      ) : (
        <Card padded={false} style={{ paddingHorizontal: 16 }}>
          {items.map((it, i) => <MoneyRow key={it.label.en} label={l(it.label)} value={it.value} onChange={(n) => set(i, n)} />)}
        </Card>
      )}
      <View accessibilityLiveRegion="polite" style={{ backgroundColor: c.heroBg, borderRadius: th.shape.card, padding: 16, gap: 4 }}>
        <Text color={c.heroSub}>{name ? t('tools.yourMonthIn', { city: name }) : t('tools.yourMonth')}</Text>
        <Text size={32} lineHeight={38} weight="700" color={c.heroText}>{eur(total)}</Text>
        {rules?.blockedAccountMonthly ? (
          <Text size={14} color={c.heroSub}>{t('tools.blockedCompare', { amount: eur(rules.blockedAccountMonthly) })}</Text>
        ) : null}
      </View>
      {saved.items.length ? <Button variant="text" fullWidth={false} icon={RotateCcw} label={t('tools.resetValues')} onPress={() => budgetStore.reset()} /> : null}
      <Text variant="caption" color="muted">{t('tools.budgetNote')}</Text>
      <AdSlot format="banner" placement="budget-results" />
      <SourcesList sources={page?.sources?.filter((s) => /budget|leben|living|studentenwerk|kranken|semester|rundfunk/i.test(s.title + s.url))} lastVerified={page?.lastVerified} />
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
  const gross = num(wage) * num(hours) * (52 / 12);
  const limit = r?.miniJobLimitMonthly ?? 0;
  const type: JobType = limit && gross <= limit ? 'mini' : 'student';
  const pensionPct = type === 'mini' ? (optOut ? 0 : (r?.miniJobPensionPercent ?? 0)) : (r?.studentPensionPercent ?? 0);
  const pension = (gross * pensionPct) / 100;
  const yearly = gross * 12;
  const taxFree = !r?.basicTaxAllowance || yearly <= r.basicTaxAllowance;
  const net = gross - pension;
  const belowMinimum = r?.minimumWage && num(wage) > 0 && num(wage) < r.minimumWage;
  const tooManyHours = r?.studentWeeklyHours && num(hours) > r.studentWeeklyHours;
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
        {type === 'mini' ? <ToggleRow title={t('tools.pensionOptOut')} body={t('tools.pensionOptOutBody')} value={optOut} onChange={setOptOut} /> : null}
      </Card>
      <Card style={{ gap: 8 }} accessibilityLiveRegion="polite">
        <Text color="muted">{t('tools.youKeep')}</Text>
        <Text size={28} weight="700">{t('tools.perMonth', { amount: eur(net) })}</Text>
        {[
          [t('tools.grossPay'), eur(gross)],
          [t('tools.pension', { pct: pensionPct.toLocaleString('de-DE') }), `− ${eur(pension)}`],
          [t('tools.incomeTax'), taxFree ? eur(0) : t('tools.taxDepends')],
        ].map(([k, v]) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, borderTopWidth: 1, borderColor: c.divider, paddingTop: 8 }}>
            <Text color="text3" style={{ flex: 1 }}>{k}</Text><Text weight="600">{v}</Text>
          </View>
        ))}
      </Card>
      <Text size={14} color="text2">{taxFree ? t('tools.taxFreeExplain', { allowance: eur(r?.basicTaxAllowance ?? 0) }) : t('tools.taxRefundExplain', { allowance: eur(r?.basicTaxAllowance ?? 0) })}</Text>
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
const todayIso = () => new Date().toISOString().slice(0, 10);

export function WorkLimitScreen() {
  const { t, i18n } = useTranslation();
  const { c } = useTheme();
  const { back, crumbs } = useBack();
  const { data: r } = useRules();
  const { days } = workStore.useStore();
  const [place, setPlace] = useState('');
  const [hours, setHours] = useState('');
  const fullDay = r?.fullDayHours ?? 4;
  /** More than `fullDay` hours = a full day; up to that = half a day (two half days = one full day). */
  const weight = (h: number) => (h > fullDay ? 1 : h > 0 ? 0.5 : 0);
  const year = new Date().getFullYear();
  const used = useMemo(() => days.filter((d) => d.date.startsWith(String(year))).reduce((a, d) => a + weight(d.hours), 0), [days, year, fullDay]); // eslint-disable-line react-hooks/exhaustive-deps
  const limit = r?.studentWorkFullDays ?? 0;
  const left = Math.max(0, limit - used);
  const log = () => {
    const h = num(hours);
    if (!h) return;
    workStore.set((s) => ({ days: [{ id: newId(), date: todayIso(), place: place || t('tools.work'), hours: h }, ...s.days] }));
    setHours(''); setPlace('');
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
      <Button label={t('tools.logWorkDay')} onPress={log} disabled={!num(hours)} />
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
