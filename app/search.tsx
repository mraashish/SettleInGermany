import { pageMetadata } from '@/lib/metadata';
import { SearchScreen } from '@/features/guides/SearchScreen';

export default SearchScreen;

export function generateMetadata() {
  return pageMetadata({ title: 'Settle in Germany', path: '/', noindex: true });
}
