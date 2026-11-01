import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

/** Stage switcher: iOS/web segmented control; Android underlined tabs (RoadmapScreen). */
export function StageSwitcher<T extends string>({
  options, value, onChange, label,
}: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  const th = useTheme();
  const { c } = th;
  if (th.platform === 'android') {
    return (
      <View accessibilityRole="tablist" accessibilityLabel={label} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: c.border }}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <Pressable key={o.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => onChange(o.id)}
              style={{ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: on ? c.primary : 'transparent' }}>
              <Text size={14} weight={on ? '700' : '500'} color={on ? 'primary' : 'muted'} align="center">{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={{ flexDirection: 'row', backgroundColor: th.scheme === 'dark' ? '#252D2C' : '#E9E5DD', borderRadius: 10, padding: 2 }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable key={o.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => onChange(o.id)}
            style={{
              flex: 1, minHeight: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
              backgroundColor: on ? c.surface : 'transparent',
              ...(on ? { shadowColor: '#1F1D1A', shadowOpacity: 0.15, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : {}),
            }}>
            <Text size={13} weight={on ? '700' : '500'} color={on ? 'text' : 'text2'} align="center">{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
