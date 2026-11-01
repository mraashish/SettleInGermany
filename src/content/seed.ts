/**
 * Seed content used until the headless CMS is connected (EXPO_PUBLIC_CMS_URL).
 * It mirrors the copy in design-source/. Bracketed values such as `€[—]`, `[date]`,
 * `[Provider A]` are deliberate placeholders.
 *
 * TODO(product owner): replace every placeholder with verified CMS content (HANDOFF §12).
 */
import type {
  City, EmbassyContact, Guide, HelpService, Localized, Phrase, Provider, RoadmapTask, RuleChange, Rules, ScamWarning,
} from './types';

const L = (en: string, ne?: string, hi?: string): Localized => ({ en, ...(ne ? { ne } : {}), ...(hi ? { hi } : {}) });

const g = (
  slug: string, title: Localized, term: string, stage: Guide['stage'], readingMinutes: number, lastVerified: string,
  extra: Partial<Guide> = {},
): Guide => ({
  slug, title, term: { term }, stage, readingMinutes, lastVerified,
  summary: { what: L('[What this is, in one sentence.]'), when: L('[When you need it.]'), deadline: L('[Deadline]') },
  steps: [], documents: [], callouts: [{ kind: 'legal', text: L('General information, not legal advice.') }],
  related: [], sources: [], ...extra,
});

export const guides: Guide[] = [
  g('register-your-address', L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'), 'Anmeldung', 'first30', 6, '2026-10-14', {
    city: 'leipzig',
    summary: {
      what: L('Telling the city where you live. You get a paper you need for almost everything else.'),
      when: L('Every time you move into a new flat.'),
      deadline: L('Within 2 weeks of moving in'),
    },
    steps: [
      { title: L('Get the landlord’s confirmation'), body: L('Your landlord signs a form saying you moved in. Ask for it when you get the keys.'), term: { term: 'Wohnungsgeberbestätigung' } },
      { title: L('Book an appointment at the citizen’s office'), body: L('Leipzig releases new slots online. Any office in the city works.'), cost: L('Free'), wait: L('[X–Y days]') },
      { title: L('Go to the appointment'), body: L('You leave with your registration certificate. The bank and the immigration office will ask for it.'), term: { term: 'Meldebescheinigung' } },
    ],
    documents: [L('Passport with visa'), L('Landlord’s confirmation'), L('Registration form, filled in')],
    callouts: [
      { kind: 'tip', text: L('No slots? Check the booking page early in the morning — cancelled slots often come back then.') },
      { kind: 'warning', text: L('Moving again? You must register the new address too, and deregister when you leave Germany.') },
      { kind: 'mistake', text: L('Waiting for a slot doesn’t pause the 2 weeks. Book on day one, even if the slot is later.') },
    ],
    related: [
      { kind: 'tool', title: L('Compare bank accounts'), href: '/tools/compare/bank-accounts' },
      { kind: 'guide', title: L('Get your tax ID'), href: '/guides/get-your-tax-id' },
    ],
    sources: [
      { title: 'Stadt Leipzig — Anmeldung', url: 'https://www.leipzig.de/' },
      { title: 'Federal Registration Act (Bundesmeldegesetz)', url: 'https://www.gesetze-im-internet.de/bmg/' },
    ],
  }),
  g('open-a-bank-account', L('Open a bank account', 'बैंक खाता खोल्नुहोस्', 'बैंक खाता खोलें'), 'Girokonto', 'first30', 5, '2026-10-02', {
    compareLink: { label: L('Compare banks'), href: '/tools/compare/bank-accounts' },
  }),
  g('pay-the-broadcasting-fee', L('Pay the broadcasting fee'), 'Rundfunkbeitrag', 'first30', 4, '2026-10-29', { updatedRecently: true }),
  g('book-residence-permit-appointment', L('Book your residence-permit appointment', 'आवास अनुमतिपत्रको अपोइन्टमेन्ट बुक गर्नुहोस्', 'निवास परमिट की अपॉइंटमेंट बुक करें'), 'Aufenthaltstitel', 'first30', 8, '2026-10-10'),
  g('get-your-tax-id', L('Get your tax ID', 'आफ्नो कर आईडी लिनुहोस्', 'अपनी टैक्स आईडी पाएं'), 'Steuer-ID', 'first30', 3, '2026-09-01'),
  g('choose-a-phone-plan', L('Choose a phone plan'), 'Handyvertrag', 'first30', 4, '2026-10-18', {
    compareLink: { label: L('Compare plans'), href: '/tools/compare/bank-accounts' },
  }),
  g('monthly-transit-pass', L('Get a monthly transit pass'), 'Deutschlandticket', 'first30', 3, '2026-10-20'),
  g('open-a-blocked-account', L('Open a blocked account'), 'Sperrkonto', 'before', 7, '2026-09-20', {
    compareLink: { label: L('Compare providers'), href: '/tools/compare/blocked-accounts' },
  }),
  g('apply-for-student-visa', L('Apply for your student visa'), 'Visum', 'before', 9, '2026-03-02'),
  g('find-a-family-doctor', L('Find a family doctor'), 'Hausarzt', 'living', 4, '2026-08-11'),
  g('student-jobs', L('Student jobs and work limits'), 'Nebenjob', 'living', 6, '2026-10-01'),
  g('extend-your-residence-permit', L('Extend your residence permit'), 'Verlängerung', 'career', 7, '2026-07-15'),
];

