import { router } from 'expo-router';
import { BookOpen, Calculator, House, type LucideIcon, Sparkles, User } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

export type TabId = 'home' | 'guides' | 'assist' | 'tools' | 'me';

export const TAB_HREF: Record<TabId, string> = {
  home: '/', guides: '/guides', assist: '/assist', tools: '/tools', me: '/me',
};

const ICONS: Record<TabId, LucideIcon> = { home: House, guides: BookOpen, assist: Sparkles, tools: Calculator, me: User };

/**
 * TabBar (TabBar.dc.html): 5 tabs, Assist is a raised saffron circle in the centre.
 *  iOS / mobile web: 84 px, icons + labels, no pill. Android: 80 px, Material 3 active pill.
 */
export function TabBar({ active, variant }: { active: TabId | null; variant?: 'ios' | 'android' }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const insets = useSafeAreaInsets();
  const android = (variant ?? (th.platform === 'android' ? 'android' : 'ios')) === 'android';
  const tabs: TabId[] = ['home', 'guides', 'assist', 'tools', 'me'];
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={t('nav.main')}
      style={{
        flexDirection: 'row', backgroundColor: c.surface, borderTopWidth: 1, borderColor: c.border,
        minHeight: (android ? 80 : 84) - (insets.bottom > 0 ? 34 : 0) + insets.bottom,
        paddingTop: android ? 12 : 6, paddingBottom: Math.max(insets.bottom, android ? 12 : 8), paddingHorizontal: 4,
      }}
    >
      {tabs.map((id) => {
        const on = id === active;
        const label = t(`nav.${id}`);
        const go = () => router.navigate(TAB_HREF[id] as never);
        if (id === 'assist') {
          return (
            <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={label} onPress={go}
              style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <View style={{
                width: 52, height: 52, marginTop: -20, borderRadius: 999, backgroundColor: c.accent, borderWidth: 3, borderColor: c.surface,
                alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4,
              }}>
                <Icon icon={ICONS.assist} color="onAccent" />
              </View>
              <Text size={android ? 12 : 11} lineHeight={14} weight={on ? '700' : '600'} align="center" numberOfLines={2}>{label}</Text>
            </Pressable>
          );
        }
        return (
          <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={label} onPress={go}
            style={{ flex: 1, alignItems: 'center', gap: android ? 4 : 2, minHeight: 48 }}>
            <View style={{ paddingVertical: 4, paddingHorizontal: 20, borderRadius: 999, backgroundColor: on && android ? c.primaryTint : 'transparent' }}>
              <Icon icon={ICONS[id]} color={on ? 'primary' : 'muted'} />
            </View>
            <Text size={android ? 12 : 11} lineHeight={14} weight={on ? '700' : '500'} color={on ? 'primary' : 'muted'} align="center" numberOfLines={2}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
