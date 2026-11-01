import { pageMetadata } from '@/lib/metadata';
import { ProcessingScreen } from '@/features/assist/ProcessingScreen';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/scan/processing', noindex: true });
}

export default ProcessingScreen;
