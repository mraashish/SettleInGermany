import { router } from 'expo-router';
import { Compass } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState, Screen } from '@/ui';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <Screen title={t('states.pageNotFound')} back={{ label: t('nav.home'), href: '/' }}>
      <EmptyState icon={Compass} title={t('states.pageNotFoundTitle')} body={t('states.pageNotFoundBody')} actionLabel={t('nav.home')} onAction={() => router.replace('/')} />
    </Screen>
  );
}
