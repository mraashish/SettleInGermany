import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { kv } from '@/lib/kv';
import { supabase } from '@/services/auth';

const KEY = 'content-version';

/**
 * Keeps every platform in step with the central database.
 * Each publish bumps the single `content_state` row; the app hears it over Realtime
 * and refetches exactly the collections that changed. When the app comes back to the
 * foreground (Realtime may have been asleep) it compares versions once.
 */
export function useContentSync() {
  const qc = useQueryClient();
  useEffect(() => {
    const db = supabase;
    if (!db) return;
    let alive = true;

    const apply = (version: number, changed: string[] | null) => {
      const last = Number(kv.get(KEY) ?? NaN);
      if (version === last) return;
      kv.set(KEY, String(version));
      if (version === last + 1 && changed?.length) {
        changed.forEach((c) => void qc.invalidateQueries({ queryKey: ['cms', c] }));
      } else {
        void qc.invalidateQueries({ queryKey: ['cms'] }); // missed releases → refresh everything
      }
    };

    const check = async () => {
      const { data } = await db.from('content_state').select('version, changed_collections').single();
      if (alive && data) apply(Number(data.version), data.changed_collections as string[]);
    };

    const channel = db
      .channel('content-state')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'content_state' }, (p) => {
        const row = p.new as { version: number; changed_collections: string[] };
        apply(Number(row.version), row.changed_collections);
      })
      .subscribe();

    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') void check();
    });
    void check();

    return () => {
      alive = false;
      sub.remove();
      void db.removeChannel(channel);
    };
  }, [qc]);
}
