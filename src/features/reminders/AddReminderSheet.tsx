import { router, useLocalSearchParams } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { formatDate } from '@/lib/deadline';
import { useLayout } from '@/lib/useLayout';
import { cancelReminder, requestPermission, scheduleReminder } from '@/services/notifications';
import { DEFAULT_OFFSETS, deleteReminder, remindersStore, upsertReminder } from '@/store/reminders';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Chip, Screen, Text, TextField } from '@/ui';

const newId = () => `r-${Date.now()}`;

const KINDS = ['Visa', 'Residence permit', 'Passport', 'Health insurance', 'Semester fee', 'Tax', 'Something else'];

/** dd.mm.yyyy (how German documents write it) or yyyy-mm-dd → ISO. */
function parseDate(s: string): string | null {
  const de = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s.trim());
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  const parts = de ? [de[3], de[2], de[1]] : iso ? [iso[1], iso[2], iso[3]] : null;
  if (!parts) return null;
  const [y, m, d] = parts as [string, string, string];
  const date = new Date(Date.UTC(+y, +m - 1, +d));
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

export function AddReminderSheet() {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const { webWide } = useLayout();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = remindersStore.get().items.find((r) => r.id === id);
  const [kind, setKind] = useState(existing ? (KINDS.includes(existing.title) ? existing.title : 'Something else') : 'Visa');
  const [custom, setCustom] = useState(existing && !KINDS.includes(existing.title) ? existing.title : '');
  const [dateText, setDateText] = useState(existing ? existing.date.split('-').reverse().join('.') : '');
  const [offsets, setOffsets] = useState<number[]>(existing?.offsets ?? DEFAULT_OFFSETS);
  const [note, setNote] = useState(existing?.note ?? '');
  const [error, setError] = useState<string | null>(null);
  const iso = parseDate(dateText);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/me/reminders'));
  const save = async () => {
    if (!iso) { setError('Please enter a date like 15.01.2027'); return; }
    const title = kind === 'Something else' ? custom.trim() || 'Reminder' : kind;
    const r = { id: existing?.id ?? newId(), title, date: iso, note, offsets, notificationIds: existing?.notificationIds ?? [] };
    if (await requestPermission()) {
      r.notificationIds = await scheduleReminder(r, (days) => ({ title: `${title}: ${days} days left`, body: note || `Deadline on ${formatDate(iso, i18n.language)}.` }));
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
          {KINDS.map((k) => <Chip key={k} label={k} selected={kind === k} onPress={() => setKind(k)} />)}
        </View>
        {kind === 'Something else' ? <TextField label={t('reminders.name')} value={custom} onChangeText={setCustom} placeholder={t('reminders.namePlaceholder')} /> : null}
      </View>
      <TextField label="Expiry date" value={dateText} onChangeText={(v) => { setDateText(v); setError(null); }} placeholder="15.01.2027" keyboardType="numbers-and-punctuation"
        hint={error ?? (iso ? `${formatDate(iso, i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })} · German documents write this as ${dateText}` : 'German documents write dates as DD.MM.YYYY')} />
      <View style={{ gap: 8 }}>
        <Text size={14} weight="600">{t('reminders.remindMe')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[90, 60, 30, 14, 7, 1].map((d) => (
            <Chip key={d} label={d === 90 ? '90 days before' : `${d} days`} selected={offsets.includes(d)} onPress={() => setOffsets((o) => (o.includes(d) ? o.filter((x) => x !== d) : [...o, d].sort((a, b) => b - a)))} />
          ))}
        </View>
      </View>
      <TextField label={t('reminders.note')} value={note} onChangeText={setNote} placeholder="e.g. Book the appointment 8 weeks before" multiline style={{ minHeight: 88, textAlignVertical: 'top' }} />
      <View style={{ backgroundColor: c.divider, borderRadius: 12, padding: 12 }}>
        <Text size={13} color="text3">We save the date and your note only — never a photo of your document.</Text>
      </View>
      {existing ? <Button variant="destructive" icon={Trash2} label={t('reminders.delete')} onPress={remove} /> : null}
    </View>
  );

  // iOS: sheet with Cancel / Save in header. Android: bottom sheet with actions at the bottom. Web: modal.
  if (Platform.OS === 'web') {
    return (
      <Screen title={existing ? 'Edit reminder' : 'New reminder'} crumbs={[{ label: t('reminders.title'), href: '/me/reminders' }, { label: 'New reminder' }]}
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
          <Text size={17} weight="600" heading={1}>{existing ? 'Edit reminder' : 'New reminder'}</Text>
          <Pressable accessibilityRole="button" onPress={save} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}><Text size={17} weight="700" color="primary">{t('nav.save')}</Text></Pressable>
        </View>
      ) : (
        <Text size={24} lineHeight={32} style={{ paddingHorizontal: 24, paddingTop: 16 }} heading={1}>{existing ? 'Edit reminder' : 'New reminder'}</Text>
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
