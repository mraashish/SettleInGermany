import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertOctagon, AlertTriangle, Check, FileText, Info, Mic, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useGuides, useL } from '@/content/client';
import { ai, type ContractClause, type ScamCheck } from '@/services/ai';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import {
  Button, Callout, Card, ChatBubble, Chip, DETag, Icon, LegalHelpCard, SectionTitle, Text, TextField, ToggleRow,
} from '@/ui';
import { AiScreen } from './AiScaffold';

function Composer({ value, onChange, onSend, placeholder, busy }: { value: string; onChange: (v: string) => void; onSend: () => void; placeholder: string; busy?: boolean }) {
  const th = useTheme();
  const { c } = th;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: c.surface, borderWidth: 1, borderColor: c.fieldBorder, borderRadius: th.shape.field === 4 ? 28 : 16, paddingLeft: 14, paddingRight: 4, paddingVertical: 4 }}>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={c.muted} multiline accessibilityLabel={placeholder}
        style={{ flex: 1, minHeight: 44, maxHeight: 140, fontFamily: fonts.regular, fontSize: 16, color: c.text, paddingVertical: 10 }} />
      <Pressable accessibilityRole="button" accessibilityLabel="Send" disabled={!value.trim() || busy} onPress={onSend}
        style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: value.trim() ? c.primary : c.divider, alignItems: 'center', justifyContent: 'center' }}>
        <Icon icon={Send} size={20} color={value.trim() ? c.onPrimary : c.muted} />
      </Pressable>
    </View>
  );
}

type Msg = { role: 'user' | 'ai'; text: string; sources?: { title: string; href: string }[]; legal?: boolean };

export function ChatScreen() {
  const { i18n } = useTranslation();
  const l = useL();
  const { data: guides = [] } = useGuides();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const ask = async (text: string) => {
    const next = [...msgs, { role: 'user' as const, text }];
    setMsgs(next); setQ(''); setBusy(true);
    try {
      const a = await ai.chat(next.map(({ role, text: t }) => ({ role, text: t })), i18n.language);
      setMsgs([...next, { role: 'ai', text: a.text, legal: a.legal, sources: a.sources.map((s) => ({ title: l(guides.find((g) => g.slug === s.slug)?.title) || s.title, href: `/guides/${s.slug}` })) }]);
    } finally { setBusy(false); }
  };
  const suggestions = ['How do I change my address?', 'Do I need a German phone number?', 'Can I start a student job before my residence permit appointment?'];
  return (
    <AiScreen title="Ask a question" premiumOnly footer={<Composer value={q} onChange={setQ} onSend={() => ask(q)} placeholder="Ask in English, नेपाली or हिन्दी" busy={busy} />}>
      {msgs.length === 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{suggestions.map((s) => <Chip key={s} label={s} onPress={() => ask(s)} />)}</View>
      ) : null}
      <View accessibilityLiveRegion="polite" style={{ gap: 10 }}>
        {msgs.map((m, i) => (
          <View key={i} style={{ gap: 8 }}>
            <ChatBubble role={m.role} text={m.text} sources={m.sources} />
            {m.legal ? <LegalHelpCard /> : null}
          </View>
        ))}
        {busy ? <ChatBubble role="ai" text="…" /> : null}
      </View>
    </AiScreen>
  );
}

/** Scam checker: risk level with icon + word. Never says "safe". */
export function ScamScreen() {
  const { i18n } = useTranslation();
  const { c } = useTheme();
  const [text, setText] = useState('');
  const [res, setRes] = useState<ScamCheck | null>(null);
  const [busy, setBusy] = useState(false);
  const risk = res ? {
    high: { label: 'High risk', icon: AlertOctagon, bg: c.dangerBg, fg: c.danger },
    medium: { label: 'Some warning signs', icon: AlertTriangle, bg: c.warningBg, fg: c.warningText },
    low: { label: 'No common warning signs found', icon: Info, bg: c.divider, fg: c.text3 },
  }[res.risk] : null;
  return (
    <AiScreen title="Housing scam checker" premiumOnly>
      {!res ? (
        <>
          <TextField label="Paste the listing or message" value={text} onChangeText={setText} multiline style={{ minHeight: 140, textAlignVertical: 'top' }} />
          <Button label="Check it" loading={busy} disabled={!text.trim()} onPress={async () => { setBusy(true); try { setRes(await ai.scam(text, i18n.language)); } finally { setBusy(false); } }} />
        </>
      ) : (
        <>
          <Card style={{ gap: 6 }}>
            <Text size={13} color="muted">The listing you pasted</Text>
            <Text color="text2" numberOfLines={4}>“{text}”</Text>
            <Button variant="text" fullWidth={false} label="Check another" onPress={() => { setRes(null); setText(''); }} />
          </Card>
          {risk ? (
            <View accessibilityRole="summary" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: risk.bg, borderRadius: 16, padding: 16 }}>
              <Icon icon={risk.icon} size={28} color={risk.fg} />
              <View><Text size={13} color={risk.fg}>Risk level</Text><Text size={20} weight="700" color={risk.fg}>{risk.label}</Text></View>
            </View>
          ) : null}
          {res.signs.length ? (
            <View style={{ gap: 8 }}><SectionTitle>Red flags we found</SectionTitle>
              {res.signs.map((s) => <View key={s} style={{ flexDirection: 'row', gap: 8 }}><Icon icon={AlertTriangle} size={18} color="danger" /><Text style={{ flex: 1 }}>{s}</Text></View>)}
            </View>
          ) : null}
          <SectionTitle>What to do next</SectionTitle>
          <Text>{res.advice}</Text>
          <Text variant="caption" color="muted">When we find nothing, we say “No common warning signs found” — never “safe”.</Text>
        </>
      )}
    </AiScreen>
  );
}

