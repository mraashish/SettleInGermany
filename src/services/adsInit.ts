import { useEffect } from 'react';
import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

let started = false;

/**
 * Apps: start AdMob only after the user's choice in our consent modal, then let
 * Google UMP collect/refresh the IAB TCF signal where it is required (EEA).
 * Me › Privacy can reopen the UMP privacy options form.
 */
export function useInitAds(decided: boolean) {
  useEffect(() => {
    if (!decided || started) return;
    started = true;
    void (async () => {
      try {
        await AdsConsent.gatherConsent();
      } catch {
        /* UMP unavailable (dev build without app id) — keep non-personalised */
      }
      await mobileAds().initialize();
    })();
  }, [decided]);
}

export async function showPrivacyOptions() {
  try {
    await AdsConsent.showPrivacyOptionsForm();
  } catch {
    /* not required in this region */
  }
}
