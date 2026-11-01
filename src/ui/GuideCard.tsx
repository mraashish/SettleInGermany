import { Link } from 'expo-router';
import { Bookmark, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useL } from '@/content/client';
import type { Guide } from '@/content/types';
import { formatDate } from '@/lib/deadline';
import { toggleSavedGuide, useRoadmap } from '@/store/roadmap';
import { useTheme } from '@/theme/ThemeProvider';
import { Pill } from './Chip';
import { GermanTerm } from './GermanTerm';
import { Icon } from './Icon';
import { Text } from './Text';

/** GuideCard: default, saved, updated recently (GuidesScreen). */
export function GuideCard({ guide, first }: { guide: Guide; first?: boolean }) {
  const { t, i18n } = useTranslation();
  const { c } = useTheme();
  const l = useL();
  const saved = useRoadmap((s) => s.savedGuides.includes(guide.slug));
  return (
    <View style={[styles.row, { borderTopColor: c.divider, borderTopWidth: first ? 0 : 1 }]}>
      <Link href={`/guides/${guide.slug}`} asChild>
        <Pressable accessibilityRole="link" style={styles.main}>
          <View style={styles.titleRow}>
            <Text size={16} lineHeight={21} weight="600">{l(guide.title)}</Text>
            {guide.updatedRecently ? <Pill label={t('common.updated')} /> : null}
          </View>
          <GermanTerm term={guide.term} />
          <Text variant="caption" color="muted">
            {t('common.min', { count: guide.readingMinutes })} · {t('common.verified', { date: formatDate(guide.lastVerified, i18n.language) })}
          </Text>
        </Pressable>
      </Link>
      {guide.compareLink ? (
        <Link href={guide.compareLink.href as never} asChild>
          <Pressable accessibilityRole="link" hitSlop={6}>
            <Text size={13} weight="600" color="primary">{l(guide.compareLink.label)}</Text>
          </Pressable>
        </Link>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: saved }}
        accessibilityLabel={saved ? t('guides.unsave') : t('guides.save')}
        onPress={() => toggleSavedGuide(guide.slug)}
        style={styles.icon}
      >
        <Icon icon={Bookmark} size={20} color="primary" fill={saved ? c.primary : 'none'} />
      </Pressable>
      <Icon icon={ChevronRight} size={20} color="muted" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  main: { flex: 1, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
