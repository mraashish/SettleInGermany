import { Link, router } from 'expo-router';
import { EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { GermanTermRef } from '@/content/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Checkbox } from './Checkbox';
import { DeadlineChip, DueChip } from './DeadlineChip';
import { GermanTerm } from './GermanTerm';
import { Icon } from './Icon';
import { Text } from './Text';

export type TaskState = 'open' | 'done' | 'overdue' | 'hidden';

export interface TaskItemProps {
  title: string;
  term?: GermanTermRef;
  effort?: string;
  due?: string | null;
  timingNote?: string;
  doneLabel?: string;
  guideHref?: string;
  /** Page opened by tapping the title (guide or task page). */
  href?: string;
  state: TaskState;
  onToggle?: (done: boolean) => void;
  onHide?: () => void;
  first?: boolean;
}

/** TaskItem (RoadmapScreen, Library): checkbox, title, DE term, deadline chip, guide link. */
export function TaskItem({ title, term, effort, due, timingNote, doneLabel, guideHref, href, state, onToggle, onHide, first }: TaskItemProps) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const [burst] = useState(() => new Animated.Value(0));
  const done = state === 'done';
  const hidden = state === 'hidden';

  const toggle = async (v: boolean) => {
    onToggle?.(v);
    if (v && !(await AccessibilityInfo.isReduceMotionEnabled())) {
      burst.setValue(0);
      Animated.timing(burst, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  };

  return (
    <View style={[styles.row, { borderTopColor: c.divider, borderTopWidth: first ? 0 : 1, opacity: hidden ? 0.7 : 1 }]}>
      <View>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.burst,
            { backgroundColor: c.accent, opacity: burst.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.6, 0] }), transform: [{ scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.4, 2.2] }) }] },
          ]}
        />
        <Checkbox
          checked={done}
          onChange={toggle}
          label={done ? `${title}, ${t('deadline.done').toLowerCase()}` : title}
          tone={state === 'overdue' ? 'danger' : hidden ? 'muted' : 'default'}
        />
      </View>
      <View style={styles.body}>
        <Pressable
          accessibilityRole={href ? 'link' : undefined}
          disabled={!href}
          onPress={() => href && router.push(href as never)}
          hitSlop={4}
        >
          <Text
            size={16}
            lineHeight={21}
            weight="600"
            color={done || hidden ? 'muted' : 'text'}
            style={done ? { textDecorationLine: 'line-through' } : undefined}
          >
            {title}
          </Text>
        </Pressable>
        {done ? (
          doneLabel ? <Text variant="caption" color="successText" weight="600">{doneLabel}</Text> : null
        ) : (
          <>
            {term ? (
              <View style={styles.inline}>
                <GermanTerm term={term} />
                {effort ? <Text variant="caption" color="muted">· {effort}</Text> : null}
              </View>
            ) : null}
            <View style={styles.inline}>
              {hidden ? (
                <DeadlineChip tone="neutral" icon={EyeOff} label={t('roadmap.hiddenChip')} />
              ) : due ? (
                <DueChip due={due} />
              ) : timingNote ? (
                <DeadlineChip tone="neutral" label={timingNote} />
              ) : null}
              {guideHref ? (
                <Link href={guideHref as never} asChild>
                  <Pressable accessibilityRole="link" hitSlop={8}>
                    <Text size={14} weight="600" color="primary" style={{ textDecorationLine: 'underline' }}>{t('common.howTo')}</Text>
                  </Pressable>
                </Link>
              ) : null}
            </View>
          </>
        )}
      </View>
      {onHide && !done ? (
        <Pressable accessibilityRole="button" accessibilityLabel={hidden ? t('roadmap.unhide') : t('roadmap.hide')} onPress={onHide} hitSlop={8} style={styles.hide}>
          <Icon icon={EyeOff} size={18} color="muted" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  body: { flex: 1, gap: 6 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  burst: { position: 'absolute', left: 0, top: 0, width: 24, height: 24, borderRadius: 12 },
  hide: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
