/**
 * Content model (HANDOFF §8). Everything factual comes from the headless CMS through
 * these types — nothing factual is hard-coded in screens. `Localized<T>` fields hold
 * en / ne / hi variants; the client resolves them to the user's language.
 */
/** Journey stages (HANDOFF §7.3). */
export type StageId = 'before' | 'first30' | 'living' | 'career';

export type Lang = 'en' | 'ne' | 'hi';
export type Localized<T = string> = { en: T } & Partial<Record<Exclude<Lang, 'en'>, T>>;

/** An official source shown on the page it backs (HANDOFF §7.8). */
export interface Source {
  title: string;
  url: string;
}

export interface GermanTermRef {
  term: string;
  audioUrl?: string;
}

export type CalloutKind = 'tip' | 'warning' | 'mistake' | 'legal';

export interface GuideStep {
  title: Localized;
  body: Localized;
  term?: GermanTermRef;
  documents?: Localized[];
  where?: Localized;
  cost?: Localized;
  wait?: Localized;
}

export interface Guide {
  slug: string;
  title: Localized;
  term: GermanTermRef;
  stage: StageId;
  city?: string;
  readingMinutes: number;
  /** ISO date. Older than 6 months → "We're re-checking this guide". */
  lastVerified: string;
  summary: { what: Localized; when: Localized; deadline: Localized };
  steps: GuideStep[];
  documents: Localized[];
  callouts: { kind: CalloutKind; text: Localized }[];
  related: { kind: 'guide' | 'tool'; title: Localized; href: string }[];
  sources: Source[];
  /** Shown as "Updated" chip in lists. */
  updatedRecently?: boolean;
  /** Main official links shown as buttons under "In short" (e.g. "Book an appointment"). */
  actions?: { label: Localized; url: string }[];
  /** Comparison tool linked from the guide card ("Compare banks"). */
  compareLink?: { label: Localized; href: string };
}

export interface RoadmapTask {
  id: string;
  stage: StageId;
  group: Localized;
  title: Localized;
  term?: GermanTermRef;
  effort?: Localized;
  /** Deadline counted from the arrival date (e.g. address registration). */
  deadlineDaysAfterArrival?: number;
  /** Fixed calendar deadline, ISO date. */
  deadlineDate?: string;
  /** Shown instead of a deadline chip, e.g. "Arrives by post". */
  timingNote?: Localized;
  guideSlug?: string;
  /** Only for these statuses (empty = everyone). */
  statuses?: string[];
}

export type PlaceKind = 'cityHall' | 'immigration' | 'church' | 'tourist' | 'station' | 'airport' | 'bank';

export interface CityPlace {
  kind: PlaceKind;
  name: string;
  address?: string;
  note?: Localized;
  url?: string;
  /** Map link (a live map search when no checked address is stored). */
  mapUrl?: string;
}

export interface City {
  slug: string;
  name: string;
  facts: { label: Localized; value: Localized }[];
  appointments: { title: Localized; body: Localized; url?: string }[];
  community: { name: string; kind: Localized; description?: Localized; address?: string; phone?: string; url?: string; mapUrl?: string }[];
  /** Places newcomers need: city hall, foreigners' office, church, tourist info, station, airport, banks. */
  places?: CityPlace[];
  /** Starting values for the budget planner (EUR per month). */
  budget?: { label: Localized; value: number }[];
  lastVerified?: string;
  sources?: Source[];
}

/** Numbers used by calculators and guides so they update without an app release. */
export interface Rules {
  studentWorkFullDays: number;
  studentWorkHalfDays: number;
  blockedAccountMonthly: number;
  miniJobLimitMonthly: number;
  /** Statutory minimum wage, EUR per hour. */
  minimumWage?: number;
  /** Tax-free basic allowance per year (Grundfreibetrag), EUR. */
  basicTaxAllowance?: number;
  /** Mini-job employee pension contribution in percent (can be waived). */
  miniJobPensionPercent?: number;
  /** Working-student employee pension contribution in percent (half of the total rate). */
  studentPensionPercent?: number;
  /** Students may alternatively work up to this many hours a week. */
  studentWeeklyHours?: number;
  /** Hours above which a working day counts as a full day. */
  fullDayHours?: number;
  broadcastingFeeMonthly?: number;
  deutschlandticketMonthly?: number;
  lastVerified: string;
  sources?: Source[];
}

export interface RuleChange {
  id: string;
  date: string;
  affects: { nationalities?: string[]; statuses?: string[]; cities?: string[] };
  summary: Localized;
  title?: Localized;
  guideSlug?: string;
  sources?: Source[];
}

export type ProviderCategory = 'blocked' | 'bank' | 'phone' | 'insurance';

export interface Provider {
  id: string;
  category: ProviderCategory;
  name: string;
  monthlyFee: string;
  setupFee?: string;
  openingTime: string;
  payout?: string;
  facts: Localized[];
  isPartner: boolean;
  referralUrl?: string;
  url: string;
  lastChecked: string;
  /** Used by the non-commission default sort (lowest fees). */
  feeSortKey: number;
  speedSortKey: number;
  /** Where the fees were checked. */
  sources?: Source[];
  /** Important caveat shown highlighted on the card (e.g. not taking new customers). */
  notice?: Localized;
  /** Bank accounts: free for students up to and including this age (none = free at any age). */
  freeUpToAge?: number;
  /** Monthly fee once the free period ends (€). */
  monthlyAfter?: number;
  /** Conditions differ by local branch (Sparkasse, Volksbank): the age is an example. */
  variesByBranch?: boolean;
  /** Blocked accounts: total cost of the first year (€), shown on the card. */
  yearOneCost?: number;
}

export interface Phrase {
  id: string;
  situation: Localized;
  german: string;
  transliteration: { ne?: string; hi?: string };
  meaning: Localized;
  audioUrl?: string;
}

export interface HelpService {
  id: string;
  name: string;
  kind: Localized;
  description: Localized;
  phone?: string;
  url?: string;
  email?: string;
  address?: string;
  free: boolean;
  /** Fee note, e.g. membership per year. */
  cost?: Localized;
  topics?: ('visa' | 'housing' | 'work' | 'money' | 'health' | 'study')[];
  sources?: Source[];
}

export interface ScamWarning {
  id: string;
  title: Localized;
  /** Warning signs. */
  signs: Localized[];
  /** What to do. */
  actions?: Localized[];
  sources?: Source[];
}

export interface EmbassyContact {
  country: string;
  name: string;
  phone: string;
  url: string;
  address?: string;
  email?: string;
  note?: Localized;
  sources?: Source[];
}
