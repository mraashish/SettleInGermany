import { Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Bookmark, ChevronRight, Share2, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { isOutdated, useGuide, useL, useTasks } from '@/content/client';
import type { Guide } from '@/content/types';
import { formatDate } from '@/lib/deadline';
import { useLayout } from '@/lib/useLayout';
import { usePrefs } from '@/store/prefs';
import { addCustomTask, toggleSavedGuide, useRoadmap } from '@/store/roadmap';
import { useTheme } from '@/theme/ThemeProvider';
import {
  AdSlot, AILabel, Button, Callout, Card, Checkbox, EmptyState, GermanTerm, Icon, OutdatedBanner, Pill, Screen, SectionTitle, Skeleton, Text,
} from '@/ui';

const SITE = process.env.EXPO_PUBLIC_SITE_URL ?? 'https://settleingermany.app';

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Text size={14} color="muted" style={{ width: 76 }}>{label}</Text>
      <Text size={14} weight={strong ? '700' : '400'} color={strong ? 'danger' : 'text'} style={{ flex: 1 }}>{value}</Text>
    </View>
  );
}

function Steps({ guide }: { guide: Guide }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const l = useL();
  return (
    <View nativeID="steps" style={{ gap: 16 }}>
      <SectionTitle>{t('guides.steps')}</SectionTitle>
      {guide.steps.map((s, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={15} weight="700" color={c.onPrimary}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <Text size={16} lineHeight={22} weight="600" heading>{l(s.title)}</Text>
            <Text color="text2">{l(s.body)}</Text>
            {s.term ? <GermanTerm term={s.term} audio /> : null}
            {s.cost || s.wait ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {s.cost ? <View style={{ flex: 1, backgroundColor: c.ground, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 }}><Text size={13} color="muted">{t('guides.typicalCost')}</Text><Text size={14} weight="600">{l(s.cost)}</Text></View> : null}
                {s.wait ? <View style={{ flex: 1, backgroundColor: c.ground, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 }}><Text size={13} color="muted">{t('guides.typicalWait')}</Text><Text size={14} weight="600">{l(s.wait)}</Text></View> : null}
              </View>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

function DocumentsChecklist({ guide }: { guide: Guide }) {
  const { t } = useTranslation();
  const l = useL();
  const { data: tasks = [] } = useTasks();
  const [checked, setChecked] = useState<number[]>([]);
  const [added, setAdded] = useState(false);
  const inRoadmap = tasks.some((x) => x.guideSlug === guide.slug);
  if (!guide.documents.length) return null;
  return (
    <Card nativeID="documents" style={{ gap: 4 }}>
      <SectionTitle>{t('guides.documents')}</SectionTitle>
      {guide.documents.map((d, i) => {
        const on = checked.includes(i);
        const toggle = () => setChecked((x) => (on ? x.filter((y) => y !== i) : [...x, i]));
        return (
          <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 44 }}>
            <Checkbox checked={on} onChange={toggle} label={l(d)} />
            <Text style={{ flex: 1 }} onPress={toggle}>{l(d)}</Text>
          </View>
        );
      })}
      <Button
        variant="secondary"
        style={{ marginTop: 8 }}
        label={added ? t('roadmap.added') : Platform.OS === 'web' ? 'Add to my free checklist' : t('roadmap.addToRoadmap')}
        disabled={added}
        onPress={() => {
          if (!inRoadmap) addCustomTask({ title: l(guide.title), stage: guide.stage, deadline: null });
          setAdded(true);
        }}
      />
    </Card>
  );
}

function Feedback({ guide }: { guide: Guide }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  return (
    <View style={{ gap: 8, alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Text size={15} weight="500">{t('guides.helpful')}</Text>
        {(['yes', 'no'] as const).map((v) => (
          <Pressable key={v} accessibilityRole="button" accessibilityState={{ selected: vote === v }} onPress={() => setVote(v)}
            style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: vote === v ? c.primary : c.borderStrong, backgroundColor: vote === v ? c.primaryTint : c.surface, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon icon={v === 'yes' ? ThumbsUp : ThumbsDown} size={16} color="primary" />
            <Text size={14} weight="600">{v === 'yes' ? t('guides.yes') : t('guides.no')}</Text>
          </Pressable>
        ))}
      </View>
      <Link href={`mailto:content@settleingermany.app?subject=${encodeURIComponent(`Outdated: ${guide.slug}`)}` as never}>
        <Text size={14} weight="600" color="primary">{t('guides.reportOutdated')}</Text>
      </Link>
    </View>
  );
}

function GuideBody({ guide }: { guide: Guide }) {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const onboarded = usePrefs((s) => s.onboarded);
  const saved = useRoadmap((s) => s.savedGuides.includes(guide.slug));
  const stageN = ['before', 'first30', 'living', 'career'].indexOf(guide.stage) + 1;
  const outdated = isOutdated(guide.lastVerified);
  const share = () => {
    const url = `${SITE}/guides/${guide.slug}`;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) void navigator.share({ title: l(guide.title), url });
    else void Share.share({ message: `${l(guide.title)} — ${url}`, url });
  };
  const tips = guide.callouts.filter((x) => x.kind !== 'legal');

  return (
    <>
      <View style={{ gap: 8 }}>
        <Text size={13} weight="700" color="primary" uppercase>{t('guides.stageLabel', { n: stageN, stage: t(`stages.${guide.stage}`) })}</Text>
        <Text size={Platform.OS === 'web' ? 32 : 28} lineHeight={Platform.OS === 'web' ? 38 : 34} weight="700" style={{ letterSpacing: -0.5 }} heading={1}>
          {l(guide.title)}{Platform.OS === 'web' ? ' in Germany' : ''}
        </Text>
        <GermanTerm term={guide.term} audio />
        <Text variant="caption" color="muted">
          {t('common.minRead', { count: guide.readingMinutes })} · {t('common.lastVerified', { date: formatDate(guide.lastVerified, i18n.language) })}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button variant="secondary" fullWidth={false} icon={Bookmark} label={saved ? t('guides.unsave') : t('guides.save')} onPress={() => toggleSavedGuide(guide.slug)} />
          <Button variant="secondary" fullWidth={false} icon={Share2} label={t('nav.share')} onPress={share} />
        </View>
      </View>

      {outdated ? <OutdatedBanner lastVerified={formatDate(guide.lastVerified, i18n.language)} /> : null}

      <View nativeID="in-short" accessibilityLabel={t('guides.inShort')} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 16, gap: 12 }}>
        <Text size={13} weight="700" color="primary" uppercase heading>{t('guides.inShort')}</Text>
        <SummaryRow label={t('guides.what')} value={l(guide.summary.what)} />
        <SummaryRow label={t('guides.when')} value={l(guide.summary.when)} />
        <SummaryRow label={t('guides.deadline')} value={l(guide.summary.deadline)} strong />
      </View>

      {Platform.OS === 'web' && !onboarded ? (
        <View style={{ backgroundColor: c.primaryTint, borderRadius: 16, padding: 16, gap: 6 }}>
          <Text weight="700">Get your personal checklist</Text>
          <Text color="text2">Every step for your city and visa, with reminders before deadlines. Free.</Text>
          <Link href="/onboarding/1"><Text weight="700" color="primary">Start free →</Text></Link>
        </View>
      ) : null}

      {/* Ad: after the summary box — never inside steps or checklists */}
      <AdSlot format={Platform.OS === 'web' ? 'banner' : 'native'} placement="guide-after-summary" />

      {guide.steps.length ? <Steps guide={guide} /> : null}
      <DocumentsChecklist guide={guide} />

      {tips.length ? <View nativeID="tips" style={{ gap: 10 }}>{tips.map((x, i) => <Callout key={i} kind={x.kind} text={l(x.text)} />)}</View> : null}

      {guide.related.length && Platform.OS !== 'web' ? (
        <View style={{ gap: 8 }}>
          <SectionTitle>{t('guides.related')}</SectionTitle>
          <Card padded={false} style={{ paddingHorizontal: 16 }}>
            {guide.related.map((r, i) => (
              <Link key={r.href} href={r.href as never} asChild>
                <Pressable accessibilityRole="link" style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
                  <Text weight="600" style={{ flex: 1 }}>{l(r.title)}</Text>
                  <Pill label={r.kind === 'tool' ? t('common.tool') : t('common.guide')} tone="neutral" />
                  <Icon icon={ChevronRight} size={18} color="muted" />
                </Pressable>
              </Link>
            ))}
          </Card>
        </View>
      ) : null}

      {/* Ad: before sources */}
      <AdSlot format={Platform.OS === 'web' ? 'banner' : 'native'} placement="guide-before-sources" />

      {guide.sources.length ? (
        <View nativeID="sources" style={{ gap: 8 }}>
          <SectionTitle>{t('guides.sources')}</SectionTitle>
          {guide.sources.map((s) => (
            <Pressable key={s.url} accessibilityRole="link" onPress={() => void WebBrowser.openBrowserAsync(s.url)} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text weight="600" color="primary" style={{ textDecorationLine: 'underline' }}>{s.title} ↗</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Link href="/assist/reply" asChild>
        <Pressable accessibilityRole="link" style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text weight="600">{t('guides.helpWriting')}</Text>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Text variant="caption" color="muted">{t('guides.helpWritingSub').replace(' · AI', '')}</Text><AILabel /></View>
          </View>
          <Icon icon={ChevronRight} color="muted" />
        </Pressable>
      </Link>

      <Feedback guide={guide} />
      <Text variant="caption" color="muted">
        {t('common.generalInfo')}{' '}
        <Text variant="caption" color="primary" onPress={() => router.push('/get-help')}>{t('common.whereToGetHelp')}</Text>
      </Text>
    </>
  );
}

function WebAside({ guide }: { guide: Guide }) {
  const { t } = useTranslation();
  const l = useL();
  const { c } = useTheme();
  const toc = [
    { id: 'in-short', label: t('guides.inShort') }, { id: 'steps', label: t('guides.steps') },
    { id: 'documents', label: t('guides.documents') }, { id: 'tips', label: 'Tips and mistakes' }, { id: 'sources', label: t('guides.sources') },
  ];
  return (
    <>
      <Card style={{ gap: 4 }}>
        <Text size={13} weight="700" color="muted" uppercase>On this page</Text>
        {toc.map((x) => (
          <Pressable key={x.id} accessibilityRole="link" onPress={() => { if (typeof document !== 'undefined') document.getElementById(x.id)?.scrollIntoView({ behavior: 'smooth' }); }} style={{ minHeight: 40, justifyContent: 'center' }}>
            <Text size={14} color="primary">{x.label}</Text>
          </Pressable>
        ))}
      </Card>
      <Card style={{ gap: 8, backgroundColor: c.primaryTint, borderColor: c.primaryTint }}>
        <Text weight="700">Take it with you</Text>
        <Text size={14} color="text2">Every step for your city and visa, in English, Nepali or Hindi — with reminders before each deadline. Free.</Text>
        <Link href="/onboarding/1"><Text weight="700" color="primary">Start free on the web →</Text></Link>
        {/* TODO(product owner): official App Store / Google Play badge artwork (HANDOFF §12) */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: c.borderStrong, alignItems: 'center', justifyContent: 'center' }}><Text size={11} color="muted">[App Store badge]</Text></View>
          <View style={{ flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: c.borderStrong, alignItems: 'center', justifyContent: 'center' }}><Text size={11} color="muted">[Google Play badge]</Text></View>
        </View>
      </Card>
      {guide.related.length ? (
        <Card style={{ gap: 4 }}>
          <Text size={17} weight="700" heading>{t('guides.related')}</Text>
          {guide.related.map((r) => (
            <Link key={r.href} href={r.href as never} asChild>
              <Pressable accessibilityRole="link" style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text size={15} weight="600" color="primary">{l(r.title)}</Text>
                <Icon icon={ChevronRight} size={18} color="muted" />
              </Pressable>
            </Link>
          ))}
          {guide.city ? <Link href={`/guides/city/${guide.city}`}><Text size={15} weight="600" color="primary">City page</Text></Link> : null}
        </Card>
      ) : null}
    </>
  );
}

export function GuideScreen({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const l = useL();
  const { desktop } = useLayout();
  const { data: guide, isLoading } = useGuide(slug);
  const saved = useRoadmap((s) => s.savedGuides.includes(slug));

  if (!guide) {
    return (
      <Screen title={t('guides.title')} back={{ label: t('guides.title'), href: '/guides' }} large={false}>
        {isLoading ? <Skeleton lines={8} /> : <EmptyState title="We couldn’t find this guide" body="It may have moved." actionLabel={t('guides.all')} onAction={() => router.replace('/guides')} />}
      </Screen>
    );
  }
  const title = l(guide.title);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'HowTo', name: `${guide.title.en} in Germany`, inLanguage: 'en',
    dateModified: guide.lastVerified, totalTime: `PT${guide.readingMinutes}M`,
    step: guide.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title.en, text: s.body.en })),
  };
  return (
    <>
      {Platform.OS === 'web' ? (
        React.createElement('script', { type: 'application/ld+json', dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } })
      ) : null}
      <Screen
        title={`${title} (${guide.term.term})`}
        description={`${guide.summary.what.en} ${guide.summary.deadline.en}.`}
        large={false}
        back={{ label: t('guides.title'), href: '/guides' }}
        actions={[
          { icon: Bookmark, label: saved ? t('guides.unsave') : t('guides.save'), onPress: () => toggleSavedGuide(slug) },
        ]}
        crumbs={[{ label: t('guides.title'), href: '/guides' }, { label: t(`stages.${guide.stage}`), href: `/guides?filter=${guide.stage}` }, { label: title }]}
        hideWebTitle
        aside={Platform.OS === 'web' && desktop ? <WebAside guide={guide} /> : undefined}
      >
        <GuideBody guide={guide} />
      </Screen>
    </>
  );
}
