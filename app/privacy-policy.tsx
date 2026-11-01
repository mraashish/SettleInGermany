import React from 'react';

import { LegalPage } from '@/features/info/InfoPages';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata({ title: 'Privacy policy', path: '/privacy-policy' });
}

export default function Page() {
  return <LegalPage kind="privacy" />;
}
