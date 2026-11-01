import { useSyncExternalStore } from 'react';

import { kv } from './kv';

/**
 * Tiny persisted store: state is JSON in the device key-value store and React
 * components subscribe via useSyncExternalStore. Enough for local-first data
 * without adding a state library.
 */
export function createPersistedStore<T extends object>(key: string, initial: T) {
  let state: T = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const hydrate = () => {
    if (hydrated) return;
    hydrated = true;
    const raw = kv.get(key);
    if (raw) {
      try {
        state = { ...initial, ...(JSON.parse(raw) as Partial<T>) };
      } catch {
        state = initial;
      }
    }
  };

  const get = (): T => {
    hydrate();
    return state;
  };

  const set = (patch: Partial<T> | ((s: T) => Partial<T>)) => {
    hydrate();
    const next = typeof patch === 'function' ? patch(state) : patch;
    state = { ...state, ...next };
    kv.set(key, JSON.stringify(state));
    listeners.forEach((l) => l());
  };

  const reset = () => {
    state = initial;
    kv.remove(key);
    listeners.forEach((l) => l());
  };

  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };

  function useStore(): T;
  function useStore<S>(selector: (s: T) => S): S;
  function useStore<S>(selector?: (s: T) => S) {
    const snap = useSyncExternalStore(subscribe, get, () => initial);
    return selector ? selector(snap) : snap;
  }

  return { get, set, reset, subscribe, useStore };
}
