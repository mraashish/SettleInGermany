import { pageMetadata } from '@/lib/metadata';
import { WorkLimitScreen } from '@/features/tools/Calculators';

export function generateMetadata() {
  return pageMetadata({ title: 'Student work-day limit', path: '/tools/work-limit' });
}

export default WorkLimitScreen;
