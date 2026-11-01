import { pageMetadata } from '@/lib/metadata';
import { MoneyScreen } from '@/features/info/InfoPages';

export function generateMetadata() {
  return pageMetadata({ title: 'How we make money', path: '/how-we-make-money' });
}

export default MoneyScreen;
