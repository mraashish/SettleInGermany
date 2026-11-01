import { useQuery } from '@tanstack/react-query';

import { api, ApiError } from './api';
import { demoChat, demoClauses, demoLetter, demoScam } from './aiDemo';

const DEMO = !process.env.EXPO_PUBLIC_API_URL;
const demo = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 600));
export const AI_DEMO = DEMO;

/** Shapes returned by our backend. The backend owns prompts, models and deletion. */
export interface LetterResult {
  id: string;
  urgent: boolean;
  sender: { name: string; term?: string; kind?: string };
  want: string;
  deadline?: { date: string; raw: string; label: string };
  nextSteps: string[];
  keyTerms: { de: string; meaning: string }[];
  original: { de: string; translation: string };
  relatedGuide?: string;
  /** The free scan that produced this result was the user's last for the month. */
  lastFree: boolean;
  saved: boolean;
}

export interface Usage { scansLeft: number; scansPerMonth: number; premium: boolean }

export interface ChatAnswer { text: string; sources: { title: string; slug: string }[]; legal: boolean }
export interface ScamCheck { risk: 'high' | 'medium' | 'low'; signs: string[]; advice: string }
export interface ContractClause { title: string; plain: string; flag?: 'warning' | 'danger' }

const FREE_SCANS = 3;

/** Free-scan count is shown BEFORE a scan starts (HANDOFF §7.4). */
export function useUsage() {
  return useQuery({
    queryKey: ['ai', 'usage'],
    queryFn: () => api.get<Usage>('/ai/usage'),
    placeholderData: { scansLeft: FREE_SCANS, scansPerMonth: FREE_SCANS, premium: false },
    retry: false,
  });
}

const live = {
  /** Upload pages; server runs OCR + model, deletes the scan unless saved. */
  explainLetter: (pages: { uri: string; name: string; type: string }[], lang: string) => {
    const f = new FormData();
    pages.forEach((p) => f.append('pages', p as unknown as Blob));
    f.append('lang', lang);
    return api.upload<{ id: string }>('/ai/letters', f);
  },
  letter: (id: string) => api.get<LetterResult>(`/ai/letters/${id}`),
  saveLetter: (id: string) => api.post<{ ok: true }>(`/ai/letters/${id}/save`),
  reply: (input: { letterId?: string; intent: string; details: string; lang: string }) => api.post<{ german: string; translation: string }>('/ai/reply', input),
  chat: (messages: { role: 'user' | 'ai'; text: string }[], lang: string) => api.post<ChatAnswer>('/ai/chat', { messages, lang }),
  scam: (text: string, lang: string) => api.post<ScamCheck>('/ai/scam-check', { text, lang }),
  contract: (file: { uri: string; name: string; type: string }, lang: string) => {
    const f = new FormData();
    f.append('file', file as unknown as Blob);
    f.append('lang', lang);
    return api.upload<{ clauses: ContractClause[] }>('/ai/contract', f);
  },
  form: (form: string, field: string, lang: string) => api.post<{ help: string; example: string }>('/ai/forms', { form, field, lang }),
  jobkit: (kind: 'cv' | 'cover' | 'interview', input: string, lang: string) => api.post<{ text: string }>('/ai/job-kit', { kind, input, lang }),
  practice: (scenario: string, messages: { role: 'user' | 'ai'; text: string }[]) => api.post<{ text: string; feedback?: string }>('/ai/practice', { scenario, messages }),
};

/** All AI calls go through our backend; demo data only when no backend is configured. */
export const ai: typeof live = DEMO
  ? {
      explainLetter: () => demo({ id: `demo-${Date.now()}` }),
      letter: (id) => demo(demoLetter(id)),
      saveLetter: () => demo({ ok: true as const }),
      reply: () => demo({ german: '[Formal German reply]', translation: '[Translation of the reply]' }),
      chat: (m) => demo(/(refus|abgelehnt|court|lawyer|deport)/i.test(m[m.length - 1]?.text ?? '') ? { text: 'This depends on your exact case, so a person should look at it — deadlines for objecting can be short.', sources: [], legal: true } : demoChat),
      scam: () => demo(demoScam),
      contract: () => demo({ clauses: demoClauses }),
      form: () => demo({ help: '[What this field means]', example: '[Example answer]' }),
      jobkit: () => demo({ text: '[Draft text]' }),
      practice: () => demo({ text: 'Gut. Ihren Pass, bitte.', feedback: undefined }),
    }
  : live;

export { ApiError };