export function ContractScreen() {
  const { i18n } = useTranslation();
  const th = useTheme();
  const [file, setFile] = useState<string | null>(null);
  const [clauses, setClauses] = useState<ContractClause[] | null>(null);
  const [busy, setBusy] = useState(false);
  const pick = async () => {
    const r = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
    if (r.canceled) return;
    setFile(r.assets[0].name); setBusy(true);
    try { const a = r.assets[0]; setClauses((await ai.contract({ uri: a.uri, name: a.name, type: a.mimeType ?? 'application/pdf' }, i18n.language)).clauses); } finally { setBusy(false); }
  };
  return (
    <AiScreen title="Rental contract explainer" premiumOnly>
      {/* Fixed legal notice (HANDOFF §7.4) */}
      <Callout kind="legal" text="This is general information, not legal advice. For your specific case, contact a tenants’ association or lawyer." />
      {!clauses ? <Button icon={FileText} label="Choose your contract (PDF or photo)" loading={busy} onPress={pick} /> : (
        <>
          <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Icon icon={FileText} color="primary" />
            <View style={{ flex: 1 }}><Text weight="600">{file ?? 'Mietvertrag.pdf'}</Text><Text variant="caption" color="muted">{clauses.length} clauses · {clauses.filter((x) => x.flag).length} to check</Text></View>
          </Card>
          {clauses.map((cl, i) => (
            <View key={i} accessibilityRole={'article' as never} style={{ backgroundColor: th.c.surface, borderWidth: cl.flag ? 2 : 1, borderColor: cl.flag === 'danger' ? th.c.danger : cl.flag === 'warning' ? th.c.warningBorder : th.c.border, borderRadius: th.shape.card, padding: 14, gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Text size={13} weight="700" color="muted">§{i + 1}</Text><DETag /></View>
              <Text weight="700">{cl.title}</Text>
              <Text color="text2">{cl.plain}</Text>
              {cl.flag ? <Text size={13} weight="700" color={cl.flag === 'danger' ? 'danger' : 'warningText'}>{cl.flag === 'danger' ? '⚠ Check before you sign' : '⚠ Worth asking about'}</Text> : null}
            </View>
          ))}
        </>
      )}
    </AiScreen>
  );
}

export function FormScreen() {
  const { c } = useTheme();
  const { form } = useLocalSearchParams<{ form: string }>();
  const [answer, setAnswer] = useState<string | null>(null);
  // TODO(content): field definitions per form come from the CMS; one sample field shown.
  return (
    <AiScreen title="Form assistant" premiumOnly>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text weight="700">{form === 'anmeldung' ? 'Address registration form' : form}</Text>
        <Text color="muted">Field 7 of 18</Text>
      </View>
      <Card style={{ gap: 8 }}>
        <Text size={13} color="muted">On the form it says</Text>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><DETag large /><Text lang="de" size={18} weight="600">Familienstand</Text></View>
        <Text>What it means: your marital status — whether you are single, married, divorced or widowed.</Text>
        <View style={{ backgroundColor: c.primaryTint, borderRadius: 10, padding: 10 }}><Text size={14}>Example answer{'\n'}<Text size={14} weight="700">ledig</Text> = single, never married</Text></View>
      </Card>
      <View accessibilityRole="radiogroup" accessibilityLabel="Your answer" style={{ gap: 8 }}>
        <Text weight="600">Your answer</Text>
        {['ledig — single', 'verheiratet — married', 'Something else'].map((o) => <Chip key={o} label={o} selected={answer === o} onPress={() => setAnswer(o)} />)}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}><Button variant="secondary" label="Back" fullWidth={false} /><Button label="Next field" fullWidth={false} /></View>
      <Text variant="caption" color="muted">At the end you get a summary sheet to copy into the form or print.</Text>
    </AiScreen>
  );
}

export function JobKitScreen() {
  const { c } = useTheme();
  const [tab, setTab] = useState<'cv' | 'cover' | 'interview'>('cv');
  const [photo, setPhoto] = useState(true);
  const steps = [{ l: 'Personal details', d: true }, { l: 'Education', d: true }, { l: 'Work experience', d: false }, { l: 'Languages', d: false }, { l: 'Skills', d: false }];
  return (
    <AiScreen title="Job application kit" premiumOnly>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['cv', 'cover', 'interview'] as const).map((k) => <Chip key={k} label={k === 'cv' ? 'CV' : k === 'cover' ? 'Cover letter' : 'Interview'} selected={tab === k} onPress={() => setTab(k)} />)}
      </View>
      <Card padded={false} style={{ paddingHorizontal: 16 }}>
        {steps.map((s, i) => (
          <View key={s.l} style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: s.d ? c.successFill : c.divider, alignItems: 'center', justifyContent: 'center' }}>{s.d ? <Icon icon={Check} size={14} color={c.ground} strokeWidth={3} /> : null}</View>
            <Text weight="600">{s.l}</Text>
          </View>
        ))}
      </Card>
      <ToggleRow title="Include a photo" body="Common in Germany, optional" value={photo} onChange={setPhoto} />
      <Button label="Export as PDF" />
    </AiScreen>
  );
}

