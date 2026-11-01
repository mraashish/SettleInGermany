import React from 'react';

import { LegalPage } from '@/features/info/InfoPages';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata({ title: 'Impressum', path: '/impressum' });
}

export default function Page() {
  return <LegalPage kind="impressum" />;
}
