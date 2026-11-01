import { Platform } from 'react-native';

import { usePrefs } from '@/store/prefs';
import { useInitAds } from './adsInit';
import { useEntitlement } from './purchases';

/**
 * Ad units. Empty strings render the fixed-size placeholder.
 * TODO(product owner): final ad partner list + unit IDs (HANDOFF §12).
 * Blocked categories (configure in AdMob / AdSense): payday loans, gambling,
 * unlicensed immigration agents, "guaranteed visa" offers (HANDOFF §7.6).
 */
export const AD_UNITS = {
  banner: Platform.select({ ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS, android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID }) ?? '',
  adsenseClient: process.env.EXPO_PUBLIC_ADSENSE_CLIENT ?? '',
  adsenseBannerSlot: process.env.EXPO_PUBLIC_ADSENSE_BANNER_SLOT ?? '',
  adsenseNativeSlot: process.env.EXPO_PUBLIC_ADSENSE_NATIVE_SLOT ?? '',
};

/** Ads show only on the free tier and only after a consent decision. */
export function useAdsAllowed() {
  const consent = usePrefs((s) => s.consent);
  const { premium } = useEntitlement();
  return { show: consent.decided && !premium, personalised: consent.personalisedAds };
}

/** Starts the ad SDK once consent is decided (adsInit.ts for apps, adsInit.web.ts for web). */
export function useAdsBootstrap() {
  const decided = usePrefs((s) => s.consent.decided);
  useInitAds(decided);
}
