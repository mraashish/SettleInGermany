import { pageMetadata } from '@/lib/metadata';
import { HomeScreen } from '@/features/home/HomeScreen';

export default HomeScreen;

export function generateMetadata() {
  return pageMetadata({ title: 'Home', path: '/' });
}
