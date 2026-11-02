import { describe, expect, it } from '@jest/globals';

import { affectsProfile, buildMessages, chunk } from '../../supabase/functions/_shared/push';

const rc = { id: 'rc1', date: '2026-11-02', affects: { nationalities: ['nepal'], statuses: ['student'] }, summary: { en: 'Change', ne: 'परिवर्तन' }, guideSlug: 'student-jobs' };

describe('rule-change push targeting', () => {
  it('only notifies affected profiles', () => {
    expect(affectsProfile(rc.affects, { nationality: 'nepal', status: 'student', city: 'berlin' })).toBe(true);
    expect(affectsProfile(rc.affects, { nationality: 'india', status: 'student', city: null })).toBe(false);
    expect(affectsProfile(rc.affects, { nationality: 'nepal', status: null, city: null })).toBe(false);
    expect(affectsProfile({}, { nationality: null, status: null, city: null })).toBe(true);
  });

  it('localises the message and links to the guide', () => {
    const m = buildMessages(rc, [
      { token: 'ExponentPushToken[a]', nationality: 'nepal', status: 'student', city: null, language: 'ne' },
      { token: 'ExponentPushToken[b]', nationality: 'india', status: 'student', city: null, language: 'hi' },
    ]);
    expect(m).toHaveLength(1);
    expect(m[0]).toMatchObject({ to: 'ExponentPushToken[a]', title: 'नियम परिवर्तन', body: 'परिवर्तन', data: { href: '/guides/student-jobs' } });
  });

  it('batches by 100 (Expo push API limit)', () => {
    expect(chunk(Array.from({ length: 250 }, (_, i) => i), 100).map((c) => c.length)).toEqual([100, 100, 50]);
  });
});
