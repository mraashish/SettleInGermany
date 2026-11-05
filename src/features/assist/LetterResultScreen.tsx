import { useQuery } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { BellPlus, Bookmark, ChevronDown, ChevronUp, MessageCircle, PenLine, Share2, BookOpen } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ai } from '@/services/ai';
import { formatDate } from '@/lib/deadline';
import { DEFAULT_OFFSETS, upsertReminder } from '@/store/reminders';
import { useTheme } from '@/theme/ThemeProvider';
import { AIResultBlock, AlertBanner, Button, Checkbox, DueChip, ErrorState, GermanTerm, Icon, Skeleton, Text, UpgradeCard } from '@/ui';
import { AiScreen } from './AiScaffold';

/**
 * Letter result (LetterResult): who sent it → what they want → deadline (+ Add to
 * reminders) → what to do next → key terms → original text (collapsible) → actions.
 * Urgent/legal letters get a red, non-dismissible banner to human help.
 * After the last free scan the result still shows in full, then a soft upgrade card.
 */
export function LetterResultScreen({ id }: { id: string }) {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const { data: r, isLoading, isError, refetch } = useQuery({ queryKey: ['letter', id], queryFn: () => ai.letter(id) });
  const [checked, setChecked] = useState<number[]>([]);
  const [showOriginal, setShowOriginal] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [saved, setSaved] = useState(false);

  if (isLoading) return <AiScreen title={t('assist.yourLetter')}><Skeleton lines={8} /></AiScreen>;
  if (isError || !r) return <AiScreen title={t('assist.yourLetter')}><ErrorState onRetry={() => void refetch()} /></AiScreen>;

  const action = (icon: typeof PenLine, label: string, onPress: () => void) => (
    <Pressable key={label} accessibilityRole="button" onPress={onPress}
      style={{ flexBasis: '47%', flexGrow: 1, minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, borderRadius: th.shape.button === 999 ? 999 : 12, paddingHorizontal: 14 }}>
      <Icon icon={icon} size={20} color="primary" /><Text size={14} weight="600">{label}</Text>
    </Pressable>
  );

  return (
    <AiScreen title={t('assist.yourLetter')} back={{ label: t('nav.assist'), href: '/assist' }}>
      {r.urgent ? (
        <AlertBanner kind="urgent" title={t('assist.urgentTitle')} body={t('assist.urgentBody')}
          action={
            <View style={{ gap: 6 }}>
              <Link href="/get-help"><Text size={14} weight="700" color={th.scheme === 'dark' ? '#1A2221' : '#FFFFFF'} style={{ textDecorationLine: 'underline' }}>{t('assist.findCounselling')}</Text></Link>
              <Link href="/get-help"><Text size={14} color={th.scheme === 'dark' ? '#1A2221' : '#FFFFFF'} style={{ textDecorationLine: 'underline' }}>{t('assist.otherHelp')}</Text></Link>
            </View>
          } />
      ) : null}

      <AIResultBlock title={`1 · ${t('assist.sender')}`}>
        <Text weight="700">{r.sender.name}</Text>
        {r.sender.term ? <GermanTerm term={{ term: r.sender.term }} /> : null}
        {r.sender.kind ? <Text color="muted">{r.sender.kind}</Text> : null}
      </AIResultBlock>

      <AIResultBlock title={`2 · ${t('assist.want')}`}><Text>{r.want}</Text></AIResultBlock>

      {r.deadline ? (
        <AIResultBlock title={`3 · ${r.deadline.label}`}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Text size={20} weight="700">{formatDate(r.deadline.date, i18n.language, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            <DueChip due={r.deadline.date} />
          </View>
          <Text variant="caption" color="muted">{t('assist.writtenAs', { raw: r.deadline.raw })}</Text>
          <Button variant="secondary" icon={BellPlus} label={reminded ? t('assist.addedToReminders') : t('assist.addToReminders')} disabled={reminded}
            onPress={() => { upsertReminder({ id: `letter-${r.id}`, title: `${r.sender.name}: reply`, date: r.deadline!.date, note: r.want, offsets: DEFAULT_OFFSETS.filter((d) => d <= 30), notificationIds: [] }); setReminded(true); }} />
        </AIResultBlock>
      ) : null}

      <AIResultBlock title={`4 · ${t('assist.nextSteps')}`}>
        {r.nextSteps.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 44 }}>
            <Checkbox checked={checked.includes(i)} onChange={() => setChecked((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]))} label={s} />
            <Text style={{ flex: 1 }}>{s}</Text>
          </View>
        ))}
      </AIResultBlock>

      <AIResultBlock title={`5 · ${t('assist.keyTerms')}`}>
        {r.keyTerms.map((k) => (
          <View key={k.de} style={{ gap: 2, paddingVertical: 4 }}>
            <GermanTerm term={{ term: k.de }} />
            <Text color="text2">{k.meaning}</Text>
          </View>
        ))}
      </AIResultBlock>

      <Pressable accessibilityRole="button" accessibilityState={{ expanded: showOriginal }} onPress={() => setShowOriginal((v) => !v)}
        style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, borderRadius: th.shape.card, paddingHorizontal: 14 }}>
        <Text weight="600" style={{ flex: 1 }}>6 · {t('assist.showOriginal')}</Text>
        <Icon icon={showOriginal ? ChevronUp : ChevronDown} color="muted" />
      </Pressable>
      {showOriginal ? (
        <View style={{ gap: 10, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 14 }}>
          <Text lang="de" color="text2">{r.original.de}</Text>
          <View style={{ height: 1, backgroundColor: c.divider }} />
          <Text color="text2">{r.original.translation}</Text>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {action(PenLine, t('assist.writeReply'), () => router.push(`/assist/reply?letter=${r.id}` as never))}
        {action(MessageCircle, t('assist.askFollowUp'), () => router.push('/assist/ask'))}
        {r.relatedGuide ? action(BookOpen, t('assist.relatedGuide'), () => router.push(`/guides/${r.relatedGuide}`)) : null}
        {action(Bookmark, saved ? t('guides.saved') : t('assist.saveLetter'), () => { void ai.saveLetter(r.id); setSaved(true); })}
        {action(Share2, t('assist.shareLetter'), () => void Share.share({ message: `${r.sender.name}: ${r.want}` }))}
      </View>

      {r.lastFree ? <UpgradeCard title={t('assist.lastFree')} body={t('assist.lastFreeBody')} /> : null}
      <Text variant="caption" color="muted">{t('assist.summaryNote')}</Text>
    </AiScreen>
  );
}
