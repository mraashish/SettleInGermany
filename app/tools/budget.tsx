import { pageMetadata } from '@/lib/metadata';
import { BudgetScreen } from '@/features/tools/Calculators';

export function generateMetadata() {
  return pageMetadata({ title: 'Budget planner', path: '/tools/budget' });
}

export default BudgetScreen;
