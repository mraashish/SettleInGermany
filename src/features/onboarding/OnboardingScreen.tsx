import { router } from 'expo-router';
import { ArrowLeft, Bell, CalendarClock, Check, ChevronLeft, ChevronRight, Compass, Mail } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useMyCity } from '@/content/city';
import { LANGUAGES, setLanguage } from '@/i18n';
import { formatDate } from '@/lib/deadline';
import { useLayout } from '@/lib/useLayout';
import { registerForRuleChangePush, requestPermission } from '@/services/notifications';
import { prefsStore, setProfile, type StageId, usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Icon, SelectCard, SiteHeader, Text } from '@/ui';
import { useRoadmapData } from '../roadmap/useRoadmapData';
import { AccountStep } from './AccountStep';
import { CityStep } from './CityStep';

/** Mon–Sun short names in the UI language. */
function weekdays(lang: string) {
  const monday = new Date(Date.UTC(2024, 0, 1));
  return Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : lang, { weekday: 'short', timeZone: 'UTC' }).format(new Date(monday.getTime() + i * 86400000)));
}

const TOTAL = 9;

export function goStep(n: number) {
  prefsStore.set({ onboardingStep: n });
  if (n > TOTAL) {
    prefsStore.set({ onboarded: true });
    router.replace(`/roadmap/${prefsStore.get().profile.stage}`);
  } else router.push(`/onboarding/${n}`);
}

function finish() {
  prefsStore.set({ onboarded: true });
  router.replace('/');
}

function Header({ step }: { step: number }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const label = t('onboarding.step', { n: step });
  const back = () => (router.canGoBack() ? router.back() : router.replace(`/onboarding/${step - 1}`));
  const skip = () => (step >= 8 ? finish() : goStep(step + 1));
  const pct = `${(step / TOTAL) * 100}%` as const;
  if (th.platform === 'android') {
    return (
      <View style={{ height: 64, justifyContent: 'center', gap: 6 }}>
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('nav.back')} onPress={back} style={{ width: 48, height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon={ArrowLeft} />
          </Pressable>
          <Text size={14} color="muted">{label}</Text>
          <Button variant="text" label={t('nav.skip')} onPress={skip} fullWidth={false} />
        </View>
        <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 1, max: TOTAL, now: step }} style={{ height: 4, backgroundColor: th.scheme === 'dark' ? '#1F4442' : '#CFE3E3' }}>
          <View style={{ height: 4, width: pct, backgroundColor: c.primary }} />
        </View>
      </View>
    );
  }
  return (
    <View style={{ height: 64, justifyContent: 'center', gap: 6 }}>
      <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }}>
        <Pressable accessibilityRole="button" onPress={back} style={{ height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
          <Icon icon={ChevronLeft} color="primary" />
          <Text size={17} weight="500" color="primary">{t('nav.back')}</Text>
        </Pressable>
        <Text size={13} color="muted">{label}</Text>
        <Pressable accessibilityRole="button" onPress={skip} style={{ height: 44, justifyContent: 'center', paddingHorizontal: 12 }}>
          <Text size={17} weight="500" color="primary">{t('nav.skip')}</Text>
        </Pressable>
      </View>
      <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 1, max: TOTAL, now: step }} style={{ height: 4, marginHorizontal: 20, borderRadius: 999, backgroundColor: c.border, overflow: 'hidden' }}>
        <View style={{ height: 4, width: pct, borderRadius: 999, backgroundColor: c.primary }} />
      </View>
    </View>
  );
}

function Title({ title, sub }: { title: string; sub?: string }) {
  const th = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text size={28} lineHeight={34} weight={th.platform === 'android' ? '600' : '700'} heading={1}>{title}</Text>
      {sub ? <Text size={16} lineHeight={24} color="muted">{sub}</Text> : null}
    </View>
  );
}

