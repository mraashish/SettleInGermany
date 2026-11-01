import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { DETag } from './GermanTerm';
import { Icon } from './Icon';
import { Text } from './Text';

/** Text field: radius 12 iOS, 4 outlined Android, 10 web. */
export function TextField({ label, hint, style, ...rest }: TextInputProps & { label: string; hint?: string }) {
  const th = useTheme();
  const { c } = th;
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text size={14} weight="600">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        maxFontSizeMultiplier={2}
        {...rest}
        style={[
          {
            minHeight: 48, borderRadius: th.shape.field, borderWidth: focus ? 2 : 1, borderColor: focus ? c.primary : c.fieldBorder,
            paddingHorizontal: focus ? 13 : 14, paddingVertical: 10, fontFamily: fonts.regular, fontSize: 16, color: c.text, backgroundColor: c.surface,
          },
          style,
        ]}
      />
      {hint ? <Text variant="caption" color="muted">{hint}</Text> : null}
    </View>
  );
}

/** Large selectable option card (Onboarding). */
export function SelectCard({
  title, sub, term, selected, onPress, minHeight = 64,
}: { title: string; sub?: string; term?: string; selected: boolean; onPress: () => void; minHeight?: number }) {
  const th = useTheme();
  const { c } = th;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight, flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10,
        paddingHorizontal: selected ? 16 : 17, borderRadius: th.platform === 'android' ? 16 : 14,
        borderWidth: selected ? 2 : 1, borderColor: selected ? c.primary : c.border,
        backgroundColor: selected ? c.primaryTint : c.surface, opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text size={17} weight={selected ? '600' : '500'}>{title}</Text>
        {term ? (
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><DETag /><Text color="muted">{term}</Text></View>
        ) : sub ? (
          <Text color={selected ? 'text3' : 'muted'}>{sub}</Text>
        ) : null}
      </View>
      {selected ? <Icon icon={Check} size={22} color="primary" strokeWidth={2.5} /> : null}
    </Pressable>
  );
}

/** Toggle row (privacy / consent settings). */
export function ToggleRow({ title, body, value, onChange, disabled }: { title: string; body?: string; value: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      accessibilityLabel={title}
      disabled={disabled}
      onPress={() => onChange?.(!value)}
      style={{ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 56, paddingVertical: 8 }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text weight="600">{title}</Text>
        {body ? <Text variant="caption" color="muted">{body}</Text> : null}
      </View>
      <View style={{ width: 52, height: 32, borderRadius: 16, padding: 3, backgroundColor: value ? c.primary : c.divider, borderWidth: value ? 0 : 2, borderColor: c.fieldBorder, opacity: disabled ? 0.6 : 1, alignItems: value ? 'flex-end' : 'flex-start', justifyContent: 'center' }}>
        <View style={{ width: value ? 26 : 20, height: value ? 26 : 20, borderRadius: 13, backgroundColor: value ? c.onPrimary : c.fieldBorder, alignItems: 'center', justifyContent: 'center' }}>
          {value ? <Icon icon={Check} size={14} color="primary" strokeWidth={3} /> : null}
        </View>
      </View>
    </Pressable>
  );
}
