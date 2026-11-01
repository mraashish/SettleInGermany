import { pageMetadata } from '@/lib/metadata';
import { ContractScreen } from '@/features/assist/AiTools';

export function generateMetadata() {
  return pageMetadata({ title: 'Assist', path: '/assist/contract', noindex: true });
}

export default ContractScreen;
