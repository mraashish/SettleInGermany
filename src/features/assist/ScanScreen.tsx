import * as Device from 'expo-device';
import { router } from 'expo-router';
import { Camera, ChevronLeft, FileUp, Upload, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, View } from 'react-native';
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

/** Leave the scanner: back if there is somewhere to go back to, otherwise to the Assist tab. */
export function leaveScan() {
  if (router.canGoBack()) router.back();
  else router.replace('/assist' as never);
}

/** Simulators and emulators have no real camera: the system scanner would open a black screen. */
const hasCamera = Platform.OS !== 'web' && Device.isDevice;
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
      <AiScreen title={t('assist.uploadTitle')} back={{ label: t('nav.assist'), href: '/assist' }}>
        <Pressable accessibilityRole="link" onPress={leaveScan} hitSlop={8}
          style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44, paddingRight: 8 }}>
          <Icon icon={ChevronLeft} size={20} color="primary" />
          <Text weight="600" color="primary">{t('nav.backTo', { name: t('nav.assist') })}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t('assist.chooseFile')} onPress={async () => add(await pickFiles())}
          style={{ minHeight: 220, borderWidth: 2, borderStyle: 'dashed', borderColor: c.borderStrong, borderRadius: 20, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Upload} color="primary" /></View>
          <Text size={17} weight="700">{t('assist.dropHere')}</Text>
          <Text color="muted">{t('assist.orChoose')}</Text>
        </Pressable>
        {pages.length ? (
          <View style={{ gap: 6 }}>
            {pages.map((p, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 12, paddingHorizontal: 12, minHeight: 48 }}>
                <Icon icon={FileUp} size={18} color="primary" />
                <Text style={{ flex: 1 }} numberOfLines={1}>{p.name}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={t('assist.removeFile', { name: p.name })} onPress={() => setPages((x) => x.filter((_, j) => j !== i))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon icon={X} size={18} color="muted" /></Pressable>
              </View>
            ))}
          </View>
        ) : null}
        <Button variant="secondary" icon={Camera} label={t('assist.takePhoto')} onPress={async () => add(await pickFiles())} />
        <Text size={14} color="text2">{t('assist.processedDeleted')}</Text>
        <ScanQuota compact />
        {outOfScans ? <Button variant="premium" label={t('assist.seePremium')} onPress={() => router.push('/premium')} /> : (
          <Button label={t('assist.explainThis')} disabled={!pages.length || !online} onPress={() => start(pages, i18n.language)} />
        )}
        <Button variant="text" label={t('nav.cancel')} onPress={leaveScan} />
      </AiScreen>
    );
  }

  // Apps: full-screen capture
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121614' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, minHeight: 56 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('nav.back')} onPress={leaveScan} hitSlop={8}
          style={{ minWidth: 88, height: 48, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Icon icon={ChevronLeft} color="#ECEAE5" />
          <Text size={17} color="#ECEAE5">{t('nav.back')}</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Text size={17} weight="600" color="#ECEAE5">{t('assist.scanTitle')}</Text><AILabel /></View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('nav.close')} onPress={leaveScan} hitSlop={8}
          style={{ minWidth: 88, height: 48, alignItems: 'flex-end', justifyContent: 'center' }}><Icon icon={X} color="#ECEAE5" /></Pressable>
      </View>
      <View style={{ flex: 1, margin: 24, borderRadius: 16, borderWidth: 2, borderColor: '#5CC8C2', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        <Icon icon={Camera} size={48} color="#5CC8C2" />
        <Text color="#ECEAE5" align="center">{pages.length ? t('assist.pagesReady', { count: pages.length }) : t('assist.holdPhone')}</Text>
        {!online ? <NeedsInternet /> : null}
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom: 16, gap: 12 }}>
        <View style={{ alignItems: 'center' }}><Text size={13} color="#C9CFCD">{t('assist.usesOneScan', { count: usage?.scansLeft ?? 3 })}</Text></View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable accessibilityRole="button" onPress={async () => add(await pickFiles())} style={{ width: 88, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={12} color="#ECEAE5" align="center">{t('assist.uploadShort')}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('assist.scanPages')} disabled={!!outOfScans}
            onPress={async () => {
              if (!hasCamera) {
                Alert.alert(t('assist.noCamera'), t('assist.noCameraBody'), [
                  { text: t('nav.cancel'), style: 'cancel' },
                  { text: t('assist.uploadShort'), onPress: async () => add(await pickFiles()) },
                ]);
                return;
              }
              try { add(await scanDocument()); } catch { /* cancelled */ }
            }}
            style={{ width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#ECEAE5', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ECEAE5' }} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('assist.continuePages')} disabled={!pages.length || !online} onPress={() => start(pages, i18n.language)}
            style={{ width: 88, minHeight: 48, alignItems: 'center', justifyContent: 'center', opacity: pages.length ? 1 : 0.5 }}>
            <Text size={20} weight="700" color="#ECEAE5">{pages.length}</Text>
            <Text size={12} color="#ECEAE5">{t('assist.pages')}</Text>
          </Pressable>
        </View>
        {outOfScans ? <Button variant="premium" label={t('assist.seePremium')} onPress={() => router.push('/premium')} /> : null}
        <Pressable accessibilityRole="button" onPress={leaveScan} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={15} weight="600" color="#ECEAE5">{t('nav.cancel')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
