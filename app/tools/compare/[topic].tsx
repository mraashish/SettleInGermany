import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { COMPARE_TOPICS, CompareScreen } from '@/features/tools/CompareScreen';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return COMPARE_TOPICS.map((topic) => ({ topic }));
}

export function generateMetadata(_req: unknown, params: { topic?: string }) {
  const title = params?.topic === 'bank-accounts' ? 'Compare bank accounts in Germany (Girokonto)' : 'Compare blocked accounts in Germany (Sperrkonto)';
  return pageMetadata({ title, description: 'Fees, opening time and conditions side by side. Ranked by cost, never by commission.', path: `/tools/compare/${params?.topic ?? ''}` });
}

export default function CompareRoute() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  return <CompareScreen topic={topic} />;
}
