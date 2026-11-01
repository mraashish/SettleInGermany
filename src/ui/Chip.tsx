import React from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

/** Filter chip: pills on iOS/web, radius 8 on Android. */
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const t = useTheme();
  const { c } = t;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={{
        minHeight: t.platform === 'android' ? 32 : 36,
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: t.shape.chip,
        borderWidth: 1,
        borderColor: selected ? c.primary : c.borderStrong,
        backgroundColor: selected ? c.primary : c.surface,
      }}
    >
      <Text size={14} lineHeight={18} weight={selected ? '600' : '500'} color={selected ? c.onPrimary : c.text}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Small status pill e.g. "Updated", "Premium", "Lowest fees". */
export function Pill({ label, tone = 'tint', center }: { label: string; tone?: 'tint' | 'accent' | 'neutral' | 'success'; center?: boolean }) {
  const { c } = useTheme();
  const m = {
    tint: [c.primaryTint, c.primary],
    accent: [c.accent, c.onAccent],
    neutral: [c.divider, c.text3],
    success: [c.successBg, c.successText],
  }[tone];
  return (
    <Text
      size={11}
      lineHeight={16}
      weight="700"
      color={m[1]}
      style={{ backgroundColor: m[0], borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1, overflow: 'hidden', alignSelf: center ? 'center' : 'flex-start' }}
    >
      {label}
    </Text>
  );
}
