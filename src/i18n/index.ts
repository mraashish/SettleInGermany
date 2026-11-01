/* eslint-disable import/no-named-as-default-member -- i18next's default instance is the documented API */
import { getLocales } from 'expo-localization';
import { Platform } from 'react-native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { type Language, prefsStore } from '@/store/prefs';
import en from './locales/en';
import hi from './locales/hi';
import ne from './locales/ne';

export const LANGUAGES: { code: Language; native: string; english: string }[] = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'ne', native: 'नेपाली', english: 'Nepali' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
];

function initialLanguage(): Language {
  // Web: static HTML is English; the saved language is applied after hydration (see app/_layout).
  if (Platform.OS === 'web') return 'en';
  const saved = prefsStore.get();
  if (saved.onboarded || saved.language !== 'en') return saved.language;
  const device = getLocales()[0]?.languageCode;
  return device === 'ne' || device === 'hi' ? device : 'en';
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ne: { translation: ne }, hi: { translation: hi } },
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function setLanguage(lang: Language) {
  prefsStore.set({ language: lang });
  void i18n.changeLanguage(lang);
}

export default i18n;

/** Web: switch to the saved/device language once the page has hydrated. */
export function applySavedLanguage() {
  const saved = prefsStore.get();
  const device = getLocales()[0]?.languageCode;
  const lang: Language = saved.onboarded || saved.language !== 'en' ? saved.language : device === 'ne' || device === 'hi' ? device : 'en';
  if (i18n.language !== lang) void i18n.changeLanguage(lang);
}
