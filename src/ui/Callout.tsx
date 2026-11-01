import { AlertTriangle, Info, Lightbulb, XCircle } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CalloutKind } from '@/content/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

/** Callout: tip (teal), warning (amber), common mistake (red), legal notice (grey). */
export function Callout({ kind, text }: { kind: CalloutKind; text: string }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const m = {
    tip: { bg: c.primaryTint, fg: c.primary, icon: Lightbulb, label: t('callout.tip') },
    warning: { bg: c.warningBg, fg: c.warningText, icon: AlertTriangle, label: t('callout.warning') },
    mistake: { bg: c.dangerBg, fg: c.danger, icon: XCircle, label: t('callout.mistake') },
    legal: { bg: c.divider, fg: c.text3, icon: Info, label: t('callout.legal') },
  }[kind];
  return (
    <View style={{ flexDirection: 'row', gap: 10, backgroundColor: m.bg, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 }}>
      <Icon icon={m.icon} size={20} color={m.fg} />
      <Text variant="bodySmall" style={{ flex: 1 }}>
        <Text variant="bodySmall" weight="700" color={m.fg}>{m.label}. </Text>
        {text}
      </Text>
    </View>
  );
}
