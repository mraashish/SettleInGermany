import { AlertCircle, BellPlus, CloudOff, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

/** Empty: friendly illustration, one sentence, one action. */
export function EmptyState({ title, body, actionLabel, onAction, icon = BellPlus }: { title: string; body: string; actionLabel?: string; onAction?: () => void; icon?: typeof BellPlus }) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 12, paddingVertical: 32, paddingHorizontal: 16 }}>
      {/* TODO(product owner): illustration — only simple placeholders exist (HANDOFF §12). */}
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
        <Icon icon={icon} size={40} color="primary" />
      </View>
      <Text variant="title" align="center" heading>{title}</Text>
      <Text color="muted" align="center">{body}</Text>
      {actionLabel ? <Button label={actionLabel} onPress={onAction} fullWidth={false} /> : null}
    </View>
  );
}

/** Error: plain explanation and a retry button. Never an error code. */
export function ErrorState({ onRetry, secondary }: { onRetry?: () => void; secondary?: React.ReactNode }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  return (
    <View accessibilityRole="alert" style={{ alignItems: 'center', gap: 12, paddingVertical: 32, paddingHorizontal: 16 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: c.divider, alignItems: 'center', justifyContent: 'center' }}>
        <Icon icon={AlertCircle} size={36} color="text3" />
      </View>
      <Text variant="title" align="center" heading>We couldn’t load this</Text>
      <Text color="muted" align="center">Check your connection and try again.</Text>
      {onRetry ? <Button label={t('common.retry')} icon={RefreshCw} onPress={onRetry} fullWidth={false} /> : null}
      {secondary}
    </View>
  );
}

/** Skeleton rows for lists and guides. Static when reduced motion is on. */
export function Skeleton({ lines = 5 }: { lines?: number }) {
  const { c } = useTheme();
  const [pulse] = useState(() => new Animated.Value(0.5));
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return;
      loop = Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]));
      loop.start();
    });
    return () => loop?.stop();
  }, [pulse]);
  return (
    <Animated.View accessibilityLabel="Loading" accessibilityRole="progressbar" style={{ opacity: pulse, gap: 18 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <View key={i} style={{ gap: 8 }}>
          <View style={{ height: 14, width: `${70 - (i % 3) * 12}%`, borderRadius: 4, backgroundColor: c.divider }} />
          <View style={{ height: 10, width: '40%', borderRadius: 4, backgroundColor: c.divider }} />
        </View>
      ))}
    </Animated.View>
  );
}

/** Offline: subtle banner; cached content still works. */
export function OfflineBanner() {
  const { t } = useTranslation();
  const { c } = useTheme();
  return (
    <View accessibilityRole="summary" accessibilityLiveRegion="polite" style={{ flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: c.divider, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 }}>
      <Icon icon={CloudOff} size={16} color="text3" />
      <Text size={13} color="text3" style={{ flex: 1 }}>{t('states.offline')}</Text>
    </View>
  );
}

/** Outdated: guide verification older than 6 months. */
export function OutdatedBanner({ lastVerified }: { lastVerified: string }) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="summary" style={{ flexDirection: 'row', gap: 10, backgroundColor: c.warningBg, borderWidth: 1, borderColor: c.warningBorder, borderRadius: 12, padding: 12 }}>
      <Icon icon={RefreshCw} size={18} color="warningBorder" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text size={14} color="warningStrongText">
          <Text size={14} weight="700" color="warningStrongText">We’re re-checking this guide. </Text>
          It was last verified over 6 months ago. Confirm details with the office.
        </Text>
        <Text size={12} color="warningText">Last verified on {lastVerified}</Text>
      </View>
    </View>
  );
}
