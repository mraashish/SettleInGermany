import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

/** Stage ring: saffron on the teal hero, teal on surfaces. */
export function ProgressRing({
  value, total, size = 56, onHero, label,
}: { value: number; total: number; size?: number; onHero?: boolean; label?: string }) {
  const { c } = useTheme();
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? value / total : 0;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: total, now: value }}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={onHero ? c.heroTrack : c.divider} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={onHero ? c.accent : c.primary} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ * (1 - pct)}
        />
      </Svg>
      <Text size={size > 50 ? 14 : 12} weight="700" color={onHero ? c.heroText : c.text}>
        {value}/{total}
      </Text>
    </View>
  );
}

/** Work-limit bar: amber + warning text near the limit. */
export function ProgressBar({ value, max, label, warnAt = 0.8 }: { value: number; max: number; label: string; warnAt?: number }) {
  const { c } = useTheme();
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const warn = pct >= warnAt;
  return (
    <View style={{ gap: 6 }}>
      <Text variant="caption" weight={warn ? '600' : '400'} color={warn ? 'warningText' : 'text3'}>{label}</Text>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max, now: value }}
        style={{ height: 12, borderRadius: 999, backgroundColor: c.divider, overflow: 'hidden' }}
      >
        <View style={{ width: `${pct * 100}%`, height: 12, borderRadius: 999, backgroundColor: warn ? c.warningBorder : c.primary }} />
      </View>
    </View>
  );
}
