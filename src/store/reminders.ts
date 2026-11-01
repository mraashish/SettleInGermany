import { createPersistedStore } from '@/lib/createStore';

/**
 * Free tier stores dates and notes only — never document images (HANDOFF §7.3).
 * There is intentionally no image/attachment field on this type.
 */
export interface Reminder {
  id: string;
  title: string;
  /** ISO date (yyyy-mm-dd) of the deadline. */
  date: string;
  note: string;
  /** Days before the deadline to notify. Default 90 / 30 / 7. */
  offsets: number[];
  notificationIds: string[];
  linkedGuide?: string;
}

export const DEFAULT_OFFSETS = [90, 30, 7];

export const remindersStore = createPersistedStore<{ items: Reminder[] }>('reminders.v1', { items: [] });
export const useReminders = () => remindersStore.useStore((s) => s.items);

export const upsertReminder = (r: Reminder) =>
  remindersStore.set((s) => ({ items: [...s.items.filter((x) => x.id !== r.id), r] }));
export const deleteReminder = (id: string) =>
  remindersStore.set((s) => ({ items: s.items.filter((x) => x.id !== id) }));
