import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, type PressableProps, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { touchTarget } from '@/theme/tokens';
import { Icon } from './Icon';

export function IconButton({
  icon, label, color = 'primary', filled, badge, ...rest
}: Omit<PressableProps, 'children'> & { icon: LucideIcon; label: string; color?: string; filled?: boolean; badge?: boolean }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      {...rest}
      style={({ pressed }) => ({
        width: touchTarget,
        height: touchTarget,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: filled ? t.c.surface : 'transparent',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon icon={icon} color={color} />
      {badge ? (
        <View style={{ position: 'absolute', top: touchTarget / 2 - 13, right: touchTarget / 2 - 12, width: 8, height: 8, borderRadius: 4, backgroundColor: t.c.danger }} />
      ) : null}
    </Pressable>
  );
}
