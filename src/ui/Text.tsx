import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { DEVANAGARI_LINE_FACTOR, fonts, type Palette, type TypeVariant, type Weight, type as typeScale } from '@/theme/tokens';

const latin: Record<Weight, string> = { '400': fonts.regular, '500': fonts.medium, '600': fonts.semibold, '700': fonts.bold };
const deva: Record<Weight, string> = { '400': fonts.devaRegular, '500': fonts.devaMedium, '600': fonts.devaSemibold, '700': fonts.devaBold };

const DEVANAGARI_RE = /[ऀ-ॿ]/;

export interface TextProps extends RNTextProps {
  variant?: TypeVariant;
  weight?: Weight;
  color?: keyof Palette | (string & {});
  size?: number;
  lineHeight?: number;
  align?: TextStyle['textAlign'];
  /** Force Devanagari font (e.g. a "नेपाली" label inside English UI). Auto-detected for plain strings. */
  devanagari?: boolean;
  uppercase?: boolean;
  /** Heading for screen readers. `true` = level 2; pass 1–4 for a specific level (web h1–h4). */
  heading?: boolean | 1 | 2 | 3 | 4;
  /** BCP-47 language of this text (web `lang` attribute; e.g. "de" for German terms). */
  lang?: string;
}

export function fontFor(weight: Weight, devanagari: boolean) {
  return (devanagari ? deva : latin)[weight];
}

export function Text({
  variant = 'body', weight, color = 'text', size, lineHeight, align, devanagari, uppercase, heading, lang, style, children, ...rest
}: TextProps) {
  const t = useTheme();
  const base = typeScale[variant];
  const isDeva = devanagari ?? (t.devanagari || (typeof children === 'string' && DEVANAGARI_RE.test(children)));
  const w = weight ?? base.weight;
  const fs = size ?? base.fontSize;
  const lh = (lineHeight ?? (size ? Math.round(size * 1.4) : base.lineHeight)) * (isDeva ? DEVANAGARI_LINE_FACTOR : 1);
  const resolved = (t.c as Record<string, string>)[color] ?? color;
  return (
    <RNText
      accessibilityRole={heading ? 'header' : rest.accessibilityRole}
      {...(heading ? ({ 'aria-level': heading === true ? 2 : heading } as object) : {})}
      maxFontSizeMultiplier={2}
      {...rest}
      {...(lang ? ({ lang } as object) : {})}
      style={[
        {
          fontFamily: fontFor(w, isDeva),
          fontSize: fs,
          lineHeight: Math.round(lh),
          color: resolved,
          textAlign: align,
        },
        uppercase && styles.upper,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({ upper: { textTransform: 'uppercase', letterSpacing: 0.6 } });
