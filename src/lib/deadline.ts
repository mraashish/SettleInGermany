import type { RoadmapTask } from '@/content/types';

export type DeadlineTone = 'neutral' | 'warning' | 'danger' | 'done';

const DAY = 86_400_000;

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function daysUntil(iso: string, now = new Date()): number {
  return Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / DAY);
}

/** HANDOFF §6 DeadlineChip: neutral > 30 d, warning ≤ 30 d, danger ≤ 7 d or expired. */
export function toneForDays(days: number): Exclude<DeadlineTone, 'done'> {
  if (days <= 7) return 'danger';
  if (days <= 30) return 'warning';
  return 'neutral';
}

export function taskDueDate(task: RoadmapTask, arrivalDate: string | null): string | null {
  if (task.deadlineDate) return task.deadlineDate;
  if (task.deadlineDaysAfterArrival != null && arrivalDate) {
    const d = new Date(arrivalDate);
    d.setDate(d.getDate() + task.deadlineDaysAfterArrival);
    return d.toISOString().slice(0, 10);
  }
  return null;
}

export function addDays(iso: string, n: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d;
}

export function formatDate(iso: string | Date, lang = 'en', opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return typeof iso === 'string' ? iso : '';
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : lang, opts).format(d);
  } catch {
    return d.toDateString();
  }
}
