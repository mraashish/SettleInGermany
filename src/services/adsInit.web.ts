import { useEffect } from 'react';

import { prefsStore } from '@/store/prefs';
import { AD_UNITS } from './ads';

let injected = false;

/**
 * Web: AdSense is injected only after consent. Non-personalised ads when the user
 * rejected personalisation. TODO(product owner): replace our banner with a certified
 * IAB TCF CMP styled like WebConsent.dc.html before launch (HANDOFF §2).
 */
export function useInitAds(decided: boolean) {
  useEffect(() => {
    if (!decided || injected || !AD_UNITS.adsenseClient || typeof document === 'undefined') return;
    injected = true;
    const w = window as any;
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.requestNonPersonalizedAds = prefsStore.get().consent.personalisedAds ? 0 : 1;
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_UNITS.adsenseClient}`;
    document.head.appendChild(s);
  }, [decided]);
}

export async function showPrivacyOptions() {
  /* handled by our own consent settings on web */
}
