import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { pageMetadata } from '@/lib/metadata';
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen';

export function generateStaticParams() {
  return Array.from({ length: 9 }, (_, i) => ({ step: String(i + 1) }));
}

export function generateMetadata() {
  return pageMetadata({ title: 'Get started', path: '/onboarding/1', noindex: true });
}

export default function OnboardingRoute() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const n = Math.min(9, Math.max(1, Number(step) || 1));
  return (
<OnboardingScreen step={n} />
  );
}
