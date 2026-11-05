import { router } from 'expo-router';
import { ArrowLeft, ChevronLeft, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Text } from './Text';

export interface AppBarAction { icon: LucideIcon; label: string; onPress: () => void; badge?: boolean }
export interface BackTarget { label: string; href?: string }

export function goBack(back?: BackTarget) {
  if (router.canGoBack()) router.back();
  else if (back?.href) router.replace(back.href as never);
  else router.replace('/');
}

/**
 * AppBar (AppBar.dc.html)
 *  iOS: 48 px row with "‹ Back" text link, centred small title, optional large 32/38 title.
 *  Android: 64 px top app bar, ← arrow, 22 px title; large variant 28/36 medium.
 */
export function AppBar({
  title, back, large = true, actions = [], below,
}: { title: string; back?: BackTarget; large?: boolean; actions?: AppBarAction[]; below?: React.ReactNode }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  if (th.platform === 'android') {
    return (
      <View style={{ backgroundColor: c.ground, paddingHorizontal: 4 }}>
        <View style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {back ? (
            <Pressable accessibilityRole="button" accessibilityLabel={t('nav.backTo', { name: back.label })} onPress={() => goBack(back)}
              style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}>
              <Icon icon={ArrowLeft} color="text" />
            </Pressable>
          ) : null}
          <Text size={22} lineHeight={28} weight="500" numberOfLines={1} maxFontSizeMultiplier={1.4} style={{ flex: 1, minWidth: 0, paddingLeft: back ? 0 : 12 }} heading={large ? undefined : 1}>
            {large ? '' : title}
          </Text>
          {actions.map((a) => <IconButton key={a.label} icon={a.icon} label={a.label} onPress={a.onPress} color="text" badge={a.badge} />)}
        </View>
        {large ? <Text size={28} lineHeight={36} weight="500" style={{ paddingHorizontal: 12, paddingBottom: 8 }} heading>{title}</Text> : null}
        {below}
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: c.ground, paddingHorizontal: 8, borderBottomWidth: large && !below ? 0 : 1, borderColor: c.border }}>
      {/* Three columns that never overlap: the back link and the actions keep their own space,
          the small title gets the middle and is truncated instead of running into the back link. */}
      <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, minWidth: 0, flexDirection: 'row' }}>
          {back ? (
            <Pressable accessibilityRole="button" accessibilityLabel={t('nav.backTo', { name: back.label })} onPress={() => goBack(back)}
              style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
              <Icon icon={ChevronLeft} size={28} color="primary" />
              <Text size={17} color="primary" numberOfLines={1} maxFontSizeMultiplier={1.4} style={{ flexShrink: 1 }}>{back.label}</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={{ flex: 1.6, minWidth: 0, alignItems: 'center' }}>
          {large ? null : (
            <Text size={17} weight="600" align="center" numberOfLines={1} maxFontSizeMultiplier={1.4} heading={1}>{title}</Text>
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', justifyContent: 'flex-end' }}>
          {actions.map((a) => <IconButton key={a.label} icon={a.icon} label={a.label} onPress={a.onPress} badge={a.badge} />)}
        </View>
      </View>
      {large ? <Text variant="largeTitle" style={{ paddingHorizontal: 8, paddingBottom: 10, letterSpacing: -0.6 }} heading={1}>{title}</Text> : null}
      {below ? <View style={{ paddingHorizontal: 8, paddingBottom: 12 }}>{below}</View> : null}
    </View>
  );
}
