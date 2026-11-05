import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { Source } from '@/content/types';
import { formatDate } from '@/lib/deadline';
import { Text } from './Text';

/** "Official sources" block shown on every page that states facts. */
export function SourcesList({ sources, lastVerified, title }: { sources?: Source[]; lastVerified?: string; title?: string }) {
  const { t, i18n } = useTranslation();
  if (!sources?.length) return null;
  return (
    <View style={{ gap: 4 }}>
      <Text size={15} weight="700" heading>{title ?? t('guides.sources')}</Text>
      {sources.map((s) => (
        <Pressable key={s.url + s.title} accessibilityRole="link" onPress={() => void WebBrowser.openBrowserAsync(s.url)} style={{ minHeight: 40, justifyContent: 'center' }}>
          <Text size={14} weight="600" color="primary" style={{ textDecorationLine: 'underline' }}>{s.title} ↗</Text>
        </Pressable>
      ))}
      {lastVerified ? <Text variant="caption" color="muted">{t('common.lastVerified', { date: /^\d{4}-\d{2}-\d{2}$/.test(lastVerified) ? formatDate(lastVerified, i18n.language) : lastVerified })}</Text> : null}
    </View>
  );
}
