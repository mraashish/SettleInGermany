import { pageMetadata } from '@/lib/metadata';
import { JobKitScreen } from '@/features/assist/AiTools';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/job-kit', noindex: true });
}

export default JobKitScreen;
