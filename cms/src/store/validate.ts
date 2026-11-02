import { type CollectionName, documentKey } from '../../../src/content/collections';
import type { Json } from './types';

/**
 * Browser copy of public.content_validate() for the offline demo store.
 * In Supabase mode the CMS asks the database (the single source of truth).
 */
export function validateLocal(c: CollectionName, d: Json): string[] {
  const e: string[] = [];
  const s = (path: string) => {
    const v = path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Json)[k] : undefined), d);
    return typeof v === 'string' ? v : v == null ? '' : String(v);
  };
  const key = documentKey(c, d);
  if (!key.trim()) e.push('The key (slug / id) is required');
  else if ((c === 'guides' || c === 'cities') && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) e.push('Slug may only use lowercase letters, numbers and dashes');
  const stageOk = ['before', 'first30', 'living', 'career'].includes(s('stage'));
  switch (c) {
    case 'guides':
      if (!s('title.en')) e.push('English title is required');
      if (!s('term.term')) e.push('German term is required');
      if (!stageOk) e.push('Stage must be one of before, first30, living, career');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s('lastVerified'))) e.push('Last verified date (YYYY-MM-DD) is required');
      if (!Array.isArray(d.sources) || d.sources.length === 0) e.push('At least one official source is required');
      break;
    case 'tasks':
      if (!s('title.en')) e.push('English title is required');
      if (!s('group.en')) e.push('Group (English) is required');
      if (!stageOk) e.push('Stage must be one of before, first30, living, career');
      break;
    case 'cities':
      if (!s('name')) e.push('City name is required');
      break;
    case 'ruleChanges':
      if (!s('summary.en')) e.push('English summary is required');
      if (!s('date')) e.push('Date is required');
      break;
    case 'providers':
      if (!s('name')) e.push('Name is required');
      if (!['blocked', 'bank', 'phone', 'insurance'].includes(s('category'))) e.push('Category must be blocked, bank, phone or insurance');
      if (!/^https?:\/\//.test(s('url'))) e.push('Provider URL must start with http(s)://');
      if (d.isPartner === true && !s('referralUrl')) e.push('Partners need a referral URL (it is shown with the referral disclosure)');
      break;
    case 'phrases':
      if (!s('german')) e.push('German phrase is required');
      if (!s('meaning.en')) e.push('English meaning is required');
      break;
    case 'helpServices':
      if (!s('name')) e.push('Name is required');
      if (!s('kind.en')) e.push('Kind (English) is required');
      break;
    case 'scamWarnings':
      if (!s('title.en')) e.push('English title is required');
      break;
    case 'embassies':
      if (!s('name')) e.push('Name is required');
      break;
    default:
      break;
  }
  return e;
}
