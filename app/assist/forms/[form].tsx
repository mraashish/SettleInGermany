import { pageMetadata } from '@/lib/metadata';
import { FormScreen } from '@/features/assist/AiTools';

export function generateStaticParams() {
  return [{ form: 'anmeldung' }];
}

export function generateMetadata() {
  return pageMetadata({ title: 'Form assistant', path: '/assist/forms/anmeldung', noindex: true });
}

export default FormScreen;
