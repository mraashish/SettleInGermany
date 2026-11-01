import { useSyncExternalStore } from 'react';
import { Dimensions, Platform } from 'react-native';

import { breakpoints } from '@/theme/tokens';

const subscribe = (cb: () => void) => {
  const sub = Dimensions.addEventListener('change', cb);
  return () => sub.remove();
};
const getWidth = () => Dimensions.get('window').width;
/** Static HTML is rendered at width 0 (mobile layout); React uses this while hydrating. */
const getServerWidth = () => 0;

/**
 * HANDOFF §3: web < 600 = app layout + tab bar; ≥ 1024 desktop shell; between = two columns where useful.
 * useSyncExternalStore gives every hydrating component the server width (no hydration
 * mismatch) and fresh mounts the real width.
 */
export function useLayout() {
  const width = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const web = Platform.OS === 'web';
  return {
    width,
    web,
    mobileWeb: web && width < breakpoints.mobile,
    tabletWeb: web && width >= breakpoints.mobile && width < breakpoints.desktop,
    desktop: web && width >= breakpoints.desktop,
    /** Web at ≥ 600 px uses the site header instead of the bottom tab bar. */
    webWide: web && width >= breakpoints.mobile,
  };
}
