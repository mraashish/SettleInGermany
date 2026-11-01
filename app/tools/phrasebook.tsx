import { pageMetadata } from '@/lib/metadata';
import { PhrasebookScreen } from '@/features/tools/Reference';

export function generateMetadata() {
  return pageMetadata({ title: 'German phrasebook', path: '/tools/phrasebook' });
}

export default PhrasebookScreen;
