import type { ErrorBoundaryProps } from 'expo-router';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ErrorState } from '@/ui';

/** Route-level error: plain words + retry, never an error code (HANDOFF §10.8). */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#F6F4F0' }}>
      <ErrorState
        onRetry={() => void retry()}
        secondary={<Button variant="text" label="Open your saved guides instead" onPress={() => router.replace('/guides?filter=saved')} fullWidth={false} />}
      />
    </SafeAreaView>
  );
}
