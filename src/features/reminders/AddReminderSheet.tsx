import { router, useLocalSearchParams } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { formatDate } from '@/lib/deadline';
import { useLayout } from '@/lib/useLayout';
import { cancelReminder, requestPermission, scheduleReminder } from '@/services/notifications';
import { parseDate } from './dates';
import { DEFAULT_OFFSETS, deleteReminder, remindersStore, upsertReminder } from '@/store/reminders';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Chip, Screen, Text, TextField } from '@/ui';


const KINDS = ['visa', 'permit', 'passport', 'insurance', 'semesterFee', 'tax', 'other'] as const;
type Kind = (typeof KINDS)[number];
const newId = () => `r-${Date.now()}`;

export function AddReminderSheet() {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const { webWide } = useLayout();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = remindersStore.get().items.find((r) => r.id === id);
  const kindOf = (title: string): Kind => KINDS.find((k) => t(`reminders.kinds.${k}`) === title) ?? 'other';
  const [kind, setKind] = useState<Kind>(existing ? kindOf(existing.title) : 'visa');
  const [custom, setCustom] = useState(existing && kindOf(existing.title) === 'other' ? existing.title : '');
  const [dateText, setDateText] = useState(existing ? existing.date.split('-').reverse().join('.') : '');
  const [offsets, setOffsets] = useState<number[]>(existing?.offsets ?? DEFAULT_OFFSETS);
  const [note, setNote] = useState(existing?.note ?? '');
  const [error, setError] = useState<string | null>(null);
  const iso = parseDate(dateText);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/me/reminders'));
  const save = async () => {
    if (!iso) { setError(t('reminders.dateError')); return; }
    const title = kind === 'other' ? custom.trim() || t('reminders.reminder') : t(`reminders.kinds.${kind}`);
    const r = { id: existing?.id ?? newId(), title, date: iso, note, offsets, notificationIds: existing?.notificationIds ?? [] };
    if (await requestPermission()) {
      r.notificationIds = await scheduleReminder(r, (days) => ({ title: t('reminders.notifTitle', { title, count: days }), body: note || t('reminders.notifBody', { date: formatDate(iso, i18n.language) }) }));
    }
    upsertReminder(r);
    close();
  };
  const remove = async () => {
    if (existing) { await cancelReminder(existing); deleteReminder(existing.id); }
    close();
  };

  const form = (
    <View style={{ gap: 20 }}>
      <View style={{ gap: 8 }} accessibilityRole="radiogroup" accessibilityLabel={t('reminders.name')}>
        <Text size={14} weight="600">{t('reminders.name')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {KINDS.map((k) => <Chip key={k} label={t(`reminders.kinds.${k}`)} selected={kind === k} onPress={() => setKind(k)} />)}
        </View>
        {kind === 'other' ? <TextField label={t('reminders.name')} value={custom} onChangeText={setCustom} placeholder={t('reminders.namePlaceholder')} /> : null}
      </View>
      <TextField label={t('reminders.date')} value={dateText} onChangeText={(v) => { setDateText(v); setError(null); }} placeholder="15.01.2027" keyboardType="numbers-and-punctuation"
        hint={error ?? (iso ? t('reminders.dateParsed', { date: formatDate(iso, i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }), raw: dateText }) : t('reminders.dateHint'))} />
      <View style={{ gap: 8 }}>
        <Text size={14} weight="600">{t('reminders.remindMe')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[90, 60, 30, 14, 7, 1].map((d) => (
            <Chip key={d} label={t('reminders.before', { count: d })} selected={offsets.includes(d)} onPress={() => setOffsets((o) => (o.includes(d) ? o.filter((x) => x !== d) : [...o, d].sort((a, b) => b - a)))} />
          ))}
        </View>
      </View>
      <TextField label={t('reminders.note')} value={note} onChangeText={setNote} placeholder={t('reminders.notePlaceholder')} multiline style={{ minHeight: 88, textAlignVertical: 'top' }} />
      <View style={{ backgroundColor: c.divider, borderRadius: 12, padding: 12 }}>
        <Text size={13} color="text3">{t('reminders.privacyNote')}</Text>
      </View>
      {existing ? <Button variant="destructive" icon={Trash2} label={t('reminders.delete')} onPress={remove} /> : null}
    </View>
  );

  // iOS: sheet with Cancel / Save in header. Android: bottom sheet with actions at the bottom. Web: modal.
  if (Platform.OS === 'web') {
    return (
      <Screen title={existing ? t('reminders.edit') : t('reminders.new')} crumbs={[{ label: t('reminders.title'), href: '/me/reminders' }, { label: existing ? t('reminders.edit') : t('reminders.new') }]}
        footer={<View style={{ flexDirection: 'row', gap: 8, justifyContent: webWide ? 'flex-end' : 'space-between' }}><Button variant="text" fullWidth={false} label={t('nav.cancel')} onPress={close} /><Button fullWidth={false} label={t('nav.save')} onPress={save} /></View>}>
        {form}
      </Screen>
    );
  }
  return (
    <SafeAreaView edges={th.platform === 'android' ? ['top', 'bottom'] : ['bottom']} style={{ flex: 1, backgroundColor: c.surface }}>
      {th.platform === 'ios' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: c.border }}>
          <Button variant="text" fullWidth={false} label={t('nav.cancel')} onPress={close} />
          <Text size={17} weight="600" heading={1}>{existing ? t('reminders.edit') : t('reminders.new')}</Text>
          <Pressable accessibilityRole="button" onPress={save} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}><Text size={17} weight="700" color="primary">{t('nav.save')}</Text></Pressable>
        </View>
      ) : (
        <Text size={24} lineHeight={32} style={{ paddingHorizontal: 24, paddingTop: 16 }} heading={1}>{existing ? t('reminders.edit') : t('reminders.new')}</Text>
      )}
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">{form}</ScrollView>
      {th.platform === 'android' ? (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, padding: 16 }}>
          <Button variant="text" fullWidth={false} label={t('nav.cancel')} onPress={close} />
          <Button fullWidth={false} icon={Plus} label={t('nav.save')} onPress={save} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
