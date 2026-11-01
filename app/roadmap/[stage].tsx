import { pageMetadata } from '@/lib/metadata';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { RoadmapScreen } from '@/features/roadmap/RoadmapScreen';
import { STAGES, type StageId } from '@/store/prefs';

export function generateStaticParams() {
  return STAGES.map((stage) => ({ stage }));
}

export default function RoadmapRoute() {
  const { stage } = useLocalSearchParams<{ stage: string }>();
  const s = (STAGES as string[]).includes(stage) ? (stage as StageId) : 'first30';
  return <RoadmapScreen stage={s} />;
}

export function generateMetadata() {
  return pageMetadata({ title: 'Settle in Germany', path: '/', noindex: true });
}
