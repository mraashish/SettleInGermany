import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

/** Saffron "AI" label — fill only, never saffron text (HANDOFF §5). */
export function AILabel() {
  const { t } = useTranslation();
  const { c } = useTheme();
  return (
    <View accessible accessibilityLabel={t('common.aiGenerated')} style={{ backgroundColor: c.accent, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1, alignSelf: 'center' }}>
      <Text size={10} lineHeight={14} weight="700" color="onAccent" devanagari={false}>{t('common.ai')}</Text>
    </View>
  );
}

/** AIResultBlock (LetterResult): "AI" header + content. Sections are numbered in the result screen. */
export function AIResultBlock({ title, children }: { title: string; children: React.ReactNode }) {
  const t = useTheme();
  const { c } = t;
  return (
    <View style={{ borderWidth: 1, borderColor: c.border, borderRadius: t.shape.card, overflow: 'hidden', backgroundColor: c.surface }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: c.ground }}>
        <AILabel />
        <Text size={13} weight="600" heading>{title}</Text>
      </View>
      <View style={{ padding: 14, gap: 8 }}>{children}</View>
    </View>
  );
}
