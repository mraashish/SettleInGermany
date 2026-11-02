import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { supabase } from './auth';

import { addDays } from '@/lib/deadline';
import type { Reminder } from '@/store/reminders';

/**
 * Local scheduled reminders (90 / 30 / 7 days before by default) and permission
 * flow. Push for rule changes is registered with the backend so it can target
 * only affected profiles (HANDOFF §8 RuleChange).
 */
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

export async function requestPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  const res = await Notifications.requestPermissionsAsync();
  return res.granted;
}

export async function scheduleReminder(r: Reminder, copy: (daysBefore: number) => { title: string; body: string }): Promise<string[]> {
  if (Platform.OS === 'web') return [];
  await cancelReminder(r);
  const ids: string[] = [];
  for (const days of r.offsets) {
    const when = addDays(r.date, -days);
    when.setHours(9, 0, 0, 0);
    if (when.getTime() <= Date.now()) continue;
    const id = await Notifications.scheduleNotificationAsync({
      content: { ...copy(days), data: { reminderId: r.id, href: '/me/reminders' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelReminder(r: Pick<Reminder, 'notificationIds'>) {
  if (Platform.OS === 'web') return;
  await Promise.all(r.notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined)));
}

/**
 * Expo push token → central database (public.register_push_token), tagged with
 * nationality / status / city so rule-change pushes reach only affected profiles.
 */
export async function registerForRuleChangePush(
  profile: { nationality: string | null; status: string | null; city: string | null },
  language: string = 'en',
) {
  if (Platform.OS === 'web' || !supabase) return;
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    await supabase.rpc('register_push_token', {
      p_token: token.data,
      p_platform: Platform.OS,
      p_nationality: profile.nationality,
      p_status: profile.status,
      p_city: profile.city,
      p_language: language,
    });
  } catch {
    /* no projectId in dev or offline — retried on next launch */
  }
}

/** Opening a notification goes to the screen it is about (guide, alerts, reminders). */
export function useNotificationLinks() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const href = r.notification.request.content.data?.href;
      if (typeof href === 'string' && href.startsWith('/')) router.push(href as never);
    });
    return () => sub.remove();
  }, []);
}
