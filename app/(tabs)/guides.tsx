import { pageMetadata } from '@/lib/metadata';
import { GuidesScreen } from '@/features/guides/GuidesScreen';

export default GuidesScreen;

export function generateMetadata() {
  return pageMetadata({ title: 'Guides for living in Germany', description: 'Step-by-step guides for living in Germany: registration, residence permit, bank account, tax ID and more — in English, Nepali and Hindi.', path: '/guides' });
}
