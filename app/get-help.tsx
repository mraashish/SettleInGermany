import { pageMetadata } from '@/lib/metadata';
import { HelpScreen } from '@/features/info/InfoPages';

export function generateMetadata() {
  return pageMetadata({ title: 'Where to get help', path: '/get-help' });
}

export default HelpScreen;
