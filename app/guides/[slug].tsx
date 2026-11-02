import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { staticCollection } from '@/content/client';
import { pageMetadata } from '@/lib/metadata';
import { GuideScreen } from '@/features/guides/GuideScreen';

/** Static web rendering: one crawlable HTML page per guide (HANDOFF §2, §10.3). */
export async function generateStaticParams() {
  const guides = await staticCollection('guides');
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(_req: unknown, params: { slug?: string }) {
  const guides = await staticCollection('guides');
  const g = guides.find((x) => x.slug === params?.slug);
  if (!g) return pageMetadata({ title: 'Guide', path: '/guides', noindex: true });
  return pageMetadata({
    title: `${g.title.en} in Germany (${g.term.term})`,
    description: `${g.summary.what.en} ${g.summary.deadline.en}. Step by step, with documents to bring and official sources.`,
    path: `/guides/${g.slug}`,
    type: 'article',
  });
}

export default function GuideRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <GuideScreen slug={slug} />;
}
