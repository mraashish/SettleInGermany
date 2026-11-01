import { pageMetadata } from '@/lib/metadata';
import { ScamScreen } from '@/features/assist/AiTools';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/scam-check', noindex: true });
}

export default ScamScreen;
