import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

/** Placeholder matching Library.dc.html (no ad unit configured / dev gallery). */
export function AdPlaceholder({ format }: { format: 'banner' | 'native' }) {
  const { c } = useTheme();
  if (format === 'banner') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="caption" color="muted">[Banner ad]</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingTop: 16 }}>
      <View style={{ width: 72, height: 72, borderRadius: 10, backgroundColor: c.divider }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text size={15} weight="600">[Native ad title]</Text>
        <Text variant="caption" color="muted">[Advertiser · one line]</Text>
      </View>
    </View>
  );
}
