import { pageMetadata } from '@/lib/metadata';
import { AssistHub } from '@/features/assist/AssistHub';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist — help with German letters', path: '/assist', description: 'AI help with German letters, replies, flat listings and rental contracts — general information, with links to human help.' });
}

export default AssistHub;
