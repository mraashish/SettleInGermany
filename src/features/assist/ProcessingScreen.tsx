import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ai, ApiError } from '@/services/ai';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, ErrorState, Icon, Text } from '@/ui';
import { AiScreen } from './AiScaffold';
import { takePendingPages } from './ScanScreen';

const STEPS = ['Reading the letter', 'Finding deadlines', 'Preparing your summary'];

/** Calm, step-by-step progress (LetterFlow step=processing). */
export function ProcessingScreen() {
  const { c } = useTheme();
  const { lang } = useLocalSearchParams<{ lang?: string }>();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let alive = true;
    const pages = takePendingPages();
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2500);
    void (async () => {
      try {
        const { id } = await ai.explainLetter(pages, lang ?? 'en');
        if (alive) router.replace(`/assist/letters/${id}`);
      } catch (e) {
        if (!alive) return;
        if (e instanceof ApiError && e.code === 'limit') router.replace('/premium');
        else setError(e as ApiError);
      } finally {
        clearInterval(tick);
      }
    })();
    return () => { alive = false; clearInterval(tick); };
  }, [lang]);

  return (
    <AiScreen title="Understanding your letter" back={{ label: 'Assist', href: '/assist' }}>
      {error ? (
        <ErrorState onRetry={() => router.replace('/assist/scan')} />
      ) : (
        <>
          <Text color="muted">Usually about 20 seconds.</Text>
          <View accessibilityRole="list" style={{ gap: 12 }}>
            {STEPS.map((s, i) => {
              const done = i < step;
              const now = i === step;
              return (
                <View key={s} accessibilityRole={'listitem' as never} accessibilityLiveRegion={now ? 'polite' : 'none'}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, backgroundColor: c.surface, borderWidth: 1, borderColor: now ? c.primary : c.border, borderRadius: 14, paddingHorizontal: 14 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? c.successFill : now ? c.primaryTint : c.divider }}>
                    {done ? <Icon icon={Check} size={16} color={c.onPrimary === '#FFFFFF' ? '#FFFFFF' : c.ground} strokeWidth={3} /> : now ? <ActivityIndicator size="small" color={c.primary} /> : <Text size={13} weight="700" color="muted">{i + 1}</Text>}
                  </View>
                  <Text weight={now ? '700' : '500'} style={{ flex: 1 }} color={i > step ? 'muted' : 'text'}>{s}</Text>
                  <Text size={13} weight="600" color={done ? 'successText' : now ? 'primary' : 'muted'}>{done ? 'Done' : now ? 'Now' : ''}</Text>
                </View>
              );
            })}
          </View>
          <Text variant="caption" color="muted" align="center">You can leave this screen. We’ll notify you when it’s ready.{'\n'}Your scan is deleted after processing.</Text>
          <Button variant="text" label="Back to Assist" onPress={() => router.replace('/assist')} />
        </>
      )}
    </AiScreen>
  );
}
