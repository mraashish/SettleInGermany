import type { Metadata } from 'expo-server';

export const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? 'https://settleingermany.app';
const SITE_NAME = 'Settle in Germany';

/** Static-render <head> for a route (Expo Router `generateMetadata`). */
export function pageMetadata(o: { title: string; description?: string; path: string; noindex?: boolean; type?: 'website' | 'article' }): Metadata {
  const url = `${SITE_URL}${o.path}`;
  return {
    title: o.path === '/' ? `${SITE_NAME} — know exactly what to do next` : `${o.title} · ${SITE_NAME}`,
    description: o.description ?? 'Know exactly what to do next in Germany, in your language. Step-by-step guides, deadlines and reminders in English, Nepali and Hindi.',
    alternates: { canonical: url },
    robots: o.noindex ? 'noindex' : undefined,
    openGraph: { title: o.title, description: o.description, url, siteName: SITE_NAME, type: o.type ?? 'website' },
  } as Metadata;
}
