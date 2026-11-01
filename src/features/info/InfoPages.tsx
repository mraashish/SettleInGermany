import * as WebBrowser from 'expo-web-browser';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { useHelpServices, useL } from '@/content/client';
import { useTheme } from '@/theme/ThemeProvider';
import { AlertBanner, Card, Chip, DETag, Pill, Screen, SectionTitle, Text } from '@/ui';

const WAYS = [
  { title: 'Ads', body: 'Free users see a few clearly labelled ads. Personalised ads only appear if you agree.', points: ['Never inside guide steps, checklists or AI answers', 'No ads on emergency, paywall or document-date screens', 'We block payday loans, gambling, unlicensed immigration agents and “guaranteed visa” offers'] },
  { title: 'Premium', body: 'For €3.99 a month or €29.99 a year you get the AI tools and no ads. You can cancel any time.', points: ['Free information never moves behind the paywall', 'Free users get 3 letter scans a month', 'One subscription for web, Android and iPhone'] },
  { title: 'Referrals', body: 'Some providers pay us a commission when you sign up through our link. It costs you nothing extra.', points: ['Every referral link is labelled', 'Rankings are by fees or speed — never by commission', 'We also list providers that don’t pay us'] },
];
const NEVER = ['Sell your personal data', 'Let anyone pay to change a guide', 'Let partners write or edit our content', 'Hide information to push you to Premium'];

export function MoneyScreen() {
  return (
    <Screen title="How we make money" large={false} back={{ label: 'Me', href: '/me' }} crumbs={[{ label: 'Me', href: '/me' }, { label: 'How we make money' }]}
      description="All guides, checklists, reminders, calculators and comparisons are free. This is how we pay for them — in plain words.">
      <Text color="text2">All guides, checklists, reminders, calculators and comparisons are free. This is how we pay for them — in plain words.</Text>
      {WAYS.map((w, i) => (
        <Card key={w.title} style={{ gap: 8 }}>
          <Text size={17} weight="700" heading>{i + 1}. {w.title}</Text>
          <Text color="text2">{w.body}</Text>
          {w.points.map((p) => <Text key={p} size={14}>✓ {p}</Text>)}
        </Card>
      ))}
      <SectionTitle>What we never do</SectionTitle>
      <Card style={{ gap: 6 }}>{NEVER.map((n) => <Text key={n} size={14} color="danger">✕ <Text size={14}>{n}</Text></Text>)}</Card>
      <Card style={{ gap: 4 }}>
        <Text weight="600">Our referral partners</Text><Text variant="caption" color="muted">[X] partners · list updated [date]</Text>
        <Text weight="600" style={{ marginTop: 8 }}>Ad partners and your choices</Text>
        <Link href="/me/privacy"><Text size={14} color="primary" weight="600">Change consent any time</Text></Link>
      </Card>
      <Text size={14} color="text2">Something looks wrong or too salesy? <Text size={14} weight="600" color="primary" onPress={() => void Linking.openURL('mailto:hello@settleingermany.app')}>Tell us</Text> — we read every message.</Text>
    </Screen>
  );
}

export function HelpScreen() {
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { data = [] } = useHelpServices();
  const [topic, setTopic] = useState('All');
  return (
    <Screen title="Where to get help" large={false} back={{ label: 'Me', href: '/me' }} crumbs={[{ label: 'Me', href: '/me' }, { label: 'Where to get help' }]}
      description="Free and low-cost services for migrants and international students in Germany: migration counselling, tenants’ associations, lawyers and someone to talk to.">
      <Text color="text2">Our guides and AI give general information. For your own case, talk to a person. Many of these services are free.</Text>
      <AlertBanner kind="info" title="In danger right now?" body="Call 112. More emergency numbers in Safety." action={<Link href="/tools/safety"><Text size={14} weight="600" color="primary">Safety and emergency</Text></Link>} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {['All', 'Visa and residence', 'Housing', 'Work', 'Money', 'Health and wellbeing'].map((x) => <Chip key={x} label={x} selected={topic === x} onPress={() => setTopic(x)} />)}
      </View>
      {data.map((s) => (
        <View key={s.id} accessibilityRole={'article' as never} style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, padding: 16, gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Text weight="700" style={{ flex: 1 }}>{l(s.kind)}</Text>
            <Pill label={s.free ? 'Free' : 'Fee'} tone={s.free ? 'success' : 'neutral'} />
          </View>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><DETag /><Text lang="de" size={14} weight="500">{s.name}</Text></View>
          <Text color="text2">{l(s.description)}</Text>
          <Pressable accessibilityRole="link" onPress={() => (s.phone ? void Linking.openURL(`tel:${s.phone}`) : s.url ? void WebBrowser.openBrowserAsync(s.url) : undefined)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text weight="700" color="primary">{s.phone ? 'Call now' : 'Find a service near you'} →</Text>
          </Pressable>
        </View>
      ))}
      <Text variant="caption" color="muted">We don’t earn money from any service on this page. Last verified [date] · Report outdated information</Text>
    </Screen>
  );
}

/** Legal pages. TODO(product owner): final Impressum, privacy policy and terms text. */
export function LegalPage({ kind }: { kind: 'impressum' | 'privacy' | 'terms' }) {
  const title = { impressum: 'Impressum', privacy: 'Privacy policy', terms: 'Terms of use' }[kind];
  return (
    <Screen title={title} large={false} back={{ label: 'Me', href: '/me' }} crumbs={[{ label: 'Me', href: '/me' }, { label: title }]}>
      <Text color="text2">[{title} — final legal text from the product owner goes here.]</Text>
      {kind === 'impressum' ? <Text color="text2">[Company name]{'\n'}[Address]{'\n'}[Contact e-mail]{'\n'}[Register entry / VAT ID]</Text> : null}
      {kind === 'privacy' ? <Text color="text2">Summary: we store your profile, checklist progress, reminder dates and notes. Letter scans are deleted after processing unless you save them. Personalised ads and analytics only run with your consent. You can download or delete your data in Me › Privacy.</Text> : null}
    </Screen>
  );
}
