import React from 'react';
import { Pressable, type PressableProps, View, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

/** Card: radius 16 iOS / 20 Android / 16 web; level-1 elevation = 1 px border. */
export function Card({ style, padded = true, ...rest }: ViewProps & { padded?: boolean }) {
  const t = useTheme();
  return (
    <View
      {...rest}
      style={[
        { backgroundColor: t.c.surface, borderColor: t.c.border, borderWidth: 1, borderRadius: t.shape.card, padding: padded ? 16 : 0 },
        style,
      ]}
    />
  );
}

export function PressableCard({ style, ...rest }: PressableProps & { style?: ViewStyle }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="link"
      {...rest}
      // Static style: Link `asChild` does not forward function styles on web.
      style={[
        {
          backgroundColor: t.c.surface, borderColor: t.c.border, borderWidth: 1, borderRadius: t.shape.card,
          paddingHorizontal: 16, paddingVertical: 14,
        },
        style,
      ]}
    />
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  const { c } = useTheme();
  return <View style={[{ height: 1, backgroundColor: c.divider }, style]} />;
}
