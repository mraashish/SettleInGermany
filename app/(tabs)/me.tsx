import { pageMetadata } from '@/lib/metadata';
import { MeScreen } from '@/features/me/MeScreens';

export function generateMetadata() {
  return pageMetadata({ title: 'Me', path: '/me', noindex: true });
}

export default MeScreen;
