import { Loader2, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'destructive' | 'premium';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: LucideIcon;
  /** Large = 52 (onboarding CTAs), default 48, text = 44. */
  size?: 'large' | 'default';
  fullWidth?: boolean;
  style?: ViewStyle;
}

/**
 * Button (Library.dc.html). Radius: iOS 12, Android 999 (pill), web 12.
 * Labels may wrap to two lines (Nepali/Hindi run 20–40 % longer).
 */
export function Button({ label, variant = 'primary', loading, icon, size = 'default', fullWidth = true, style, disabled, ...rest }: ButtonProps) {
  const t = useTheme();
  const { c } = t;
  const v = {
    primary: { bg: c.primary, fg: c.onPrimary, border: 'transparent' },
    secondary: { bg: 'transparent', fg: c.primary, border: c.primary },
    text: { bg: 'transparent', fg: c.primary, border: 'transparent' },
    destructive: { bg: 'transparent', fg: c.danger, border: c.danger },
    premium: { bg: c.accent, fg: c.onAccent, border: 'transparent' },
  }[variant];
  const minHeight = variant === 'text' ? 44 : size === 'large' ? 52 : 48;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: !!loading, disabled: !!disabled }}
      disabled={disabled || loading}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight,
          borderRadius: t.shape.button,
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border === 'transparent' ? 0 : 1.5,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: variant === 'text' ? 8 : 18,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={v.fg} size="small" /> : icon ? <Icon icon={icon} size={20} color={v.fg} /> : null}
        <Text
          weight={variant === 'premium' ? '700' : '600'}
          size={size === 'large' ? 17 : 15}
          lineHeight={size === 'large' ? 22 : 20}
          color={v.fg}
          align="center"
          numberOfLines={2}
        >
          {loading ? `${label}` : label}
        </Text>
      </View>
    </Pressable>
  );
}

export const LoadingIcon = Loader2;

const styles = StyleSheet.create({
  base: { justifyContent: 'center', alignItems: 'center', paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
});
