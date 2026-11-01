import { router } from 'expo-router';
import { BellPlus, Check, Plus } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { daysUntil, formatDate, toneForDays } from '@/lib/deadline';
import { type Reminder, useReminders } from '@/store/reminders';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, DeadlineChip, DueChip, EmptyState, Icon, Overline, Screen, Text } from '@/ui';
import { useRoadmapData } from '../roadmap/useRoadmapData';

type Row = { id: string; title: string; date: string; reminder?: Reminder };

function Group({ title, rows, valid }: { title: string; rows: Row[]; valid?: boolean }) {
  const { i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  if (!rows.length) return null;
  return (
    <View style={{ gap: 8 }}>
      <Overline>{title}</Overline>
      <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, paddingHorizontal: 16 }}>
        {rows.map((r, i) => (
          <Pressable key={r.id} accessibilityRole={r.reminder ? 'button' : undefined} disabled={!r.reminder}
            onPress={() => r.reminder && router.push(`/me/reminders/new?id=${r.reminder.id}`)}
            style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: i ? 1 : 0, borderColor: c.divider, paddingVertical: 8 }}>
            <View style={{ flex: 1 }}>
              <Text size={15} weight="600">{r.title}</Text>
              <Text variant="caption" color="muted">{valid ? `Expires ${formatDate(r.date, i18n.language)}` : formatDate(r.date, i18n.language, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            </View>
            {valid ? <DeadlineChip tone="done" icon={Check} label="Valid" /> : <DueChip due={r.date} compact={toneForDays(daysUntil(r.date)) === 'neutral'} />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function RemindersScreen() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const reminders = useReminders();
  const { deadlines } = useRoadmapData();
  const rows: Row[] = [
    ...deadlines.map((v) => ({ id: `task-${v.id}`, title: v.title, date: v.due! })),
    ...reminders.map((r) => ({ id: r.id, title: r.title, date: r.date, reminder: r })),
  ].sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
  const attention = rows.filter((r) => daysUntil(r.date) <= 30);
  const coming = rows.filter((r) => daysUntil(r.date) > 30 && daysUntil(r.date) <= 365 * 2);
  const valid = rows.filter((r) => daysUntil(r.date) > 365 * 2);
  const add = () => router.push('/me/reminders/new');
  const android = th.platform === 'android';

  return (
    <Screen
      title={t('reminders.title')}
      back={{ label: t('nav.me'), href: '/me' }}
      actions={th.platform === 'ios' ? [{ icon: Plus, label: t('reminders.add'), onPress: add }] : []}
      crumbs={[{ label: t('nav.me'), href: '/me' }, { label: t('reminders.title') }]}
    >
      {rows.length === 0 ? (
        <EmptyState icon={BellPlus} title={t('reminders.empty')} body={t('reminders.emptyBody')} actionLabel="Add your visa expiry date" onAction={add} />
      ) : (
        <>
          <Text color="text2">{t('reminders.emptyBody').replace('Add a deadline and we’ll remind', 'We remind')}</Text>
          <View style={{ backgroundColor: c.divider, borderRadius: 12, padding: 12 }}>
            <Text size={13} color="text3">{t('reminders.freeNote')}</Text>
          </View>
          <Group title="Needs attention" rows={attention} />
          <Group title="Coming up" rows={coming} />
          <Group title="Valid" rows={valid} valid />
          {Platform.OS === 'web' ? <Button label={t('reminders.add')} icon={Plus} onPress={add} fullWidth={false} /> : null}
          {th.platform === 'ios' ? <Button variant="secondary" label="Add a custom reminder" icon={Plus} onPress={add} /> : null}
        </>
      )}
      {android ? (
        <Pressable accessibilityRole="button" accessibilityLabel={t('reminders.add')} onPress={add}
          style={{ alignSelf: 'flex-end', minHeight: 56, borderRadius: 16, backgroundColor: c.primaryTint2, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}>
          <Icon icon={Plus} color="primaryPressed" />
          <Text weight="600" color="primaryPressed">{t('reminders.add')}</Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}
