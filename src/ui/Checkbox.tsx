import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { touchTarget } from '@/theme/tokens';
import { Icon } from './Icon';

/** 24 px box (radius 7) inside a full touch target. Success fill when checked. */
export function Checkbox({
  checked, onChange, label, tone = 'default',
}: { checked: boolean; onChange?: (v: boolean) => void; label: string; tone?: 'default' | 'danger' | 'muted' }) {
  const { c } = useTheme();
  const border = checked ? c.successFill : tone === 'danger' ? c.danger : tone === 'muted' ? c.borderStrong : c.fieldBorder;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange?.(!checked)}
      hitSlop={10}
      style={{ width: touchTarget - 16, minHeight: 28, alignItems: 'flex-start' }}
    >
      <View
        style={{
          width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: border,
          backgroundColor: checked ? c.successFill : 'transparent', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {checked ? <Icon icon={Check} size={16} color={c.onPrimary === '#FFFFFF' ? '#FFFFFF' : c.ground} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}
