import React from 'react';
import { Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAdsAllowed } from '@/services/ads';
import { useTheme } from '@/theme/ThemeProvider';
import { NativeAd } from './NativeAd';
import { Text } from './Text';

export type AdFormat = 'banner' | 'native';

/** Fixed sizes so nothing shifts when an ad fills (HANDOFF §7.6). */
export const AD_HEIGHT: Record<AdFormat, number> = { banner: 64, native: 104 };

/**
 * AdSlot — free tier only, labelled "Ad", fixed size, and nothing renders before a
 * consent decision. Never place in AI screens, paywall, onboarding, emergency or
 * document-date screens.
 */
export function AdSlot({ format, placement }: { format: AdFormat; placement: string }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const t2 = useTheme();
  const { show, personalised } = useAdsAllowed();
  if (!show) return null;
  const h = AD_HEIGHT[format];
  return (
    <View
      accessibilityRole={Platform.OS === 'web' ? ('complementary' as never) : undefined}
      accessibilityLabel={t('common.advertisement')}
      style={{
        height: h, borderRadius: format === 'native' ? t2.shape.card : 10, borderWidth: 1,
        borderStyle: format === 'banner' ? 'dashed' : 'solid',
        borderColor: format === 'banner' ? c.borderStrong : c.border,
        backgroundColor: format === 'banner' ? c.adBg : c.surface, overflow: 'hidden',
      }}
    >
      <NativeAd format={format} placement={placement} personalised={personalised} height={h} />
      <View style={{ position: 'absolute', top: 6, left: 8, borderWidth: 1, borderColor: c.borderStrong, borderRadius: 4, paddingHorizontal: 4, backgroundColor: c.surface }}>
        <Text size={10} lineHeight={14} weight="700" color="muted">{t('common.ad')}</Text>
      </View>
    </View>
  );
}
