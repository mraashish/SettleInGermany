import { pageMetadata } from '@/lib/metadata';
import { AlertsScreen } from '@/features/tools/Reference';

export function generateMetadata() {
  return pageMetadata({ title: 'Rule changes', path: '/alerts' });
}

export default AlertsScreen;
