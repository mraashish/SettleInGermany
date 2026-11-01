import { router } from 'expo-router';
import { Compass } from 'lucide-react-native';
import React from 'react';

import { EmptyState, Screen } from '@/ui';

export default function NotFound() {
  return (
    <Screen title="Page not found" back={{ label: 'Home', href: '/' }}>
      <EmptyState icon={Compass} title="We couldn’t find this page" body="It may have moved. Your roadmap and saved guides are still here." actionLabel="Go home" onAction={() => router.replace('/')} />
    </Screen>
  );
}
