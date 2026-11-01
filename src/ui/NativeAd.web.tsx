import React, { useEffect } from 'react';
import { View } from 'react-native';

import { AD_UNITS } from '@/services/ads';
import { AdPlaceholder } from './NativeAd.shared';

/** Web: AdSense slot (script is injected by services/ads.web after consent). */
export function NativeAd({ format, height }: { format: 'banner' | 'native'; placement: string; personalised: boolean; height: number }) {
  const client = AD_UNITS.adsenseClient;
  useEffect(() => {
    if (!client) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* ad blocked — slot keeps its fixed size */
    }
  }, [client]);
  if (!client) return <AdPlaceholder format={format} />;
  return (
    <View style={{ height }}>
      {React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block', height },
        'data-ad-client': client,
        'data-ad-slot': format === 'banner' ? AD_UNITS.adsenseBannerSlot : AD_UNITS.adsenseNativeSlot,
      })}
    </View>
  );
}
