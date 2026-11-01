import { pageMetadata } from '@/lib/metadata';
import { ChatScreen } from '@/features/assist/AiTools';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/ask', noindex: true });
}

export default ChatScreen;
