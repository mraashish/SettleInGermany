import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

/** CMS responses are persisted so opened guides keep working offline (HANDOFF §7.3). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: 1000 * 60 * 60 * 24 * 21, retry: 1, networkMode: 'offlineFirst' },
  },
});

export const persister = createAsyncStoragePersister({
  storage: typeof window === 'undefined' && typeof navigator === 'undefined' ? undefined : AsyncStorage,
  key: 'sig-query-cache',
});
