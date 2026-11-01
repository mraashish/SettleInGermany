import { pageMetadata } from '@/lib/metadata';
import { PracticeScreen } from '@/features/assist/AiTools';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/practice', noindex: true });
}

export default PracticeScreen;
