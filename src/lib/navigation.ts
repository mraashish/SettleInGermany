import { Platform } from 'react-native';
import type { TabId } from '@/ui/TabBar';

/** Which tab is active for a path, or null to hide the tab bar (onboarding, capture, paywall…). */
export function tabForPath(path: string): TabId | null {
  if (path.startsWith('/onboarding') || path.startsWith('/premium') || (path === '/assist/scan' && Platform.OS !== 'web') || path.startsWith('/dev')) return null;
  if (path === '/' || path.startsWith('/roadmap') || path.startsWith('/alerts') || path.startsWith('/search')) return 'home';
  if (path.startsWith('/guides')) return 'guides';
  if (path.startsWith('/assist')) return 'assist';
  if (path.startsWith('/tools')) return 'tools';
  return 'me';
}
