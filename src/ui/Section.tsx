import { Link } from 'expo-router';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

export function SectionTitle({ children, action }: { children: string; action?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <Text size={17} lineHeight={24} weight="700" heading style={{ flex: 1 }}>{children}</Text>
      {action}
    </View>
  );
}

export function Overline({ children }: { children: string }) {
  return <Text size={13} weight="700" color="muted" uppercase heading>{children}</Text>;
}

/** Navigational list row (Me, Tools, Safety…). */
export function LinkRow({
  href, onPress, title, sub, icon, first, right, external,
}: { href?: string; onPress?: () => void; title: string; sub?: string; icon?: LucideIcon; first?: boolean; right?: React.ReactNode; external?: boolean }) {
  const { c } = useTheme();
  const inner = (
    <Pressable accessibilityRole={href ? 'link' : 'button'} onPress={onPress}
      style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: first ? 0 : 1, borderColor: c.divider }}>
      {icon ? (
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon icon={icon} size={20} color="primary" />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text size={15} weight="600">{title}{external ? ' ↗' : ''}</Text>
        {sub ? <Text variant="caption" color="muted">{sub}</Text> : null}
      </View>
      {right ?? <Icon icon={ChevronRight} size={20} color="muted" />}
    </Pressable>
  );
  return href ? <Link href={href as never} asChild>{inner}</Link> : inner;
}
