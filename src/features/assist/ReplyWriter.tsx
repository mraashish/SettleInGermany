import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { Copy, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ai } from '@/services/ai';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Chip, Text, TextField } from '@/ui';
import { AiScreen } from './AiScaffold';

const PURPOSES = ['Send documents', 'Ask for an appointment', 'Ask for more time', 'Ask a question', 'Cancel a contract'];

/** Reply writer: formal German with a line-by-line translation; [highlighted] parts to fill in. */
export function ReplyWriter() {
  const { i18n } = useTranslation();
  const { c } = useTheme();
  const { letter } = useLocalSearchParams<{ letter?: string }>();
  const [to, setTo] = useState('');
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState<'formal' | 'very'>('formal');
  const [out, setOut] = useState<{ german: string; translation: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const write = async (extra = '') => {
    setBusy(true);
    try { setOut(await ai.reply({ letterId: letter, intent: `${purpose} · ${tone}${extra}`, details: `${to}\n${details}`, lang: i18n.language })); } finally { setBusy(false); }
  };
  const parts = (s: string) => s.split(/(\[[^\]]+\])/g).map((p, i) => (p.startsWith('[') ? <Text key={i} lang="de" style={{ backgroundColor: c.warningBg }} color="warningStrongText" weight="600">{p}</Text> : p));
  return (
    <AiScreen title="Reply writer" premiumOnly back={{ label: letter ? 'Letter' : 'Assist', href: letter ? `/assist/letters/${letter}` : '/assist' }}>
      {letter ? <Text color="muted">Replying to your scanned letter</Text> : null}
      <TextField label="To" value={to} onChangeText={setTo} placeholder="e.g. Immigration office" />
      <View style={{ gap: 8 }}>
        <Text size={14} weight="600">Purpose</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{PURPOSES.map((p) => <Chip key={p} label={p} selected={purpose === p} onPress={() => setPurpose(p)} />)}</View>
      </View>
      <TextField label="Key details — write in any language" value={details} onChangeText={setDetails} multiline style={{ minHeight: 96, textAlignVertical: 'top' }} />
      <Button label={out ? 'Write it again' : 'Write my letter'} loading={busy} onPress={() => write()} />
      {out ? (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text size={17} weight="700" heading>Your letter</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Chip label="Formal" selected={tone === 'formal'} onPress={() => setTone('formal')} />
              <Chip label="Very formal" selected={tone === 'very'} onPress={() => setTone('very')} />
            </View>
          </View>
          <View accessibilityRole={'article' as never} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 16, gap: 10 }}>
            <Text lang="de">{parts(out.german)}</Text>
            <View style={{ height: 1, backgroundColor: c.divider }} />
            <Text color="muted">{out.translation}</Text>
          </View>
          <Text size={13} color="warningText">Fill in the highlighted parts before you send it.</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Chip label="Make it shorter" onPress={() => write(' · shorter')} />
            <Chip label="Add a detail" onPress={() => write(' · add detail')} />
            <Chip label="Write it again" onPress={() => write()} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="secondary" icon={Copy} label="Copy" fullWidth={false} onPress={() => void Clipboard.setStringAsync(out.german)} />
            <Button variant="secondary" icon={Mail} label="Open in email" fullWidth={false} onPress={() => void Linking.openURL(`mailto:?body=${encodeURIComponent(out.german)}`)} />
          </View>
          <Text variant="caption" color="muted">Written by AI. Check it before sending.</Text>
        </View>
      ) : null}
    </AiScreen>
  );
}
