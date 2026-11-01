import { pageMetadata } from '@/lib/metadata';
import { NetPayScreen } from '@/features/tools/Calculators';

export function generateMetadata() {
  return pageMetadata({ title: 'Net pay calculator', path: '/tools/net-pay' });
}

export default NetPayScreen;
