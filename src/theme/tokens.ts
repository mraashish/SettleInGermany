/**
 * "Calm Ledger" design tokens — copied from HANDOFF §5 and the `k` colour table in
 * design-source/*.dc.html. Do not edit values without updating the design source.
 */
import { Platform } from 'react-native';

export type ColorScheme = 'light' | 'dark';

/** Semantic palette (HANDOFF §5). */
const light = {
  ground: '#F6F4F0',
  surface: '#FFFFFF',
  border: '#E4E0D8',
  divider: '#EFECE6',
  borderStrong: '#CFC9BE',
  fieldBorder: '#A8A196',
  text: '#1F1D1A',
  text2: '#3B3833',
  text3: '#4A453E',
  muted: '#6B655C',
  primary: '#0F5C63',
  primaryPressed: '#0A4449',
  onPrimary: '#FFFFFF',
  primaryTint: '#E6F0F0',
  primaryTint2: '#D3E6E6',
  accent: '#E8A33D',
  onAccent: '#2A1A00',
  accentBg: '#FDF6EA',
  warningText: '#8A5A12',
  warningBg: '#FBF1DF',
  warningBorder: '#B7791F',
  warningStrongText: '#5C3D08',
  danger: '#B42318',
  dangerBg: '#FDECEA',
  successText: '#24653F',
  successFill: '#2E7D4F',
  successBg: '#EAF4EE',
  adBg: '#FBFAF7',
  scrim: 'rgba(31,29,26,0.45)',
  heroBg: '#0F5C63',
  heroText: '#FFFFFF',
  heroSub: '#D3E6E6',
  heroTrack: 'rgba(255,255,255,0.22)',
  shadow: 'rgba(31,29,26,0.12)',
};

const dark: typeof light = {
  ground: '#121614',
  surface: '#1A2221',
  border: '#2C3634',
  divider: '#252D2C',
  borderStrong: '#4A5755',
  fieldBorder: '#6F7B79',
  text: '#ECEAE5',
  text2: '#C9CFCD',
  text3: '#C2C8C6',
  muted: '#9AA5A3',
  primary: '#5CC8C2',
  primaryPressed: '#8EDDD8',
  onPrimary: '#1A2221',
  primaryTint: '#173332',
  primaryTint2: '#1F3D3B',
  accent: '#F2B85C',
  onAccent: '#2A1A00',
  accentBg: '#2A2418',
  warningText: '#E0C27A',
  warningBg: '#33291A',
  warningBorder: '#C9A15A',
  warningStrongText: '#E0C27A',
  danger: '#F0A49B',
  dangerBg: '#3A1F1C',
  successText: '#7FD3A0',
  successFill: '#7FD3A0',
  successBg: '#1D3327',
  adBg: '#161C1B',
  scrim: 'rgba(0,0,0,0.6)',
  heroBg: '#173332',
  heroText: '#ECEAE5',
  heroSub: '#B5D9D6',
  heroTrack: '#2C4746',
  shadow: 'rgba(0,0,0,0.4)',
};

export const palettes = { light, dark } as const;
export type Palette = typeof light;

/**
 * Raw light→dark hex map (the `k` object from design-source). Use when porting a
 * design literally: `hex('#0F5C63', scheme)`.
 */
export const hexMap: Record<string, string> = {
  '#F6F4F0': '#121614', '#FFFFFF': '#1A2221', '#1F1D1A': '#ECEAE5', '#3B3833': '#C9CFCD',
  '#4A453E': '#C2C8C6', '#6B655C': '#9AA5A3', '#E4E0D8': '#2C3634', '#EFECE6': '#252D2C',
  '#CFC9BE': '#4A5755', '#A8A196': '#6F7B79', '#E9E5DD': '#252D2C', '#EDE9E1': '#252D2C',
  '#0F5C63': '#5CC8C2', '#0A4449': '#8EDDD8', '#E6F0F0': '#173332', '#CFE3E3': '#1F4442',
  '#D3E6E6': '#1F3D3B', '#E8A33D': '#F2B85C', '#2A1A00': '#2A1A00', '#FBF1DF': '#33291A',
  '#8A5A12': '#E0C27A', '#B7791F': '#C9A15A', '#FDF6EA': '#2A2418', '#FBEFD9': '#33291A',
  '#5C3D08': '#E0C27A', '#5C4A2A': '#D8C8A8', '#FDECEA': '#3A1F1C', '#B42318': '#F0A49B',
  '#EAF4EE': '#1D3327', '#24653F': '#7FD3A0', '#2E7D4F': '#7FD3A0', '#F3F8F8': '#16201F',
  '#FBFAF7': '#161C1B', '#000000': '#F2F2F2', '#FDF3E2': '#33291A', '#55524C': '#000000',
  '#5E8C8F': '#7FB3B5',
};
export const hex = (light: string, scheme: ColorScheme) =>
  scheme === 'dark' ? (hexMap[light.toUpperCase()] ?? light) : light;

/** 4-pt spacing scale. */
export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48, screen: 16 } as const;

export const radius = { input: 8, button: 12, iosCard: 16, androidCard: 20, pill: 999 } as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  devaRegular: 'NotoSansDevanagari_400Regular',
  devaMedium: 'NotoSansDevanagari_500Medium',
  devaSemibold: 'NotoSansDevanagari_600SemiBold',
  devaBold: 'NotoSansDevanagari_700Bold',
} as const;

export type Weight = '400' | '500' | '600' | '700';

/** Type scale: size / line height (HANDOFF §5). */
export const type = {
  display: { fontSize: 28, lineHeight: 34, weight: '700' as Weight },
  largeTitle: { fontSize: 32, lineHeight: 38, weight: '700' as Weight },
  title: { fontSize: 20, lineHeight: 28, weight: '700' as Weight },
  heading: { fontSize: 17, lineHeight: 24, weight: '600' as Weight },
  body: Platform.OS === 'web'
    ? { fontSize: 16, lineHeight: 24, weight: '400' as Weight }
    : { fontSize: 15, lineHeight: 22, weight: '400' as Weight },
  bodySmall: { fontSize: 14, lineHeight: 20, weight: '400' as Weight },
  caption: { fontSize: 13, lineHeight: 19, weight: '400' as Weight },
  micro: { fontSize: 11, lineHeight: 15, weight: '700' as Weight },
} as const;
export type TypeVariant = keyof typeof type;

/** Devanagari scripts get ~15 % more line height. */
export const DEVANAGARI_LINE_FACTOR = 1.15;

export const elevation2 = {
  shadowColor: '#1F1D1A',
  shadowOpacity: 0.12,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
} as const;

/** Minimum touch target per platform (§5). */
export const touchTarget = Platform.select({ ios: 44, android: 48, default: 44 }) as number;

export type PlatformKind = 'ios' | 'android' | 'web';
export const platformKind: PlatformKind =
  Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

/** Per-platform shapes (HANDOFF §3 table). */
export const shapes = {
  ios: { button: 12, card: 16, chip: 999, field: 12, tabBar: 84 },
  android: { button: 999, card: 20, chip: 8, field: 4, tabBar: 80 },
  web: { button: 12, card: 16, chip: 999, field: 10, tabBar: 84 },
} as const;

export const breakpoints = { mobile: 600, desktop: 1024, readingColumn: 720 } as const;
