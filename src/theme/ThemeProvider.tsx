import React, { createContext, useContext, useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { usePrefs } from '@/store/prefs';
import { type ColorScheme, type Palette, palettes, platformKind, shapes } from './tokens';

export type AppearancePref = 'system' | 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  c: Palette;
  platform: typeof platformKind;
  shape: (typeof shapes)[keyof typeof shapes];
  /** Current UI language uses Devanagari script. */
  devanagari: boolean;
}

const ThemeContext = createContext<Theme | null>(null);

/**
 * Web dark mode is not designed yet (HANDOFF §3): web is forced to light, but the
 * switch stays in code — flip WEB_DARK_ENABLED once designs land.
 */
export const WEB_DARK_ENABLED = false;

export function resolveScheme(pref: AppearancePref, system: ColorScheme | null | undefined): ColorScheme {
  if (Platform.OS === 'web' && !WEB_DARK_ENABLED) return 'light';
  if (pref === 'system') return system === 'dark' ? 'dark' : 'light';
  return pref;
}

export function ThemeProvider({
  children,
  forceScheme,
}: {
  children: React.ReactNode;
  /** Used by /dev/gallery to render both schemes side by side. */
  forceScheme?: ColorScheme;
}) {
  const system = useColorScheme();
  const { appearance, language } = usePrefs();
  const scheme = forceScheme ?? resolveScheme(appearance, system);
  const value = useMemo<Theme>(
    () => ({
      scheme,
      c: palettes[scheme],
      platform: platformKind,
      shape: shapes[platformKind],
      devanagari: language === 'ne' || language === 'hi',
    }),
    [scheme, language],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const t = useContext(ThemeContext);
  if (!t) throw new Error('useTheme must be used inside <ThemeProvider>');
  return t;
}
