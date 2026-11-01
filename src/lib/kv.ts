// Web: localStorage (expo-sqlite on web needs COOP/COEP headers that static hosting
// may not provide). Guarded for static rendering, where `window` does not exist.
const hasLS = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const kv = {
  get(key: string): string | null {
    try {
      return hasLS() ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      if (hasLS()) window.localStorage.setItem(key, value);
    } catch {
      /* storage full or blocked — data stays in memory for this session */
    }
  },
  remove(key: string): void {
    try {
      if (hasLS()) window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    try {
      if (hasLS()) window.localStorage.clear();
    } catch {
      /* ignore */
    }
  },
};
