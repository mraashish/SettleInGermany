import { Link } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { Pill } from './Chip';
import { Icon } from './Icon';
import { Text } from './Text';

/** Tile with a "Premium" overlay pill (AssistHub). */
export function PremiumTile({
  title, sub, href, locked,
}: { title: string; sub: string; href: string; locked: boolean }) {
  const t = useTheme();
  return (
    <Link href={href as never} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={locked ? `${title}. Premium` : title}
        style={{
          flex: 1, minHeight: 92, borderWidth: 1, borderColor: t.c.border, borderRadius: t.shape.card,
          backgroundColor: t.c.surface, padding: 12, gap: 4,
        }}
      >
        <Text size={15} weight="600" style={{ paddingRight: locked ? 64 : 0 }}>{title}</Text>
        <Text variant="caption" color="muted">{sub}</Text>
        {locked ? <View style={{ position: 'absolute', top: 8, right: 8 }}><Pill label="Premium" tone="accent" /></View> : null}
      </Pressable>
    </Link>
  );
}

/** Inline soft upgrade card — shown after the full result, never instead of it. */
export function UpgradeCard({ title, body }: { title: string; body: string }) {
  const { t } = useTranslation();
  const th = useTheme();
  return (
    <View style={{ borderWidth: 1, borderColor: th.c.accent, backgroundColor: th.c.accentBg, borderRadius: th.shape.card, padding: 16, gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Icon icon={Sparkles} size={20} color="warningBorder" />
        <Text weight="700" style={{ flex: 1 }}>{title}</Text>
      </View>
      <Text variant="bodySmall" color="text2">{body}</Text>
      <Link href="/premium" asChild>
        <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text weight="700" color="primary">{t('assist.seePremium')}</Text>
        </Pressable>
      </Link>
    </View>
  );
}
