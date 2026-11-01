import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { LetterResultScreen } from '@/features/assist/LetterResultScreen';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata({ title: 'Your letter', path: '/assist', noindex: true });
}

export default function LetterRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LetterResultScreen id={id} />;
}