export function PracticeScreen() {
  const { c } = useTheme();
  const [msgs, setMsgs] = useState<{ role: 'user' | 'ai'; text: string; fix?: string; en?: string }[]>([
    { role: 'ai', text: 'Guten Tag. Haben Sie einen Termin?', en: 'Good day. Do you have an appointment?' },
  ]);
  const [q, setQ] = useState('');
  const send = async () => {
    const next = [...msgs, { role: 'user' as const, text: q }];
    setMsgs(next); setQ('');
    const r = await ai.practice('immigration-office', next.map(({ role, text }) => ({ role, text })));
    setMsgs([...next.slice(0, -1), { ...next[next.length - 1], fix: r.feedback }, { role: 'ai', text: r.text }]);
  };
  return (
    <AiScreen title="Conversation practice" premiumOnly
      footer={<View style={{ gap: 8 }}>
        <Composer value={q} onChange={setQ} onSend={send} placeholder="Type your answer in German" />
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
          <Button variant="secondary" icon={Mic} label="Hold to answer" fullWidth={false} />
          <Button variant="text" label="End practice" fullWidth={false} onPress={() => router.push('/assist/practice/summary')} />
        </View>
      </View>}>
      <View style={{ flexDirection: 'row', gap: 8 }}><Chip label="Immigration office" selected /><Chip label="Beginner" /></View>
      {msgs.map((m, i) => (
        <View key={i} style={{ gap: 4, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
          {m.role === 'ai' ? <Text size={12} weight="600" color="muted">Officer</Text> : null}
          <ChatBubble role={m.role} text={m.text} />
          {m.en ? <Text size={13} color="muted">{m.en}</Text> : null}
          {m.fix ? <View style={{ backgroundColor: c.warningBg, borderRadius: 10, padding: 8 }}><Text size={13} color="warningStrongText">Small fix: {m.fix}</Text></View> : null}
        </View>
      ))}
    </AiScreen>
  );
}

export function PracticeSummaryScreen() {
  const { c } = useTheme();
  return (
    <AiScreen title="Practice summary" premiumOnly back={{ label: 'Practice', href: '/assist/practice' }}>
      <View style={{ alignItems: 'center', gap: 6, paddingVertical: 8 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}><Icon icon={Check} size={36} color="onAccent" strokeWidth={3} /></View>
        <Text variant="title" heading={1}>Well done — [N] answers</Text>
        <Text color="muted">Immigration office · Beginner · [N] min</Text>
      </View>
      <SectionTitle>Corrections</SectionTitle>
      <Card style={{ gap: 8 }}>
        <Text lang="de"><Text lang="de" style={{ textDecorationLine: 'line-through' }} color="muted">ich habe Termin</Text> → <Text lang="de" weight="700">ich habe einen Termin</Text></Text>
      </Card>
      <SectionTitle>Useful phrases</SectionTitle>
      <Card style={{ gap: 8 }}>
        {['Hier ist mein Pass.', 'Wie lange dauert das?'].map((p) => (
          <View key={p} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text lang="de" weight="600">{p}</Text><Button variant="text" label="Save" fullWidth={false} /></View>
        ))}
      </Card>
      <Button label="Practise again" onPress={() => router.replace('/assist/practice')} />
      <Button variant="secondary" label="Try another situation" onPress={() => router.replace('/assist/practice')} />
    </AiScreen>
  );
}
