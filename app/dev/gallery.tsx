import { Gallery } from '@/features/dev/Gallery';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata({ title: 'Component gallery', path: '/dev/gallery', noindex: true });
}

export default Gallery;
