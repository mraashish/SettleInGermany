import { pageMetadata } from '@/lib/metadata';
import { AddReminderSheet } from '@/features/reminders/AddReminderSheet';

export default AddReminderSheet;

export function generateMetadata() {
  return pageMetadata({ title: 'Settle in Germany', path: '/', noindex: true });
}
