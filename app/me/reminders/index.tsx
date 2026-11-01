import { pageMetadata } from '@/lib/metadata';
import { RemindersScreen } from '@/features/reminders/RemindersScreen';

export default RemindersScreen;

export function generateMetadata() {
  return pageMetadata({ title: 'Settle in Germany', path: '/', noindex: true });
}
