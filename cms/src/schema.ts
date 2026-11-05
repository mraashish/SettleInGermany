import type { CollectionName } from '../../src/content/collections';
import type { Json } from './store';

/**
 * Field definitions for every collection (HANDOFF §8). The editor renders forms
 * from these; the shapes match src/content/types.ts, which the apps read.
 */
export type Field =
  | { type: 'text' | 'textarea' | 'url' | 'date' | 'number' | 'boolean'; name: string; label: string; help?: string; required?: boolean; placeholder?: string }
  | { type: 'select'; name: string; label: string; options: { value: string; label: string }[]; help?: string; required?: boolean; optional?: boolean }
  | { type: 'localized'; name: string; label: string; multiline?: boolean; help?: string; required?: boolean }
  | { type: 'term'; name: string; label: string; help?: string; required?: boolean }
  | { type: 'tags'; name: string; label: string; help?: string; suggestions?: string[] }
  | { type: 'reference'; name: string; label: string; collection: CollectionName; help?: string }
  | { type: 'file'; name: string; label: string; accept: string; help?: string }
  | { type: 'localizedList'; name: string; label: string; itemLabel: string; help?: string }
  | { type: 'group'; name: string; label: string; fields: Field[]; help?: string; optional?: boolean }
  | { type: 'list'; name: string; label: string; itemLabel: string; fields: Field[]; help?: string; summary?: (item: Json) => string };

export interface CollectionDef {
  name: CollectionName;
  label: string;
  singular: string;
  description: string;
  fields: Field[];
  title: (d: Json) => string;
  subtitle?: (d: Json) => string;
  blank: () => Json;
  singleton?: boolean;
}

const STAGES = [
  { value: 'before', label: 'Before arrival' },
  { value: 'first30', label: 'First 30 days' },
  { value: 'living', label: 'Living in Germany' },
  { value: 'career', label: 'Career and staying on' },
];
const NATIONALITIES = ['nepal', 'india', 'other'];
const STATUSES = ['student', 'trainee', 'worker', 'family'];

const TOPICS = ['visa', 'housing', 'work', 'money', 'health', 'study'];

/** Official sources — shown on the page they back (HANDOFF §7.8). */
const sourcesField = (help = 'Official pages this is based on. Shown to users.'): Field => ({
  type: 'list', name: 'sources', label: 'Official sources', itemLabel: 'source', summary: (s) => String(s.title ?? ''), help, fields: [
    { type: 'text', name: 'title', label: 'Title' },
    { type: 'url', name: 'url', label: 'URL' },
  ],
});

const L = (d: Json, k: string) => ((d[k] as Json | undefined)?.en as string | undefined) ?? '';
const today = () => new Date().toISOString().slice(0, 10);
const shortId = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;
const emptyL = () => ({ en: '' });

