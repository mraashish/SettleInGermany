import { createAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { Volume2 } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { GermanTermRef } from '@/content/types';
import { useTheme } from '@/theme/ThemeProvider';
import { touchTarget } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';

/** Outlined "DE" tag (10–11 px, 700, primary border). */
export function DETag({ large }: { large?: boolean }) {
  const { c } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel="German term"
      style={[styles.tag, { borderColor: c.primary, paddingHorizontal: large ? 5 : 4 }]}
    >
      <Text size={large ? 11 : 10} lineHeight={large ? 17 : 15} weight="700" color="primary" devanagari={false}>
        DE
      </Text>
    </View>
  );
}

export function playGerman(term: GermanTermRef) {
  if (term.audioUrl) {
    const p = createAudioPlayer(term.audioUrl);
    p.play();
    return;
  }
  Speech.speak(term.term, { language: 'de-DE', rate: 0.9 });
}

/** GermanTerm (Library): inline, or with an audio button where space allows. */
export function GermanTerm({
  term, audio, size = 13, color = 'text2',
}: { term: GermanTermRef; audio?: boolean; size?: number; color?: string }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  return (
    <View style={styles.row}>
      <DETag large={audio} />
      <Text lang="de" size={audio ? 17 : size} weight="500" color={audio ? 'text' : color} devanagari={false}>
        {term.term}
      </Text>
      {audio ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t('common.playPronunciation')}: ${term.term}`}
          onPress={() => playGerman(term)}
          style={[styles.audio, { borderColor: c.border, backgroundColor: c.surface }]}
        >
          <Icon icon={Volume2} size={20} color="primary" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { borderWidth: 1, borderRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  audio: { width: touchTarget, height: touchTarget, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