function Step1() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const lang = usePrefs((s) => s.language);
  return (
    <>
      <View style={{ alignItems: 'center', paddingTop: 12 }}>
        {/* TODO(product owner): welcome illustration (placeholder) */}
        <View style={{ width: 96, height: 96, borderRadius: 28, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Icon icon={Compass} size={48} color={c.onPrimary} />
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Text size={30} lineHeight={36} weight="700" align="center" heading={1}>{t('app.name')}</Text>
        <Text size={17} lineHeight={25} color="text2" align="center">{t('app.tagline')}</Text>
      </View>
      <View accessibilityRole="radiogroup" accessibilityLabel={t('onboarding.chooseLanguage')} style={{ gap: 10 }}>
        <Text size={15} weight="600">{t('onboarding.chooseLanguage')}</Text>
        {LANGUAGES.map((l) => (
          <SelectCard key={l.code} minHeight={56} title={l.code === 'en' ? l.native : `${l.native}  ·  ${l.english}`} selected={lang === l.code} onPress={() => setLanguage(l.code)} />
        ))}
      </View>
    </>
  );
}

function Choice<T extends string>({ value, options, onPick }: { value: T | null; options: { id: T; title: string; sub?: string; term?: string }[]; onPick: (v: T) => void }) {
  return (
    <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
      {options.map((o) => <SelectCard key={o.id} title={o.title} sub={o.sub} term={o.term} selected={value === o.id} onPress={() => onPick(o.id)} minHeight={o.sub || o.term ? 72 : 64} />)}
    </View>
  );
}

function CalendarPicker({ value, onChange }: { value: string | null; onChange: (iso: string) => void }) {
  const { t, i18n } = useTranslation();
  const { c } = useTheme();
  const init = value ? new Date(value) : new Date();
  const [month, setMonth] = useState(new Date(init.getFullYear(), init.getMonth(), 1));
  const days = useMemo(() => {
    const first = (month.getDay() + 6) % 7; // Monday first
    const n = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)] as (number | null)[];
  }, [month]);
  const iso = (d: number) => new Date(Date.UTC(month.getFullYear(), month.getMonth(), d)).toISOString().slice(0, 10);
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  return (
    <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 12, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('onboarding.prevMonth')} onPress={() => shift(-1)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon icon={ChevronLeft} color="primary" /></Pressable>
        <Text weight="600" accessibilityLiveRegion="polite">{formatDate(month, i18n.language, { month: 'long', year: 'numeric' })}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={t('onboarding.nextMonth')} onPress={() => shift(1)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon icon={ChevronRight} color="primary" /></Pressable>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {weekdays(i18n.language).map((d) => <Text key={d} size={12} color="muted" align="center" style={{ flex: 1 }}>{d}</Text>)}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {days.map((d, i) => {
          const on = d !== null && value === iso(d);
          return (
            <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 2 }}>
              {d ? (
                <Pressable accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={formatDate(iso(d), i18n.language, { weekday: 'long', day: 'numeric', month: 'long' })}
                  onPress={() => onChange(iso(d))}
                  style={{ flex: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.primary : 'transparent' }}>
                  <Text size={15} weight={on ? '700' : '400'} color={on ? c.onPrimary : c.text}>{d}</Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function OnboardingScreen({ step }: { step: number }) {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const { webWide } = useLayout();
  const profile = usePrefs((s) => s.profile);
  const myCity = useMyCity();
  const { next3, stats } = useRoadmapData(profile.stage);

  let body: React.ReactNode = null;
  let primary: { label: string; onPress: () => void } | null = { label: t('nav.continue'), onPress: () => goStep(step + 1) };
  let secondary: { label: string; onPress: () => void } | null = null;

  switch (step) {
    case 1:
      body = <Step1 />;
      primary = { label: t('onboarding.getStarted'), onPress: () => goStep(2) };
      secondary = { label: t('onboarding.haveAccount'), onPress: () => goStep(8) };
      break;
    case 2:
      body = (
        <>
          <Title title={t('onboarding.fromTitle')} sub={t('onboarding.fromSub')} />
          <Choice value={profile.nationality} onPick={(v) => setProfile({ nationality: v })} options={[
            { id: 'nepal', title: t('onboarding.nepal') }, { id: 'india', title: t('onboarding.india') }, { id: 'other', title: t('onboarding.otherCountry') },
          ]} />
        </>
      );
      break;
    case 3:
      body = (
        <>
          <Title title={t('onboarding.statusTitle')} sub={t('onboarding.statusSub')} />
          <Choice value={profile.status} onPick={(v) => setProfile({ status: v })} options={[
            { id: 'student', title: t('onboarding.student'), sub: t('onboarding.studentSub') },
            { id: 'trainee', title: t('onboarding.trainee'), term: 'Ausbildung' },
            { id: 'worker', title: t('onboarding.worker'), sub: t('onboarding.workerSub') },
            { id: 'family', title: t('onboarding.family'), sub: t('onboarding.familySub') },
          ]} />
        </>
      );
      break;
    case 4:
      body = (
        <>
          <Title title={t('onboarding.cityTitle')} sub={t('onboarding.citySub')} />
          <CityStep />
        </>
      );
      break;
    case 5:
      body = (
        <>
          <Title title={t('onboarding.stageTitle')} sub={t('onboarding.stageSub')} />
          <Choice<StageId> value={profile.stage} onPick={(v) => setProfile({ stage: v })} options={[
            { id: 'before', title: t('onboarding.stageBefore') },
            { id: 'first30', title: t('onboarding.stageFirst30'), sub: t('onboarding.stageFirst30Sub') },
            { id: 'living', title: t('onboarding.stageLiving') },
            { id: 'career', title: t('onboarding.stageCareer') },
          ]} />
        </>
      );
      break;
    case 6:
      body = (
        <>
          <Title title={t('onboarding.arrivalTitle')} sub={t('onboarding.arrivalSub')} />
          <CalendarPicker value={profile.arrivalDate} onChange={(d) => setProfile({ arrivalDate: d })} />
          {profile.arrivalDate ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Icon icon={Check} size={18} color="successText" />
              <Text weight="600" color="successText">{t('onboarding.arrived', { date: formatDate(profile.arrivalDate, i18n.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) })}</Text>
            </View>
          ) : null}
        </>
      );
      secondary = { label: t('onboarding.notSure'), onPress: () => { setProfile({ arrivalDate: null }); goStep(7); } };
      break;
    case 7:
      body = (
        <>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Bell} size={40} color="primary" /></View>
          </View>
          <Title title={t('onboarding.notifTitle')} sub={t('onboarding.notifSub')} />
          <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 14, gap: 12 }}>
            {[{ i: CalendarClock, s: t('onboarding.notifExample') }, { i: Bell, s: t('onboarding.notifAppointments') }, { i: Mail, s: t('onboarding.notifRules') }].map((x) => (
              <View key={x.s} style={{ flexDirection: 'row', gap: 12 }}><Icon icon={x.i} size={20} color="primary" /><Text style={{ flex: 1 }} color="text2">{x.s}</Text></View>
            ))}
          </View>
          {Platform.OS !== 'web' ? <Text variant="caption" color="muted" align="center">{t('onboarding.notifPrompt')}</Text> : null}
        </>
      );
      primary = {
        label: t('onboarding.turnOn'),
        onPress: async () => {
          prefsStore.set({ notificationsAsked: true });
          if (await requestPermission()) void registerForRuleChangePush(prefsStore.get().profile, prefsStore.get().language);
          goStep(8);
        },
      };
      secondary = { label: t('onboarding.notNow'), onPress: () => goStep(8) };
      break;
    case 8:
      body = (
        <>
          <Title title={t('onboarding.accountTitle')} sub={t('onboarding.accountSub')} />
          <AccountStep onDone={() => goStep(9)} />
        </>
      );
      primary = { label: t('onboarding.noAccount'), onPress: () => { prefsStore.set({ accountMode: 'local' }); goStep(9); } };
      secondary = null;
      break;
    case 9: {
      const s = stats(profile.stage);
      const city = myCity.name || '—';
      body = (
        <>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Check} size={44} color="onAccent" strokeWidth={3} /></View>
          </View>
          <Title title={t('onboarding.readyTitle')} sub={t('onboarding.readySub', { stage: t(`stages.${profile.stage}`), city, count: s.total })} />
          <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, paddingHorizontal: 16 }}>
            {next3.map((v, i) => (
              <View key={v.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 56, borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.primaryTint, alignItems: 'center', justifyContent: 'center' }}><Text size={14} weight="700" color="primary">{i + 1}</Text></View>
                <Text weight="600" style={{ flex: 1 }}>{v.title}</Text>
              </View>
            ))}
          </View>
          <Text variant="caption" color="muted" align="center">{t('onboarding.changeLater')}</Text>
        </>
      );
      primary = { label: t('onboarding.goRoadmap'), onPress: () => goStep(10) };
      secondary = null;
      break;
    }
    default:
      body = null;
  }

  const content = (
    <View style={{ flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center' }}>
      {step > 1 ? <Header step={step} /> : null}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: step === 1 ? 56 : 20, paddingBottom: 32, gap: step === 1 ? 24 : 20 }} keyboardShouldPersistTaps="handled">
        {body}
        <View style={{ marginTop: 'auto', gap: 8, paddingTop: 16 }}>
          {primary ? <Button label={primary.label} size="large" onPress={primary.onPress} /> : null}
          {secondary ? <Button variant="text" label={secondary.label} onPress={secondary.onPress} /> : null}
        </View>
      </ScrollView>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: c.ground }}>
        <SiteHeader />
        <View style={{ flex: 1, paddingVertical: webWide ? 24 : 0 }}>
          <View style={webWide ? { flex: 1, width: 600, maxWidth: '94%', alignSelf: 'center', backgroundColor: c.ground, borderWidth: 1, borderColor: c.border, borderRadius: 20, overflow: 'hidden' } : { flex: 1 }}>
            {content}
          </View>
        </View>
      </View>
    );
  }
  return <SafeAreaView style={{ flex: 1, backgroundColor: c.ground }}>{content}</SafeAreaView>;
}
