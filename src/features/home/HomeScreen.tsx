import { Link, router } from 'expo-router';
import { Bell, ChevronRight, ScanText, Search } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCities, useL, useRuleChanges } from '@/content/client';
import { formatDate } from '@/lib/deadline';
import { useLayout } from '@/lib/useLayout';
import { useUsage } from '@/services/ai';
import { prefsStore, STAGES, usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import {
  AdSlot, AlertBanner, Card, DeadlineChip, DueChip, Icon, IconButton, ProgressRing, Screen, SectionTitle, TaskItem, Text,
} from '@/ui';
import { stageIndex, useRoadmapData } from '../roadmap/useRoadmapData';
import { useRoadmapActions } from '../roadmap/actions';

function Greeting() {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const name = usePrefs((s) => s.profile.name);
  const hello = name ? t('home.hello', { name }) : t('home.helloAnon');
  const alerts = useAlertsForMe();
  const actions = (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <IconButton icon={Search} label={t('home.searchLabel')} filled={th.platform === 'ios'} color={th.platform === 'ios' ? 'primary' : 'text'} onPress={() => router.push('/search')} />
      <IconButton icon={Bell} label={t('home.alertsLabel', { count: alerts.length })} badge={alerts.length > 0} filled={th.platform === 'ios'} color={th.platform === 'ios' ? 'primary' : 'text'} onPress={() => router.push('/alerts')} />
    </View>
  );
  if (th.platform === 'android') {
    return (
      <View style={{ height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 4 }}>
        <Text size={22} lineHeight={28} weight="600" heading>{hello}</Text>
        {actions}
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, paddingTop: 20, paddingHorizontal: 16 }}>
      <View style={{ gap: 2, flex: 1 }}>
        <Text size={13} weight="600" color="muted" uppercase>{formatDate(new Date(), i18n.language, { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        <Text variant="largeTitle" style={{ letterSpacing: -0.6 }} heading={1}>{hello}</Text>
      </View>
      {actions}
    </View>
  );
}

/** Rule changes that affect this profile (nationality / status / city). */
export function useAlertsForMe() {
  const { data = [] } = useRuleChanges();
  const p = usePrefs((s) => s.profile);
  const dismissed = usePrefs((s) => s.dismissedAlerts);
  return data.filter((rc) => {
    if (dismissed.includes(rc.id)) return false;
    const a = rc.affects;
    if (a.nationalities?.length && (!p.nationality || !a.nationalities.includes(p.nationality))) return false;
    if (a.statuses?.length && (!p.status || !a.statuses.includes(p.status))) return false;
    if (a.cities?.length && (!p.city || !a.cities.includes(p.city))) return false;
    return true;
  });
}

export function HomeScreen() {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { desktop } = useLayout();
  const profile = usePrefs((s) => s.profile);
  const { data: cities = [] } = useCities();
  const city = cities.find((x) => x.slug === profile.city)?.name ?? '';
  const { next3, stats, deadlines, current } = useRoadmapData();
  const { toggle } = useRoadmapActions();
  const s = stats(current);
  const alerts = useAlertsForMe();
  const usage = useUsage().data;
  const roadmapHref = `/roadmap/${current}`;

  const alert = alerts[0];
  const content = (
    <>
      {alert ? (
        <AlertBanner
          kind="rule"
          title={t('home.ruleChange', { date: alert.date })}
          body={l(alert.summary)}
          onDismiss={() => prefsStore.set((st) => ({ dismissedAlerts: [...st.dismissedAlerts, alert.id] }))}
          action={alert.guideSlug ? <Link href={`/guides/${alert.guideSlug}`}><Text size={14} weight="600" color="primary" style={{ textDecorationLine: 'underline' }}>{t('home.seeWhatChanges')}</Text></Link> : null}
        />
      ) : null}

      <Link href={roadmapHref as never} asChild>
        <Pressable accessibilityRole="link" style={{ backgroundColor: c.heroBg, borderRadius: th.shape.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <ProgressRing value={s.done} total={s.total} onHero label={t('home.progress', { done: s.done, total: s.total, hours: s.hours })} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text size={12} weight="700" color={c.heroSub} uppercase>{t('home.stageOf', { n: stageIndex(current), city })}</Text>
            <Text size={19} lineHeight={24} weight="700" color={c.heroText}>{t(`stages.${current}`)}</Text>
            <Text size={14} color={c.heroSub}>{t('home.progress', { done: s.done, total: s.total, hours: s.hours })}</Text>
          </View>
          <Icon icon={ChevronRight} color={c.heroText} />
        </Pressable>
      </Link>

      <Card>
        <SectionTitle action={
          <Link href={roadmapHref as never} asChild>
            <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Text size={14} weight="600" color="primary">{t('common.seeAll', { count: s.total })}</Text></Pressable>
          </Link>
        }>{t('home.nextSteps')}</SectionTitle>
        {next3.map((v) => (
          <TaskItem key={v.id} title={v.title} term={v.task.term} due={v.due} timingNote={l(v.task.timingNote)} state={v.state}
            guideHref={v.guideHref} onToggle={(d) => toggle(v, d)} />
        ))}
      </Card>

      {deadlines.length ? (
        <View style={{ gap: 8 }}>
          <SectionTitle>{t('home.upcoming')}</SectionTitle>
          <Card padded={false} style={{ paddingHorizontal: 16 }}>
            {deadlines.slice(0, 3).map((v, i) => (
              <View key={v.id} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: i ? 1 : 0, borderColor: c.divider, paddingVertical: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text size={15} weight="600">{v.title}</Text>
                  <Text variant="caption" color="muted">{formatDate(v.due!, i18n.language)}</Text>
                </View>
                <DueChip due={v.due!} compact />
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      <Link href="/assist/scan" asChild>
        <Pressable accessibilityRole="link" style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}><Icon icon={ScanText} color="primary" /></View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text size={15} weight="600">{t('home.letterTitle')}</Text>
            <Text variant="caption" color="muted">{t('home.letterSub', { count: usage?.scansLeft ?? 3 })}</Text>
          </View>
          <Icon icon={ChevronRight} color="muted" />
        </Pressable>
      </Link>

      <View style={{ gap: 8 }}>
        <SectionTitle>{t('home.otherStages')}</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STAGES.map((id) => {
            const st = stats(id);
            const here = id === current;
            const done = st.total > 0 && st.done === st.total;
            return (
              <Link key={id} href={`/roadmap/${id}`} asChild>
                <Pressable accessibilityRole="link" aria-current={here ? 'true' : undefined}
                  style={{ flexBasis: '47%', flexGrow: 1, minHeight: 56, borderRadius: 12, borderWidth: here ? 2 : 1, borderColor: here ? c.primary : c.border, backgroundColor: here ? c.primaryTint : c.surface, paddingVertical: here ? 7 : 8, paddingHorizontal: here ? 11 : 12, justifyContent: 'center' }}>
                  <Text size={14} weight={here ? '700' : '600'}>{t(`stages.${id}`)}</Text>
                  {here ? <Text size={12} weight="600" color="primary">{t('home.youAreHere')}</Text>
                    : done ? <Text size={12} weight="600" color="successText">{t('home.stageDone')}</Text>
                    : <Text size={12} weight="500" color="muted">{t('home.steps', { count: st.total })}</Text>}
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>

      {/* Ad: Home, below the fold — native card, labelled (HANDOFF §7.6) */}
      <AdSlot format="native" placement="home" />
    </>
  );

  if (Platform.OS === 'web') {
    const name = profile.name;
    return (
      <Screen title={name ? t('home.hello', { name }) : t('home.helloAnon')} plainMain description={t('app.tagline')}
        aside={desktop ? <WebHomeAside /> : undefined}>
        {content}
      </Screen>
    );
  }
  return <Screen title={t('nav.home')} customHeader={<Greeting />}>{content}</Screen>;
}

function WebHomeAside() {
  const { t } = useTranslation();
  const { deadlines } = useRoadmapData();
  const { c } = useTheme();
  return (
    <Card style={{ gap: 8 }}>
      <SectionTitle>{t('home.upcoming')}</SectionTitle>
      {deadlines.length === 0 ? <Text color="muted">—</Text> : deadlines.slice(0, 5).map((v) => (
        <View key={v.id} style={{ gap: 4, paddingVertical: 6, borderTopWidth: 1, borderColor: c.divider }}>
          <Text size={14} weight="600">{v.title}</Text>
          <DueChip due={v.due!} compact />
        </View>
      ))}
      <Link href="/me/reminders"><Text size={14} weight="600" color="primary">{t('reminders.title')} →</Text></Link>
      <DeadlineChip tone="neutral" label={t('reminders.freeNote')} />
    </Card>
  );
}
