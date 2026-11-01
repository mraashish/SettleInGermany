import { pageMetadata } from '@/lib/metadata';
import { ReplyWriter } from '@/features/assist/ReplyWriter';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/reply', noindex: true });
}

export default ReplyWriter;
