import { Link, usePathname } from 'expo-router';
import { ChevronDown, Compass } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LANGUAGES, setLanguage } from '@/i18n';
import { useLayout } from '@/lib/useLayout';
import { openConsentSettings } from '@/services/consent';
import { usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

export interface Crumb { label: string; href?: string }

function Logo({ small }: { small?: boolean }) {
  const { c } = useTheme();
  const { t } = useTranslation();
  return (
    <Link href="/" asChild>
      <Pressable accessibilityRole="link" style={{ flexDirection: 'row', alignItems: 'center', gap: small ? 8 : 10, minHeight: 44 }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Icon icon={Compass} size={18} color={c.onPrimary} />
        </View>
        <Text size={small ? 16 : 17} weight="700">{t('app.name')}</Text>
      </Pressable>
    </Link>
  );
}

function Avatar({ size }: { size: number }) {
  const { c } = useTheme();
  const { t } = useTranslation();
  const name = usePrefs((s) => s.profile.name);
  return (
    <Link href="/me" asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={name ? t('nav.yourAccount', { name }) : t('nav.account')} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: size, height: size, borderRadius: 999, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={size > 36 ? 16 : 14} weight="700" color={c.onPrimary}>{(name ?? '?').slice(0, 1).toUpperCase()}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

function LanguageMenu() {
  const { c } = useTheme();
  const { t } = useTranslation();
  const lang = usePrefs((s) => s.language);
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  return (
    <View style={{ zIndex: 10 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${t('nav.language')}: ${current.english}`} accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text size={14} weight="500">{current.native}</Text>
        <Icon icon={ChevronDown} size={16} color="muted" />
      </Pressable>
      {open ? (
        <View accessibilityRole="menu" style={{ position: 'absolute', top: 48, right: 0, minWidth: 180, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 4 }}>
          {LANGUAGES.map((l) => (
            <Pressable key={l.code} accessibilityRole="menuitem" onPress={() => { setLanguage(l.code); setOpen(false); }}
              style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8, backgroundColor: l.code === lang ? c.primaryTint : 'transparent' }}>
              <Text size={15}>{l.native} <Text size={13} color="muted">{l.english}</Text></Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const NAV = [
  { key: 'home', href: '/' },
  { key: 'guides', href: '/guides' },
  { key: 'assist', href: '/assist' },
  { key: 'tools', href: '/tools' },
] as const;

export function SiteHeader() {
  const { c } = useTheme();
  const { t } = useTranslation();
  const { webWide } = useLayout();
  const path = usePathname();
  if (!webWide) {
    return (
      <View accessibilityRole="banner" style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderColor: c.border, minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 12 }}>
        <Logo small />
        <Avatar size={32} />
      </View>
    );
  }
  return (
    <View accessibilityRole="banner" style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderColor: c.border, zIndex: 10 }}>
      <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 32, minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <Logo />
        <View accessibilityRole={'navigation' as never} accessibilityLabel={t('nav.main')} style={{ flexDirection: 'row', gap: 4, flex: 1 }}>
          {NAV.map((n) => {
            const on = n.href === '/' ? path === '/' : path.startsWith(n.href);
            return (
              <Link key={n.key} href={n.href as never} asChild>
                <Pressable accessibilityRole="link" aria-current={on ? 'page' : undefined}
                  style={{ minHeight: 44, paddingHorizontal: 14, justifyContent: 'center', borderRadius: 10, backgroundColor: on ? c.primaryTint : 'transparent' }}>
                  <Text size={15} weight={on ? '700' : '500'} color={on ? 'primary' : 'text2'}>{t(`nav.${n.key}`)}</Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LanguageMenu />
          <Avatar size={44} />
        </View>
      </View>
    </View>
  );
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useTranslation();
  return (
    <View accessibilityRole={'navigation' as never} accessibilityLabel={t('nav.breadcrumbs')} style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', paddingHorizontal: 16 }}>
      {items.map((it, i) => (
        <React.Fragment key={`${it.label}-${i}`}>
          {i > 0 ? <Text size={14} color="muted" aria-hidden>›</Text> : null}
          {it.href ? (
            <Link href={it.href as never}><Text size={14} color="primary" style={{ textDecorationLine: 'underline' }}>{it.label}</Text></Link>
          ) : (
            <Text size={14} color="muted" aria-current="page">{it.label}</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export function SiteFooter() {
  const { c } = useTheme();
  const { t } = useTranslation();
  const links = [
    { label: t('me.impressum'), href: '/impressum' },
    { label: t('me.privacyPolicy'), href: '/privacy-policy' },
    { label: t('me.terms'), href: '/terms' },
    { label: t('common.howWeMakeMoney'), href: '/how-we-make-money' },
  ];
  return (
    <View accessibilityRole={'contentinfo' as never} style={{ borderTopWidth: 1, borderColor: c.border, backgroundColor: c.surface, marginTop: 24 }}>
      <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <Text size={13} color="muted">{t('common.generalInfo')} © {new Date().getFullYear()} {t('app.name')}</Text>
        {links.map((l) => (
          <Link key={l.href} href={l.href as never}><Text size={13} color="primary">{l.label}</Text></Link>
        ))}
        <Pressable accessibilityRole="button" onPress={openConsentSettings} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text size={13} color="primary">{t('me.cookieSettings')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * WebShell (WebShell.dc.html): site header, breadcrumbs, title, main column
 * (max 760 px reading width) with optional right side column, footer.
 */
export function WebShell({
  crumbs, title, intro, ai, aside, children, plainMain,
}: { crumbs?: Crumb[]; title?: string; intro?: string; ai?: boolean; aside?: React.ReactNode; children: React.ReactNode; plainMain?: boolean }) {
  const { c } = useTheme();
  const { webWide, desktop } = useLayout();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.ground }} contentContainerStyle={{ flexGrow: 1 }}>
      <SiteHeader />
      <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', paddingTop: webWide ? 24 : 16, paddingHorizontal: webWide ? 32 : 0, paddingBottom: webWide ? 48 : 24, gap: 16, flexGrow: 1 }}>
        {crumbs?.length ? <Breadcrumbs items={crumbs} /> : null}
        <View style={{ flexDirection: desktop ? 'row' : 'column', gap: 32, alignItems: 'flex-start' }}>
          <View accessibilityRole={'main' as never} style={{ flex: desktop ? 1 : undefined, width: desktop ? undefined : '100%', maxWidth: 760, gap: 4, minWidth: 0 }}>
            {title ? (
              <View style={{ gap: 6, paddingHorizontal: 16, paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Text size={webWide ? 36 : 28} lineHeight={webWide ? 42 : 34} weight="700" style={{ letterSpacing: -0.6 }} heading={1}>
                    {title}
                  </Text>
                  {ai ? (
                    <View style={{ backgroundColor: c.accent, borderRadius: 4, paddingHorizontal: 6 }}><Text size={12} weight="700" color="onAccent">AI</Text></View>
                  ) : null}
                </View>
                {intro ? <Text color="text2">{intro}</Text> : null}
              </View>
            ) : null}
            <View style={plainMain || !webWide ? { paddingHorizontal: 16 } : { backgroundColor: c.ground, borderWidth: 1, borderColor: c.border, borderRadius: 20, padding: 20 }}>
              {children}
            </View>
          </View>
          {aside ? (
            <View accessibilityRole={'complementary' as never} style={{ width: desktop ? 300 : '100%', gap: 16, paddingHorizontal: desktop ? 0 : 16 }}>{aside}</View>
          ) : null}
        </View>
      </View>
      <SiteFooter />
    </ScrollView>
  );
}
