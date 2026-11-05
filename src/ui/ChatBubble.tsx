import { Link } from 'expo-router';
import { Scale } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Text } from './Text';

export type ChatSource = { title: string; href: string };

/** ChatBubble: user, AI, AI with source chips, legal-help card. */
export function ChatBubble({ role, text, sources }: { role: 'user' | 'ai'; text: string; sources?: ChatSource[] }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const user = role === 'user';
  return (
    <View
      style={{
        alignSelf: user ? 'flex-end' : 'flex-start', maxWidth: user ? '80%' : '85%',
        backgroundColor: user ? c.primary : c.ground, borderWidth: user ? 0 : 1, borderColor: c.border,
        borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: user ? 16 : 4, borderBottomRightRadius: user ? 4 : 16,
        paddingVertical: 9, paddingHorizontal: 12, gap: 6,
      }}
    >
      <Text variant="bodySmall" color={user ? c.onPrimary : c.text}>{text}</Text>
      {sources?.map((s) => (
        <Link key={s.href} href={s.href as never} asChild>
          <Pressable accessibilityRole="link" style={{ alignSelf: 'flex-start', backgroundColor: c.primaryTint, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text size={12} weight="600" color="primary">{t('common.guide')}: {s.title}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

export function LegalHelpCard() {
  const { t } = useTranslation();
  const { c } = useTheme();
  return (
    <View style={{ alignSelf: 'flex-start', maxWidth: '90%', backgroundColor: c.warningBg, borderWidth: 1, borderColor: c.warningBorder, borderRadius: 12, padding: 12, gap: 6 }}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Icon icon={Scale} size={18} color="warningText" />
        <Text size={14} weight="700" color="warningStrongText">{t('assist.legalHelp')}</Text>
      </View>
      <Text size={13} color="warningStrongText">{t('assist.legalHelpBody')}</Text>
      <Link href="/get-help" asChild>
        <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text size={14} weight="700" color="primary">{t('common.whereToGetHelp')} →</Text>
        </Pressable>
      </Link>
    </View>
  );
}
