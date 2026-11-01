import type { LucideIcon } from 'lucide-react-native';
import React from 'react';

import { useTheme } from '@/theme/ThemeProvider';
import type { Palette } from '@/theme/tokens';

/** Lucide 2 px outline icons — the same set the designs use. Decorative by default. */
export function Icon({
  icon: I, size = 24, color = 'text', strokeWidth = 2, fill,
}: { icon: LucideIcon; size?: number; color?: keyof Palette | (string & {}); strokeWidth?: number; fill?: string }) {
  const t = useTheme();
  const c = (t.c as Record<string, string>)[color] ?? color;
  return <I size={size} color={c} strokeWidth={strokeWidth} fill={fill ?? 'none'} accessible={false} aria-hidden />;
}
