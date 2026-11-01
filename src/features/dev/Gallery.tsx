import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { guides, providers } from '@/content/seed';
import { useLayout } from '@/lib/useLayout';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import type { ColorScheme } from '@/theme/tokens';
import {
  AdSlot, AIResultBlock, AlertBanner, AppBar, Button, Callout, Card, ChatBubble, Chip, DeadlineChip, EmptyState, ErrorState,
  GermanTerm, GuideCard, LegalHelpCard, OfflineBanner, OutdatedBanner, PremiumTile, ProgressBar, ProgressRing, ProviderCard,
  ProviderTable, Sheet, Skeleton, StageSwitcher, TabBar, TaskItem, Text, TextField, ToggleRow, UpgradeCard,
} from '@/ui';
import { AdPlaceholder } from '@/ui/NativeAd.shared';

const soon = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 20, gap: 12, width: 380, maxWidth: '100%' }}>
      <Text size={17} weight="700" heading>{title}</Text>
      {children}
    </View>
  );
}

function Column() {
  const { c, scheme } = useTheme();
  const [sheet, setSheet] = useState(false);
  const [stage, setStage] = useState('first30');
  const [tog, setTog] = useState(true);
  return (
    <View style={{ backgroundColor: c.ground, padding: 24, gap: 20, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Text size={13} weight="700" color="primary" uppercase style={{ width: '100%' }}>Calm Ledger · {scheme}</Text>
      <Section title="Button">
        {(['primary', 'secondary', 'text', 'destructive', 'premium'] as const).map((v) => <Button key={v} variant={v} label={v[0].toUpperCase() + v.slice(1)} />)}
        <Button label="Loading…" loading />
      </Section>
      <Section title="Task item">
        <TaskItem first title="Register your address" term={{ term: 'Anmeldung' }} due={soon(21)} state="open" guideHref="/guides/register-your-address" />
        <TaskItem title="Open a bank account" state="done" doneLabel="Done · just now" />
        <TaskItem title="Pay the broadcasting fee" term={{ term: 'Rundfunkbeitrag' }} due={soon(-3)} state="overdue" />
        <TaskItem title="Driving licence exchange" term={{ term: 'Führerschein' }} state="hidden" onHide={() => undefined} />
      </Section>
      <Section title="Deadline chip">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <DeadlineChip tone="neutral" label="In 47 days" /><DeadlineChip tone="warning" label="Soon · 21 days" />
          <DeadlineChip tone="danger" label="Urgent · 5 days" /><DeadlineChip tone="done" label="Done" />
        </View>
        <Text size={17} weight="700">German term tag</Text>
        <GermanTerm term={{ term: 'Bürgeramt' }} />
        <GermanTerm term={{ term: 'Aufenthaltstitel' }} audio />
      </Section>
      <Section title="Guide card">
        {guides.slice(0, 3).map((g, i) => <GuideCard key={g.slug} guide={g} first={i === 0} />)}
      </Section>
      <Section title="Callout">
        <Callout kind="tip" text="Check for slots early in the morning." />
        <Callout kind="warning" text="Register again when you move." />
        <Callout kind="mistake" text="Waiting doesn’t pause the deadline." />
        <Callout kind="legal" text="General information, not legal advice." />
      </Section>
      <Section title="Provider card">
        <ProviderCard provider={providers[0]} highlighted badge="Lowest fees" />
        <ProviderCard provider={providers[1]} />
      </Section>
      <Section title="Progress">
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <ProgressRing value={4} total={9} />
          <View style={{ backgroundColor: c.heroBg, padding: 8, borderRadius: 12 }}><ProgressRing value={4} total={9} onHero /></View>
        </View>
        <ProgressBar value={45} max={100} label="Work-day limit · normal" />
        <ProgressBar value={88} max={100} label="Work-day limit · near the limit" />
      </Section>
      <Section title="AI result block">
        <AIResultBlock title="Summary"><Text size={14}>They need two more documents before deciding on your permit.</Text></AIResultBlock>
        <Text size={17} weight="700">Premium lock</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}><PremiumTile title="Reply writer" sub="Tile overlay" href="/premium" locked /></View>
        <UpgradeCard title="That was your last free scan" body="Inline card" />
      </Section>
      <Section title="Ad slot">
        <View style={{ height: 64, borderWidth: 1, borderStyle: 'dashed', borderColor: c.borderStrong, borderRadius: 10 }}><AdPlaceholder format="banner" /></View>
        <View style={{ height: 104, borderWidth: 1, borderColor: c.border, borderRadius: 16 }}><AdPlaceholder format="native" /></View>
        <AdSlot format="banner" placement="gallery" />
        <Text size={17} weight="700">Alert banner</Text>
        <AlertBanner kind="info" title="Info" body="dismissible" onDismiss={() => undefined} />
        <AlertBanner kind="rule" title="Rule change" body="dismissible" onDismiss={() => undefined} />
        <AlertBanner kind="urgent" title="Urgent" body="not dismissible" />
      </Section>
      <Section title="Sheet / modal">
        <Button variant="secondary" label="Open add-reminder sheet" onPress={() => setSheet(true)} />
        <Sheet visible={sheet} title="New reminder" onClose={() => setSheet(false)} onSave={() => setSheet(false)}>
          <TextField label="What is it?" placeholder="Visa" />
        </Sheet>
        <ToggleRow title="Toggle" body="Switch row" value={tog} onChange={setTog} />
        <TextField label="Text field" placeholder="Type here" hint="Hint text" />
        <View style={{ flexDirection: 'row', gap: 8 }}><Chip label="Chip" selected /><Chip label="Chip" /></View>
      </Section>
      <Section title="Chat bubble">
        <ChatBubble role="user" text="User message" />
        <ChatBubble role="ai" text="AI answer" />
        <ChatBubble role="ai" text="AI answer with sources" sources={[{ title: 'Student jobs', href: '/guides/student-jobs' }]} />
        <LegalHelpCard />
      </Section>
      <Section title="App bar · stage switcher · tab bar">
        <AppBar title="Roadmap" back={{ label: 'Home' }} large={false} />
        <StageSwitcher label="Stages" value={stage} onChange={setStage} options={[{ id: 'before', label: 'Before' }, { id: 'first30', label: 'First 30' }, { id: 'living', label: 'Living' }, { id: 'career', label: 'Career' }]} />
        <TabBar active="home" variant="ios" />
        <TabBar active="guides" variant="android" />
      </Section>
      <Section title="States">
        <OfflineBanner />
        <OutdatedBanner lastVerified="[date, 7 months ago]" />
        <Skeleton lines={2} />
        <EmptyState title="No reminders yet" body="Add your visa expiry date and we’ll remind you 90, 30 and 7 days before." actionLabel="Add your visa expiry date" />
        <ErrorState onRetry={() => undefined} />
      </Section>
      <Section title="Provider table (web desktop)">
        <ScrollView horizontal><View style={{ width: 640 }}><ProviderTable providers={providers.slice(0, 3)} /></View></ScrollView>
      </Section>
      <Card><Text>Card</Text></Card>
    </View>
  );
}

/** Dev-only gallery mirroring Library.dc.html, light and dark side by side. */
export function Gallery() {
  const { desktop } = useLayout();
  if (!__DEV__) return <View style={{ padding: 24 }}><Text>Not available.</Text></View>;
  const schemes: ColorScheme[] = ['light', 'dark'];
  return (
    <ScrollView>
      <View style={{ flexDirection: desktop ? 'row' : 'column' }}>
        {schemes.map((s) => (
          <View key={s} style={{ flex: 1 }}>
            <ThemeProvider forceScheme={s}><Column /></ThemeProvider>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
