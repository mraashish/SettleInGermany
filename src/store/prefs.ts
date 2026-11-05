import type { StageId } from '@/content/types';
import { createPersistedStore } from '@/lib/createStore';
import type { AppearancePref } from '@/theme/ThemeProvider';

export type { StageId };
export type Language = 'en' | 'ne' | 'hi';
export const STAGES: StageId[] = ['before', 'first30', 'living', 'career'];

export interface Profile {
  nationality: string | null;
  status: string | null;
  city: string | null;
  /** Display name for cities without a page (typed or picked from the list). */
  cityName?: string | null;
  stage: StageId;
  arrivalDate: string | null; // ISO date
  name: string | null;
}

export interface ConsentState {
  /** User has made a choice (any choice). Nothing non-essential runs before this. */
  decided: boolean;
  personalisedAds: boolean;
  analytics: boolean;
  decidedAt: string | null;
}

export interface PrefsState {
  appearance: AppearancePref;
  language: Language;
  onboarded: boolean;
  onboardingStep: number;
  profile: Profile;
  consent: ConsentState;
  ageConfirmed16: boolean;
  accountMode: 'none' | 'local' | 'account';
  dismissedAlerts: string[];
  notificationsAsked: boolean;
}

export const initialPrefs: PrefsState = {
  appearance: 'system',
  language: 'en',
  onboarded: false,
  onboardingStep: 1,
  profile: { nationality: null, status: null, city: null, stage: 'first30', arrivalDate: null, name: null },
  consent: { decided: false, personalisedAds: false, analytics: false, decidedAt: null },
  ageConfirmed16: false,
  accountMode: 'none',
  dismissedAlerts: [],
  notificationsAsked: false,
};

export const prefsStore = createPersistedStore<PrefsState>('prefs.v1', initialPrefs);
export const usePrefs = prefsStore.useStore;

export const setProfile = (patch: Partial<Profile>) =>
  prefsStore.set((s) => ({ profile: { ...s.profile, ...patch } }));

export const setConsent = (patch: Partial<ConsentState>) =>
  prefsStore.set((s) => ({
    consent: { ...s.consent, ...patch, decided: true, decidedAt: new Date().toISOString() },
  }));
