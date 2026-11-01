import { pageMetadata } from '@/lib/metadata';
import { ToolsHub } from '@/features/tools/ToolsHub';

export function generateMetadata() {
  return pageMetadata({ title: 'Tools', path: '/tools' });
}

export default ToolsHub;
