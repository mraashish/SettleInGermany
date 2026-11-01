import { AlertTriangle, CalendarClock, Check, Clock, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { daysUntil, type DeadlineTone, toneForDays } from '@/lib/deadline';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

/**
 * DeadlineChip — status is always colour + icon + word (HANDOFF §4).
 * Neutral > 30 d · warning ≤ 30 d · danger ≤ 7 d or expired · done.
 */
export function DeadlineChip({
  tone, label, icon, short,
}: { tone: DeadlineTone; label: string; icon?: LucideIcon; short?: boolean }) {
  const { c } = useTheme();
  const map = {
    neutral: { bg: c.divider, fg: c.text3, icon: CalendarClock },
    warning: { bg: c.warningBg, fg: c.warningText, icon: Clock },
    danger: { bg: c.dangerBg, fg: c.danger, icon: AlertTriangle },
    done: { bg: c.successBg, fg: c.successText, icon: Check },
  }[tone];
  return (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
        backgroundColor: map.bg, borderRadius: 999, paddingHorizontal: short ? 9 : 10, paddingVertical: 3,
      }}
    >
      <Icon icon={icon ?? map.icon} size={14} color={map.fg} strokeWidth={2.4} />
      <Text size={13} lineHeight={18} weight="700" color={map.fg}>
        {label}
      </Text>
    </View>
  );
}

/** Builds the right chip from a due date. `compact` → "5 days" (Home deadline list). */
export function DueChip({ due, done, compact }: { due: string; done?: boolean; compact?: boolean }) {
  const { t } = useTranslation();
  if (done) return <DeadlineChip tone="done" label={t('deadline.done')} />;
  const d = daysUntil(due);
  const tone = toneForDays(d);
  let label: string;
  if (d < 0) label = t('deadline.overdue', { count: -d });
  else if (compact) label = t('deadline.days', { count: d });
  else if (tone === 'danger') label = t('deadline.urgent', { count: d });
  else if (tone === 'warning') label = t('deadline.soon', { count: d });
  else label = t('deadline.inDays', { count: d });
  return <DeadlineChip tone={tone} label={label} />;
}
