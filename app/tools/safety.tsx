import { pageMetadata } from '@/lib/metadata';
import { SafetyScreen } from '@/features/tools/Reference';

export function generateMetadata() {
  return pageMetadata({ title: 'Safety and emergency numbers', path: '/tools/safety' });
}

export default SafetyScreen;
