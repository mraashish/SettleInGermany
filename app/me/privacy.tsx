import { pageMetadata } from '@/lib/metadata';
import { PrivacyScreen } from '@/features/me/MeScreens';

export function generateMetadata() {
  return pageMetadata({ title: 'Privacy and data', path: '/me/privacy', noindex: true });
}

export default PrivacyScreen;
