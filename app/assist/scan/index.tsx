import { pageMetadata } from '@/lib/metadata';
import { ScanScreen } from '@/features/assist/ScanScreen';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/scan', noindex: true });
}

export default ScanScreen;
