import { AlertOctagon, Bell, Info, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

/**
 * AlertBanner: info, rule change (dismissible), urgent (NOT dismissible — §7.4).
 */
export function AlertBanner({
  kind, title, body, action, onDismiss,
}: { kind: 'info' | 'rule' | 'urgent'; title?: string; body?: string; action?: React.ReactNode; onDismiss?: () => void }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const m = {
    info: { bg: c.primaryTint, fg: c.text, icon: Info, ic: c.primary },
    rule: { bg: c.primaryTint, fg: c.text, icon: Bell, ic: c.primary },
    urgent: { bg: c.danger, fg: th.scheme === 'dark' ? '#1A2221' : '#FFFFFF', icon: AlertOctagon, ic: th.scheme === 'dark' ? '#1A2221' : '#FFFFFF' },
  }[kind];
  const dismissible = kind !== 'urgent' && !!onDismiss;
  return (
    <View
      accessibilityRole={kind === 'urgent' ? 'alert' : 'summary'}
      accessibilityLiveRegion={kind === 'urgent' ? 'assertive' : 'polite'}
      style={{
        flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: m.bg, borderRadius: 12,
        paddingVertical: 12, paddingLeft: 14, paddingRight: dismissible ? 4 : 14,
      }}
    >
      <Icon icon={m.icon} size={20} color={m.ic} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="bodySmall" color={m.fg}>
          {title ? <Text variant="bodySmall" weight="700" color={m.fg}>{title}</Text> : null}
          {title && body ? ' — ' : ''}
          {body}
        </Text>
        {action}
      </View>
      {dismissible ? (
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.dismiss')} onPress={onDismiss} style={{ width: 44, height: 44, marginTop: -10, alignItems: 'center', justifyContent: 'center' }}>
          <Icon icon={X} size={20} color="muted" />
        </Pressable>
      ) : null}
    </View>
  );
}
