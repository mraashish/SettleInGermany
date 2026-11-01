/**
 * Demo responses used ONLY when no backend is configured (EXPO_PUBLIC_API_URL unset),
 * so every AI screen can be reviewed against its design frame. Bracketed values are
 * placeholders — the real content always comes from the backend.
 */
import type { ChatAnswer, ContractClause, LetterResult, ScamCheck } from './ai';

export const demoLetter = (id: string): LetterResult => ({
  id,
  urgent: id.includes('urgent'),
  lastFree: id.includes('last'),
  saved: false,
  sender: { name: 'Immigration office, Leipzig', term: 'Ausländerbehörde', kind: '[Kind of letter, e.g. request for documents]' },
  want: '[What they want from you, in one or two plain sentences.]',
  deadline: { date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), raw: '[date as written]', label: 'Reply by' },
  nextSteps: ['[First thing to do]', '[Second thing to do]', '[Third thing to do]'],
  keyTerms: [{ de: 'Frist', meaning: 'deadline' }, { de: 'Nachweis', meaning: 'proof, a document that shows something' }],
  original: { de: '[Original German text of the letter]', translation: '[Translation in your language]' },
  relatedGuide: 'book-residence-permit-appointment',
});

export const demoChat: ChatAnswer = {
  text: '[Short answer drawn from the guide, in 2–3 plain sentences, matched to the user’s visa and stage.]',
  sources: [{ title: 'Student jobs', slug: 'student-jobs' }],
  legal: false,
};

export const demoScam: ScamCheck = {
  risk: 'high',
  signs: ['[Red flag found in the listing]', '[Another red flag]'],
  advice: '1. Don’t send any money. 2. Ask to see the flat in person or by live video. 3. If you already paid, report it to the police and your bank today.',
};

export const demoClauses: ContractClause[] = [
  { title: '[Clause title]', plain: '[What this clause means, in plain words.]' },
  { title: '[Clause to check]', plain: '[Why this clause is unusual and what to ask.]', flag: 'warning' },
];
