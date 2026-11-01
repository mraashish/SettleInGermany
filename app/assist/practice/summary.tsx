import { pageMetadata } from '@/lib/metadata';
import { PracticeSummaryScreen } from '@/features/assist/AiTools';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/practice/summary', noindex: true });
}

export default PracticeSummaryScreen;
