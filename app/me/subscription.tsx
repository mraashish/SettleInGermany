import { pageMetadata } from '@/lib/metadata';
import { SubscriptionScreen } from '@/features/me/MeScreens';

export function generateMetadata() {
  return pageMetadata({ title: 'Subscription', path: '/me/subscription', noindex: true });
}

export default SubscriptionScreen;
