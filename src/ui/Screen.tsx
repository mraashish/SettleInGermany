import { Head } from 'expo-router/head';
import React from 'react';
import { Platform, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useOnline } from '@/services/network';
import { useTheme } from '@/theme/ThemeProvider';
import { AppBar, type AppBarAction, type BackTarget } from './AppBar';
import { OfflineBanner } from './States';
import { type Crumb, WebShell } from './WebShell';

export interface ScreenProps {
  title: string;
  /** Back target (native app bar). Omit on tab roots. */
  back?: BackTarget;
  large?: boolean;
  actions?: AppBarAction[];
  /** Rendered under the app bar (e.g. stage switcher). */
  headerBelow?: React.ReactNode;
  /** Replaces the default AppBar entirely (Home has its own greeting header). */
  customHeader?: React.ReactNode;
  children: React.ReactNode;
  /** Web: breadcrumbs, intro, side column. */
  crumbs?: Crumb[];
  intro?: string;
  ai?: boolean;
  aside?: React.ReactNode;
  plainMain?: boolean;
  /** Web <head> description for SEO. */
  description?: string;
  /** Hide the title on web (screen renders its own). */
  hideWebTitle?: boolean;
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Fixed footer area on native (sticky CTA). */
  footer?: React.ReactNode;
  gap?: number;
}

/**
 * One wrapper, three looks: iOS / Android app bar + scroll view on apps,
 * WebShell (site header, breadcrumbs, columns, footer) on web.
 */
export function Screen({
  title, back, large = true, actions, headerBelow, customHeader, children, crumbs, intro, ai, aside, plainMain,
  description, hideWebTitle, scroll = true, onRefresh, refreshing, footer, gap = 16,
}: ScreenProps) {
  const { c } = useTheme();
  const { t } = useTranslation();
  const online = useOnline();
  const body = (
    <>
      {!online ? <OfflineBanner /> : null}
      {children}
    </>
  );
  if (Platform.OS === 'web') {
    return (
      <>
        <Head>
          <title>{`${title} · ${t('app.name')}`}</title>
          {description ? <meta name="description" content={description} /> : null}
        </Head>
        <WebShell crumbs={crumbs} title={hideWebTitle ? undefined : title} intro={intro} ai={ai} aside={aside} plainMain={plainMain}>
          {headerBelow ? <View style={{ marginBottom: 16 }}>{headerBelow}</View> : null}
          <View style={{ gap }}>{body}</View>
          {footer ? <View style={{ marginTop: 16 }}>{footer}</View> : null}
        </WebShell>
      </>
    );
  }
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.ground }}>
      {customHeader ?? <AppBar title={title} back={back} large={large} actions={actions} below={headerBelow} />}
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 32, gap }}
          keyboardShouldPersistTaps="handled"
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={c.primary} /> : undefined}
        >
          {body}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: 16, gap }}>{body}</View>
      )}
      {footer ? <View style={{ padding: 16, borderTopWidth: 1, borderColor: c.border, backgroundColor: c.ground }}>{footer}</View> : null}
    </SafeAreaView>
  );
}
