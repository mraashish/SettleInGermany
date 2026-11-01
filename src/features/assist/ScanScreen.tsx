import { router } from 'expo-router';
import { Camera, FileUp, Upload, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useUsage } from '@/services/ai';
import { useOnline } from '@/services/network';
import { pickFiles, type ScannedPage, scanDocument } from '@/services/scanner';
import { useTheme } from '@/theme/ThemeProvider';
import { AILabel, Button, Icon, Text } from '@/ui';
import { AiScreen, NeedsInternet } from './AiScaffold';
import { ScanQuota } from './AssistHub';

let pending: ScannedPage[] = [];
export const takePendingPages = () => { const p = pending; pending = []; return p; };

function start(pages: ScannedPage[], lang: string) {
  if (!pages.length) return;
  pending = pages;
  router.replace({ pathname: '/assist/scan/processing', params: { lang } } as never);
}

/**
 * Capture: apps open the system document scanner (VisionKit / ML Kit: multi-page,
 * edge detection, retake, crop). Web shows an upload drop zone (LetterFlow step=upload).
 * The free-scan count is shown before the scan starts.
 */
export function ScanScreen() {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const online = useOnline();
  const usage = useUsage().data;
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const outOfScans = usage && !usage.premium && usage.scansLeft <= 0;
  const add = (p: ScannedPage[]) => setPages((x) => [...x, ...p]);

  if (Platform.OS === 'web') {
    return (
      <AiScreen title="Upload a letter" back={{ label: 'Assist', href: '/assist' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Choose a photo or PDF to upload" onPress={async () => add(await pickFiles())}
          style={{ minHeight: 220, borderWidth: 2, borderStyle: 'dashed', borderColor: c.borderStrong, borderRadius: 20, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Upload} color="primary" /></View>
          <Text size={17} weight="700">Drop a photo or PDF here</Text>
          <Text color="muted">or choose a file · up to 10 pages</Text>
        </Pressable>
        {pages.length ? (
          <View style={{ gap: 6 }}>
            {pages.map((p, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 12, paddingHorizontal: 12, minHeight: 48 }}>
                <Icon icon={FileUp} size={18} color="primary" />
                <Text style={{ flex: 1 }} numberOfLines={1}>{p.name}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${p.name}`} onPress={() => setPages((x) => x.filter((_, j) => j !== i))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon icon={X} size={18} color="muted" /></Pressable>
              </View>
            ))}
          </View>
        ) : null}
        <Button variant="secondary" icon={Camera} label="Take a photo with your phone" onPress={async () => add(await pickFiles())} />
        <Text size={14} color="text2">Your document is processed and then deleted. We don’t keep it unless you choose to save it.</Text>
        <ScanQuota compact />
        {outOfScans ? <Button variant="premium" label={t('assist.seePremium')} onPress={() => router.push('/premium')} /> : (
          <Button label="Explain this letter" disabled={!pages.length || !online} onPress={() => start(pages, i18n.language)} />
        )}
      </AiScreen>
    );
  }

  // Apps: full-screen capture
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121614' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, minHeight: 56 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('nav.close')} onPress={() => router.back()} style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}><Icon icon={X} color="#ECEAE5" /></Pressable>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Text size={17} weight="600" color="#ECEAE5">Scan a letter</Text><AILabel /></View>
        <View style={{ width: 48 }} />
      </View>
      <View style={{ flex: 1, margin: 24, borderRadius: 16, borderWidth: 2, borderColor: '#5CC8C2', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        <Icon icon={Camera} size={48} color="#5CC8C2" />
        <Text color="#ECEAE5" align="center">{pages.length ? `${pages.length} page${pages.length > 1 ? 's' : ''} ready` : 'Hold your phone over the letter. Edges are found automatically.'}</Text>
        {!online ? <NeedsInternet /> : null}
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom: 16, gap: 12 }}>
        <View style={{ alignItems: 'center' }}><Text size={13} color="#C9CFCD">This uses 1 of your {usage?.scansLeft ?? 3} free scans this month</Text></View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable accessibilityRole="button" onPress={async () => add(await pickFiles())} style={{ width: 88, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={12} color="#ECEAE5" align="center">Upload PDF{'\n'}or photo</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Scan pages" disabled={!!outOfScans}
            onPress={async () => { try { add(await scanDocument()); } catch { /* cancelled */ } }}
            style={{ width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#ECEAE5', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ECEAE5' }} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Continue with scanned pages" disabled={!pages.length || !online} onPress={() => start(pages, i18n.language)}
            style={{ width: 88, minHeight: 48, alignItems: 'center', justifyContent: 'center', opacity: pages.length ? 1 : 0.5 }}>
            <Text size={20} weight="700" color="#ECEAE5">{pages.length}</Text>
            <Text size={12} color="#ECEAE5">Pages</Text>
          </Pressable>
        </View>
        {outOfScans ? <Button variant="premium" label={t('assist.seePremium')} onPress={() => router.push('/premium')} /> : null}
      </View>
    </SafeAreaView>
  );
}
