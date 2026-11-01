import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { AD_UNITS } from '@/services/ads';
import { AdPlaceholder } from './NativeAd.shared';

/**
 * Apps: AdMob. Native-card placements use a fixed-height medium banner until the
 * native-ad template is designed with the final ad partner (HANDOFF §12).
 */
export function NativeAd({ format, personalised, height }: { format: 'banner' | 'native'; placement: string; personalised: boolean; height: number }) {
  const unit = __DEV__ ? TestIds.ADAPTIVE_BANNER : AD_UNITS.banner;
  if (!unit) return <AdPlaceholder format={format} />;
  return (
    <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
      <BannerAd
        unitId={unit}
        size={format === 'banner' ? BannerAdSize.BANNER : BannerAdSize.LARGE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: !personalised }}
      />
    </View>
  );
}
