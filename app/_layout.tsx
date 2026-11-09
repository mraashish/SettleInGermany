import { applySavedLanguage } from '@/i18n';

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  NotoSansDevanagari_400Regular, NotoSansDevanagari_500Medium, NotoSansDevanagari_600SemiBold, NotoSansDevanagari_700Bold,
} from '@expo-google-fonts/noto-sans-devanagari';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useContentSync } from '@/content/sync';
import { ConsentHost } from '@/features/consent/ConsentHost';
import { useNotificationLinks } from '@/services/notifications';
import { tabForPath } from '@/lib/navigation';
import { CONTENT_VERSION } from '@/content/client';
import { persister, queryClient } from '@/lib/queryClient';
import { useLayout } from '@/lib/useLayout';
import { useAdsBootstrap } from '@/services/ads';
import { configurePurchases } from '@/services/purchases';
import { prefsStore, usePrefs } from '@/store/prefs';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { TabBar } from '@/ui/TabBar';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export { ErrorBoundary } from '@/features/states/RouteErrorBoundary';

function Shell() {
  const t = useTheme();
  const path = usePathname();
  const onboarded = usePrefs((s) => s.onboarded);
  const { webWide } = useLayout();
  useAdsBootstrap();
  useContentSync();
  useNotificationLinks();

  useEffect(() => {
    configurePurchases();
    applySavedLanguage();
  }, []);

  // First launch → onboarding. On web only the app home redirects, so public guide
  // pages stay directly reachable from search engines.
  useEffect(() => {
    // Read the store directly: during web hydration the hook still returns the server snapshot.
    if (prefsStore.get().onboarded || path.startsWith('/onboarding') || path.startsWith('/dev')) return;
    if (Platform.OS !== 'web' || path === '/') router.replace('/onboarding/1');
  }, [onboarded, path]);

  const tab = tabForPath(path);
  const showTabs = tab !== null && (Platform.OS !== 'web' || !webWide);
  return (
    <View style={{ flex: 1, backgroundColor: t.c.ground }}>
      <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.c.ground }, animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default' }}>
          <Stack.Screen name="premium" options={{ presentation: Platform.OS === 'ios' ? 'formSheet' : 'fullScreenModal', sheetGrabberVisible: true }} />
          <Stack.Screen name="me/reminders/new" options={{ presentation: Platform.OS === 'ios' ? 'formSheet' : 'transparentModal', sheetGrabberVisible: true, sheetAllowedDetents: [0.75, 1] }} />
          <Stack.Screen name="assist/scan/index" options={{ presentation: 'fullScreenModal', gestureEnabled: true }} />
        </Stack>
      </View>
      {showTabs ? <TabBar active={tab} variant={Platform.OS === 'web' ? 'ios' : undefined} /> : null}
      <ConsentHost />
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
    NotoSansDevanagari_400Regular, NotoSansDevanagari_500Medium, NotoSansDevanagari_600SemiBold, NotoSansDevanagari_700Bold,
  });
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error && Platform.OS !== 'web') return null;
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 * 21, buster: CONTENT_VERSION }}>
        <ThemeProvider>
          <Shell />
        </ThemeProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
