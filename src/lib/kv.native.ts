// Native: on-device SQLite (expo-sqlite kv-store) — roadmap, reminders, saved guides
// and preferences all live here so they work offline (HANDOFF §2, §7.3).
import Storage from 'expo-sqlite/kv-store';

export const kv = {
  get(key: string): string | null {
    return Storage.getItemSync(key);
  },
  set(key: string, value: string): void {
    Storage.setItemSync(key, value);
  },
  remove(key: string): void {
    Storage.removeItemSync(key);
  },
  clear(): void {
    Storage.clearSync();
  },
};
