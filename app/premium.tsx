import { pageMetadata } from '@/lib/metadata';
import { PaywallScreen } from '@/features/premium/PaywallScreen';

export function generateMetadata() {
  return pageMetadata({ title: 'Premium', path: '/premium', description: 'Premium: unlimited letter scans, reply writer, assistant chat, scam and contract checks, no ads. €3.99 a month or €29.99 a year, 7 days free.' });
}

export default PaywallScreen;