export const tasks: RoadmapTask[] = [
  // Before arrival
  { id: 'visa', stage: 'before', group: L('Paperwork'), title: L('Apply for your student visa'), term: { term: 'Visum' }, guideSlug: 'apply-for-student-visa' },
  { id: 'blocked', stage: 'before', group: L('Money'), title: L('Open a blocked account'), term: { term: 'Sperrkonto' }, guideSlug: 'open-a-blocked-account' },
  { id: 'insurance-pre', stage: 'before', group: L('Health'), title: L('Get travel health insurance'), term: { term: 'Reisekrankenversicherung' } },
  // First 30 days
  { id: 'anmeldung', stage: 'first30', group: L('Paperwork'), title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'), term: { term: 'Anmeldung' }, effort: L('about 1 h'), deadlineDaysAfterArrival: 14, guideSlug: 'register-your-address' },
  { id: 'permit', stage: 'first30', group: L('Paperwork'), title: L('Book residence-permit appointment', 'आवास अनुमतिपत्रको अपोइन्टमेन्ट बुक गर्नुहोस्', 'निवास परमिट की अपॉइंटमेंट बुक करें'), term: { term: 'Aufenthaltstitel' }, effort: L('30 min'), deadlineDaysAfterArrival: 30, guideSlug: 'book-residence-permit-appointment' },
  { id: 'taxid', stage: 'first30', group: L('Paperwork'), title: L('Get your tax ID', 'आफ्नो कर आईडी लिनुहोस्', 'अपनी टैक्स आईडी पाएं'), term: { term: 'Steuer-ID' }, timingNote: L('Arrives by post', 'हुलाकबाट आउँछ', 'डाक से आएगी'), guideSlug: 'get-your-tax-id' },
  { id: 'enrol', stage: 'first30', group: L('Paperwork'), title: L('Enrol at university'), statuses: ['student'] },
  { id: 'rundfunk', stage: 'first30', group: L('Money'), title: L('Pay the broadcasting fee'), term: { term: 'Rundfunkbeitrag' }, effort: L('10 min'), deadlineDaysAfterArrival: 60, guideSlug: 'pay-the-broadcasting-fee' },
  { id: 'bank', stage: 'first30', group: L('Money'), title: L('Open a bank account'), term: { term: 'Girokonto' }, guideSlug: 'open-a-bank-account' },
  { id: 'phone', stage: 'first30', group: L('Money'), title: L('Choose a phone plan'), term: { term: 'Handyvertrag' }, guideSlug: 'choose-a-phone-plan' },
  { id: 'doctor', stage: 'first30', group: L('Health'), title: L('Find a family doctor'), term: { term: 'Hausarzt' }, guideSlug: 'find-a-family-doctor' },
  { id: 'insurance', stage: 'first30', group: L('Health'), title: L('Activate health insurance'), term: { term: 'Krankenversicherung' } },
  // Living
  { id: 'jobs', stage: 'living', group: L('Work'), title: L('Understand your work limit'), term: { term: 'Nebenjob' }, guideSlug: 'student-jobs' },
  { id: 'tax-return', stage: 'living', group: L('Money'), title: L('File your first tax return'), term: { term: 'Steuererklärung' } },
  // Career
  { id: 'extend', stage: 'career', group: L('Paperwork'), title: L('Extend your residence permit'), term: { term: 'Verlängerung' }, guideSlug: 'extend-your-residence-permit' },
  { id: 'jobseeker', stage: 'career', group: L('Work'), title: L('Plan your job search permit'), term: { term: 'Aufenthaltserlaubnis zur Arbeitsplatzsuche' } },
];

export const cities: City[] = [
  {
    slug: 'leipzig', name: 'Leipzig',
    facts: [
      { label: L('Shared room, warm rent'), value: L('€[—]–[—] a month') },
      { label: L('Transit pass'), value: L('Semester ticket — usually part of your semester fee, check your university') },
    ],
    appointments: [
      { title: L('Citizen’s office · Bürgeramt'), body: L('Book online. Any office in the city can register you. [Tip about when new slots appear.]'), url: 'https://www.leipzig.de/' },
      { title: L('Immigration office · Ausländerbehörde'), body: L('[How to request an appointment in Leipzig — online form or email.] Apply well before your visa ends.'), url: 'https://www.leipzig.de/' },
    ],
    community: [
      { name: '[Asian grocery]', kind: L('Groceries') },
      { name: '[Nepali restaurant]', kind: L('Restaurants') },
      { name: '[Hindu temple]', kind: L('Temples') },
      { name: '[Nepali student group]', kind: L('Groups') },
    ],
  },
  ...['Berlin', 'Munich', 'Dresden', 'Frankfurt am Main'].map((name) => ({
    slug: name.toLowerCase().replace(/\s+/g, '-'), name, facts: [], appointments: [], community: [],
  })),
];

export const rules: Rules = {
  // TODO(product owner): verified values from the CMS. 0 = unknown → UI shows a placeholder.
  studentWorkFullDays: 0,
  studentWorkHalfDays: 0,
  blockedAccountMonthly: 0,
  miniJobLimitMonthly: 0,
  lastVerified: '[date]',
};

export const ruleChanges: RuleChange[] = [
  { id: 'rc1', date: '[date]', affects: { nationalities: ['nepal'], statuses: ['student'] }, summary: L('[One-line summary of a rule change that affects students from Nepal.]'), guideSlug: 'student-jobs' },
  { id: 'rc2', date: '[date]', affects: { statuses: ['student'] }, summary: L('[Two-line summary of what changes and from when, written in plain words.]') },
  { id: 'rc3', date: '[date]', affects: { cities: ['leipzig'] }, summary: L('[Two-line summary, e.g. new booking system or opening hours.]') },
];

const prov = (p: Partial<Provider> & Pick<Provider, 'id' | 'category' | 'name' | 'isPartner'>): Provider => ({
  monthlyFee: '€[—]', setupFee: '€[—]', openingTime: '[X] working days', payout: '[X] days after arrival',
  facts: [], url: 'https://example.com', lastChecked: '[date]', feeSortKey: 0, speedSortKey: 0, ...p,
});

export const providers: Provider[] = [
  prov({ id: 'ba', category: 'blocked', name: '[Provider A]', facts: [L('Online · English support')], isPartner: true, referralUrl: 'https://example.com/ref', feeSortKey: 1, speedSortKey: 2 }),
  prov({ id: 'bb', category: 'blocked', name: '[Provider B]', facts: [L('Online · Hindi and English support')], isPartner: false, feeSortKey: 2, speedSortKey: 1 }),
  prov({ id: 'bc', category: 'blocked', name: '[Provider C]', facts: [L('Bundled with health insurance')], isPartner: true, referralUrl: 'https://example.com/ref', feeSortKey: 3, speedSortKey: 3 }),
  prov({ id: 'ka', category: 'bank', name: '[Bank A]', facts: [L('Online bank · app only')], isPartner: true, referralUrl: 'https://example.com/ref', feeSortKey: 1, speedSortKey: 1 }),
  prov({ id: 'kb', category: 'bank', name: '[Bank B]', facts: [L('Online bank')], isPartner: true, referralUrl: 'https://example.com/ref', feeSortKey: 2, speedSortKey: 2 }),
  prov({ id: 'kc', category: 'bank', name: '[Bank C]', facts: [L('Branch bank · German app')], isPartner: false, feeSortKey: 3, speedSortKey: 3 }),
];

export const phrases: Phrase[] = [
  { id: 'p1', situation: L('Immigration office'), german: 'Ich habe einen Termin um 10 Uhr.', transliteration: { ne: 'इश हाबे आइनेन टेर्मीन उम त्सेन ऊर' }, meaning: L('I have an appointment at 10.', 'मेरो १० बजे अपोइन्टमेन्ट छ।') },
  { id: 'p2', situation: L('Immigration office'), german: 'Können Sie bitte langsamer sprechen?', transliteration: { ne: 'क्योनेन ज़ी बिटे लाङज़ामर श्प्रेशेन?' }, meaning: L('Could you speak more slowly, please?', 'कृपया अलि बिस्तारै बोल्न सक्नुहुन्छ?') },
  { id: 'p3', situation: L('Immigration office'), german: 'Ich verstehe das nicht.', transliteration: { ne: 'इश फ़ेरश्टेए दास निश्ट' }, meaning: L('I don’t understand this.', 'मैले यो बुझिनँ।') },
  { id: 'p4', situation: L('Immigration office'), german: 'Welche Unterlagen brauche ich?', transliteration: { ne: 'वेल्शे उन्टरलागेन ब्राउखे इश?' }, meaning: L('Which documents do I need?', 'मलाई कुन कागजातहरू चाहिन्छ?') },
];

export const helpServices: HelpService[] = [
  { id: 'mbe', name: 'Migrationsberatung (MBE / JMD)', kind: L('Migration counselling'), free: true, description: L('Help with residence permits, letters from the immigration office and refusals. Run by welfare organisations across Germany. Under 27? Youth migration services help you.') },
  { id: 'uni', name: 'International Office · Studierendenwerk', kind: L('Your university'), free: true, description: L('Help with enrolment, student jobs, money problems and housing. Many universities also offer free legal and social counselling.') },
  { id: 'mieter', name: 'Mieterverein', kind: L('Tenants’ association'), free: false, description: L('Checks rental contracts, deposits and bills from your landlord. You pay a yearly membership of about [€].') },
  { id: 'lawyer', name: 'Fachanwalt für Migrationsrecht', kind: L('A migration lawyer'), free: false, description: L('For refusals, appeals and deadlines with legal effect. On a low income you can ask your local court for legal advice aid (Beratungshilfe).') },
  { id: 'seelsorge', name: 'Telefonseelsorge · 0800 111 0 111', kind: L('Someone to talk to'), free: true, phone: '08001110111', description: L('Feeling overwhelmed or alone? Talk to someone any time, day or night, without giving your name.') },
];

export const scamWarnings: ScamWarning[] = [
  { id: 's1', title: L('A landlord wants a deposit before you see the flat'), signs: [L('[What to do, from the content system.]')] },
  { id: 's2', title: L('A caller says they are from the immigration office'), signs: [L('[What to do, from the content system.]')] },
  { id: 's3', title: L('An agent promises a “guaranteed visa”'), signs: [L('[What to do, from the content system.]')] },
];

export const embassies: EmbassyContact[] = [
  { country: 'nepal', name: 'Embassy of Nepal, Berlin', phone: '[Phone]', url: 'https://example.com' },
  { country: 'india', name: 'Embassy of India, Berlin', phone: '[Phone]', url: 'https://example.com' },
];