export const COLLECTION_DEFS: CollectionDef[] = [
  {
    name: 'guides', label: 'Guides', singular: 'guide',
    description: 'Step-by-step guides. Shown in the apps and as public, crawlable web pages.',
    title: (d) => L(d, 'title') || '(untitled guide)',
    subtitle: (d) => `${(d.term as Json | undefined)?.term ?? ''} · ${d.stage ?? ''}`,
    blank: () => ({
      slug: '', title: emptyL(), term: { term: '' }, stage: 'first30', readingMinutes: 5, lastVerified: today(),
      summary: { what: emptyL(), when: emptyL(), deadline: emptyL() }, steps: [], documents: [],
      callouts: [{ kind: 'legal', text: { en: 'General information, not legal advice.' } }], related: [], sources: [],
    }),
    fields: [
      { type: 'localized', name: 'title', label: 'Title', required: true },
      { type: 'text', name: 'slug', label: 'Slug (web address)', required: true, help: 'Lowercase words with dashes, e.g. register-your-address. Changing it later breaks links.' },
      { type: 'term', name: 'term', label: 'German term', required: true },
      { type: 'select', name: 'stage', label: 'Stage', options: STAGES, required: true },
      { type: 'reference', name: 'city', label: 'City (only for city-specific guides)', collection: 'cities' },
      { type: 'number', name: 'readingMinutes', label: 'Reading time (minutes)' },
      { type: 'date', name: 'lastVerified', label: 'Last verified', required: true, help: 'Guides older than 6 months show “We’re re-checking this guide”.' },
      { type: 'boolean', name: 'updatedRecently', label: 'Show “Updated” badge' },
      {
        type: 'group', name: 'summary', label: 'In short', fields: [
          { type: 'localized', name: 'what', label: 'What' },
          { type: 'localized', name: 'when', label: 'When' },
          { type: 'localized', name: 'deadline', label: 'Deadline' },
        ],
      },
      {
        type: 'list', name: 'steps', label: 'Steps', itemLabel: 'step', summary: (s) => L(s, 'title'), fields: [
          { type: 'localized', name: 'title', label: 'Title' },
          { type: 'localized', name: 'body', label: 'What to do', multiline: true },
          { type: 'term', name: 'term', label: 'German term (optional)' },
          { type: 'localized', name: 'where', label: 'Where' },
          { type: 'localized', name: 'cost', label: 'Typical cost' },
          { type: 'localized', name: 'wait', label: 'Typical wait' },
          { type: 'localizedList', name: 'documents', label: 'Documents for this step', itemLabel: 'document' },
        ],
      },
      { type: 'localizedList', name: 'documents', label: 'Documents to bring', itemLabel: 'document' },
      {
        type: 'list', name: 'callouts', label: 'Callouts', itemLabel: 'callout', summary: (c) => `${c.kind}: ${L(c, 'text')}`, fields: [
          { type: 'select', name: 'kind', label: 'Kind', options: [
            { value: 'tip', label: 'Tip (teal)' }, { value: 'warning', label: 'Warning (amber)' },
            { value: 'mistake', label: 'Common mistake (red)' }, { value: 'legal', label: 'Legal notice (grey)' },
          ] },
          { type: 'localized', name: 'text', label: 'Text', multiline: true },
        ],
      },
      {
        type: 'list', name: 'related', label: 'Related guides and tools', itemLabel: 'link', summary: (r) => L(r, 'title'), fields: [
          { type: 'select', name: 'kind', label: 'Kind', options: [{ value: 'guide', label: 'Guide' }, { value: 'tool', label: 'Tool' }] },
          { type: 'localized', name: 'title', label: 'Title' },
          { type: 'text', name: 'href', label: 'Link inside the app', placeholder: '/guides/get-your-tax-id' },
        ],
      },
      sourcesField('Required: every guide shows its sources.'),
      {
        type: 'group', name: 'compareLink', label: 'Comparison link on the guide card', optional: true, fields: [
          { type: 'localized', name: 'label', label: 'Label' },
          { type: 'text', name: 'href', label: 'Link', placeholder: '/tools/compare/bank-accounts' },
        ],
      },
    ],
  },
  {
    name: 'tasks', label: 'Roadmap tasks', singular: 'task',
    description: 'Steps on each user’s roadmap. Deadlines are counted from the arrival date.',
    title: (d) => L(d, 'title') || '(untitled task)',
    subtitle: (d) => `${d.stage ?? ''} · ${L(d, 'group')}`,
    blank: () => ({ id: shortId('task'), stage: 'first30', group: emptyL(), title: emptyL() }),
    fields: [
      { type: 'localized', name: 'title', label: 'Title', required: true },
      { type: 'text', name: 'id', label: 'ID', required: true, help: 'Stays the same forever — users’ progress is saved against it.' },
      { type: 'select', name: 'stage', label: 'Stage', options: STAGES, required: true },
      { type: 'localized', name: 'group', label: 'Group', required: true, help: 'e.g. Paperwork, Money, Health' },
      { type: 'term', name: 'term', label: 'German term' },
      { type: 'localized', name: 'effort', label: 'Effort', help: 'e.g. about 1 h' },
      { type: 'number', name: 'deadlineDaysAfterArrival', label: 'Deadline (days after arrival)' },
      { type: 'date', name: 'deadlineDate', label: 'Fixed deadline date' },
      { type: 'localized', name: 'timingNote', label: 'Timing note instead of a deadline', help: 'e.g. Arrives by post' },
      { type: 'reference', name: 'guideSlug', label: 'Guide (“How to” link)', collection: 'guides' },
      { type: 'tags', name: 'statuses', label: 'Only for these statuses (empty = everyone)', suggestions: STATUSES },
    ],
  },
  {
    name: 'cities', label: 'Cities', singular: 'city',
    description: 'City pages: facts, appointment instructions and community places.',
    title: (d) => String(d.name ?? '') || '(unnamed city)',
    blank: () => ({ slug: '', name: '', facts: [], appointments: [], community: [] }),
    fields: [
      { type: 'text', name: 'name', label: 'Name', required: true },
      { type: 'text', name: 'slug', label: 'Slug', required: true },
      { type: 'list', name: 'facts', label: 'Facts', itemLabel: 'fact', summary: (f) => L(f, 'label'), fields: [
        { type: 'localized', name: 'label', label: 'Label' }, { type: 'localized', name: 'value', label: 'Value' },
      ] },
      { type: 'list', name: 'appointments', label: 'Appointments', itemLabel: 'office', summary: (a) => L(a, 'title'), fields: [
        { type: 'localized', name: 'title', label: 'Office' }, { type: 'localized', name: 'body', label: 'How to book', multiline: true }, { type: 'url', name: 'url', label: 'Booking link' },
      ] },
      { type: 'list', name: 'community', label: 'Community places', itemLabel: 'place', summary: (p) => String(p.name ?? ''), fields: [
        { type: 'text', name: 'name', label: 'Name' }, { type: 'localized', name: 'kind', label: 'Kind (Advice, Groceries, Temples…)' },
        { type: 'localized', name: 'description', label: 'Description' }, { type: 'text', name: 'address', label: 'Address' },
        { type: 'text', name: 'phone', label: 'Phone' }, { type: 'url', name: 'url', label: 'Website' }, { type: 'url', name: 'mapUrl', label: 'Map link' },
      ] },
      { type: 'list', name: 'budget', label: 'Budget planner starting values (€ a month)', itemLabel: 'item', summary: (b) => `${L(b, 'label')}: €${b.value ?? ''}`, fields: [
        { type: 'localized', name: 'label', label: 'Item' }, { type: 'number', name: 'value', label: 'Typical € a month' },
      ] },
      { type: 'date', name: 'lastVerified', label: 'Last verified' },
      sourcesField(),
    ],
  },
  {
    name: 'rules', label: 'Rules and limits', singular: 'rules', singleton: true,
    description: 'Numbers used by calculators and guides — change them here, no app release needed. 0 = unknown (apps show a placeholder).',
    title: () => 'Rules and limits',
    blank: () => ({ studentWorkFullDays: 0, studentWorkHalfDays: 0, blockedAccountMonthly: 0, miniJobLimitMonthly: 0, lastVerified: today() }),
    fields: [
      { type: 'number', name: 'studentWorkFullDays', label: 'Student work limit (full days a year)' },
      { type: 'number', name: 'studentWorkHalfDays', label: 'Student work limit (half days a year)' },
      { type: 'number', name: 'blockedAccountMonthly', label: 'Blocked account monthly payout (€)' },
      { type: 'number', name: 'miniJobLimitMonthly', label: 'Mini-job limit (€ a month)' },
      { type: 'number', name: 'minimumWage', label: 'Minimum wage (€ an hour)' },
      { type: 'number', name: 'basicTaxAllowance', label: 'Tax-free basic allowance (€ a year)' },
      { type: 'number', name: 'miniJobPensionPercent', label: 'Mini-job pension contribution (%)' },
      { type: 'number', name: 'studentPensionPercent', label: 'Working-student pension contribution (%)' },
      { type: 'number', name: 'studentWeeklyHours', label: 'Student alternative limit (hours a week)' },
      { type: 'number', name: 'fullDayHours', label: 'A day counts as full above (hours)' },
      { type: 'number', name: 'broadcastingFeeMonthly', label: 'Broadcasting fee (€ a month)' },
      { type: 'number', name: 'deutschlandticketMonthly', label: 'Deutschlandticket (€ a month)' },
      { type: 'text', name: 'lastVerified', label: 'Last verified' },
      sourcesField(),
    ],
  },
  {
    name: 'ruleChanges', label: 'Rule changes', singular: 'rule change',
    description: 'Publishing a NEW rule change sends a push notification to affected users only.',
    title: (d) => L(d, 'summary') || '(no summary)',
    subtitle: (d) => String(d.date ?? ''),
    blank: () => ({ id: shortId('rc'), date: today(), affects: { nationalities: [], statuses: [], cities: [] }, summary: emptyL() }),
    fields: [
      { type: 'localized', name: 'title', label: 'Title' },
      { type: 'localized', name: 'summary', label: 'Summary', multiline: true, required: true },
      { type: 'text', name: 'id', label: 'ID', required: true },
      { type: 'text', name: 'date', label: 'Date', required: true, help: 'As shown to users, e.g. 1 Dec 2026' },
      { type: 'group', name: 'affects', label: 'Who is affected (empty = everyone)', fields: [
        { type: 'tags', name: 'nationalities', label: 'Nationalities', suggestions: NATIONALITIES },
        { type: 'tags', name: 'statuses', label: 'Statuses', suggestions: STATUSES },
        { type: 'tags', name: 'cities', label: 'Cities (slugs)' },
      ] },
      { type: 'reference', name: 'guideSlug', label: 'Updated guide', collection: 'guides' },
      sourcesField(),
    ],
  },
  {
    name: 'providers', label: 'Providers', singular: 'provider',
    description: 'Comparison tables. Partners must have a referral URL; non-partners are listed too.',
    title: (d) => String(d.name ?? '') || '(unnamed provider)',
    subtitle: (d) => `${d.category ?? ''}${d.isPartner ? ' · partner' : ''}`,
    blank: () => ({ id: shortId('prov'), category: 'bank', name: '', monthlyFee: '', openingTime: '', facts: [], isPartner: false, url: 'https://', lastChecked: today(), feeSortKey: 0, speedSortKey: 0 }),
    fields: [
      { type: 'text', name: 'name', label: 'Name', required: true },
      { type: 'text', name: 'id', label: 'ID', required: true },
      { type: 'select', name: 'category', label: 'Category', options: [
        { value: 'blocked', label: 'Blocked account' }, { value: 'bank', label: 'Bank account' }, { value: 'phone', label: 'Phone plan' }, { value: 'insurance', label: 'Health insurance' },
      ] },
      { type: 'text', name: 'setupFee', label: 'Setup fee' },
      { type: 'text', name: 'monthlyFee', label: 'Monthly fee' },
      { type: 'text', name: 'openingTime', label: 'Opening time' },
      { type: 'text', name: 'payout', label: 'Payout terms' },
      { type: 'localizedList', name: 'facts', label: 'Facts', itemLabel: 'fact' },
      { type: 'url', name: 'url', label: 'Website', required: true },
      { type: 'boolean', name: 'isPartner', label: 'Referral partner (we earn a commission)' },
      { type: 'url', name: 'referralUrl', label: 'Referral URL' },
      { type: 'date', name: 'lastChecked', label: 'Last checked' },
      { type: 'number', name: 'feeSortKey', label: 'Fee rank (lower = cheaper)', help: 'Default sort, never by commission. E.g. the total cost in the first year.' },
      { type: 'number', name: 'speedSortKey', label: 'Speed rank (1 = fastest)' },
      sourcesField('Where the fees were checked.'),
    ],
  },
  {
    name: 'phrases', label: 'Phrasebook', singular: 'phrase',
    description: 'German phrases with Devanagari transliteration and meanings.',
    title: (d) => String(d.german ?? '') || '(empty phrase)',
    subtitle: (d) => L(d, 'situation'),
    blank: () => ({ id: shortId('p'), situation: emptyL(), german: '', transliteration: {}, meaning: emptyL() }),
    fields: [
      { type: 'text', name: 'german', label: 'German', required: true },
      { type: 'text', name: 'id', label: 'ID', required: true },
      { type: 'localized', name: 'situation', label: 'Situation' },
      { type: 'group', name: 'transliteration', label: 'Transliteration (Devanagari)', fields: [
        { type: 'text', name: 'ne', label: 'For Nepali readers' }, { type: 'text', name: 'hi', label: 'For Hindi readers' },
      ] },
      { type: 'localized', name: 'meaning', label: 'Meaning', required: true },
      { type: 'file', name: 'audioUrl', label: 'Audio', accept: 'audio/*' },
    ],
  },
  {
    name: 'helpServices', label: 'Help services', singular: 'help service',
    description: 'Where to get help: counselling, tenants’ associations, lawyers.',
    title: (d) => L(d, 'kind') || String(d.name ?? ''),
    subtitle: (d) => String(d.name ?? ''),
    blank: () => ({ id: shortId('help'), name: '', kind: emptyL(), description: emptyL(), free: true }),
    fields: [
      { type: 'localized', name: 'kind', label: 'What it is', required: true },
      { type: 'text', name: 'name', label: 'German name', required: true },
      { type: 'text', name: 'id', label: 'ID', required: true },
      { type: 'localized', name: 'description', label: 'Description', multiline: true },
      { type: 'text', name: 'phone', label: 'Phone' },
      { type: 'url', name: 'url', label: 'Website' },
      { type: 'text', name: 'email', label: 'Email' },
      { type: 'text', name: 'address', label: 'Address' },
      { type: 'boolean', name: 'free', label: 'Free' },
      { type: 'localized', name: 'cost', label: 'Cost (if not free)' },
      { type: 'tags', name: 'topics', label: 'Topics', suggestions: TOPICS },
      sourcesField(),
    ],
  },
  {
    name: 'scamWarnings', label: 'Scam warnings', singular: 'scam warning',
    description: 'Shown on the Safety screen.',
    title: (d) => L(d, 'title') || '(untitled)',
    blank: () => ({ id: shortId('scam'), title: emptyL(), signs: [] }),
    fields: [
      { type: 'localized', name: 'title', label: 'Title', required: true },
      { type: 'text', name: 'id', label: 'ID', required: true },
      { type: 'localizedList', name: 'signs', label: 'Warning signs', itemLabel: 'sign' },
      { type: 'localizedList', name: 'actions', label: 'What to do', itemLabel: 'point' },
      sourcesField(),
    ],
  },
  {
    name: 'embassies', label: 'Embassies', singular: 'embassy',
    description: 'Embassy and consulate contacts.',
    title: (d) => String(d.name ?? '') || '(unnamed)',
    subtitle: (d) => String(d.country ?? ''),
    blank: () => ({ country: '', name: '', phone: '', url: 'https://' }),
    fields: [
      { type: 'text', name: 'name', label: 'Name', required: true },
      { type: 'text', name: 'country', label: 'Country key', required: true, help: 'Matches the nationality in the user profile, e.g. nepal' },
      { type: 'text', name: 'phone', label: 'Phone' },
      { type: 'url', name: 'url', label: 'Website' },
      { type: 'text', name: 'address', label: 'Address' },
      { type: 'text', name: 'email', label: 'Email' },
      { type: 'localized', name: 'note', label: 'Note', multiline: true },
      sourcesField(),
    ],
  },
];

export const defOf = (c: string) => COLLECTION_DEFS.find((d) => d.name === c);

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Localized fields whose Nepali or Hindi text is missing (for the "needs translation" view). */
export function missingTranslations(fields: Field[], d: Json, prefix = ''): string[] {
  const out: string[] = [];
  for (const f of fields) {
    const v = d?.[f.name];
    if (f.type === 'localized' && v && typeof v === 'object' && (v as Json).en) {
      const l = v as Json;
      if (!l.ne || !l.hi) out.push(prefix + f.label);
    } else if (f.type === 'group' && v && typeof v === 'object') {
      out.push(...missingTranslations(f.fields, v as Json, `${prefix}${f.label} › `));
    } else if (f.type === 'list' && Array.isArray(v)) {
      v.forEach((item, i) => out.push(...missingTranslations(f.fields, item as Json, `${prefix}${f.label} ${i + 1} › `)));
    } else if (f.type === 'localizedList' && Array.isArray(v)) {
      v.forEach((item, i) => { const l = item as Json; if (l?.en && (!l.ne || !l.hi)) out.push(`${prefix}${f.label} ${i + 1}`); });
    }
  }
  return out;
}
