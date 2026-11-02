/**
 * Runs after every publish / unpublish (webhook from public.content_events).
 *  1. Rebuilds the static website so crawlers see the new content (WEB_DEPLOY_HOOK_URL:
 *     a Netlify / Vercel / Cloudflare Pages build hook, or any URL that starts a build).
 *     The apps and already-open web pages don't wait for this — they update live via
 *     Realtime on public.content_state.
 *  2. Sends a push notification for newly published rule changes, only to devices whose
 *     profile is affected (HANDOFF §8 RuleChange).
 *
 * Secrets: CMS_WEBHOOK_SECRET (required), WEB_DEPLOY_HOOK_URL, EXPO_ACCESS_TOKEN (optional).
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

import { buildMessages, chunk, type PushToken, type RuleChangeDoc } from '../_shared/push.ts';

interface ContentEvent {
  id: number;
  version: number;
  action: 'publish' | 'unpublish' | 'delete';
  collections: string[];
  new_rule_changes: string[];
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  const secret = Deno.env.get('CMS_WEBHOOK_SECRET');
  if (!secret || req.headers.get('x-cms-webhook-secret') !== secret) return json({ error: 'unauthorized' }, 401);

  const { record } = (await req.json()) as { record: ContentEvent };
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const result: Record<string, unknown> = { version: record.version };

  // 1. Website rebuild
  const hook = Deno.env.get('WEB_DEPLOY_HOOK_URL');
  if (hook) {
    try {
      const r = await fetch(hook, { method: 'POST' });
      result.webDeploy = r.status;
    } catch (e) {
      result.webDeploy = `failed: ${(e as Error).message}`;
    }
  } else {
    result.webDeploy = 'skipped (WEB_DEPLOY_HOOK_URL not set)';
  }

  // 2. Rule-change notifications
  if (record.action === 'publish' && record.new_rule_changes?.length) {
    const { data: rcs } = await db.from('published_content').select('data').in('document_id', record.new_rule_changes);
    const { data: tokens } = await db.from('push_tokens').select('token, nationality, status, city, language');
    const messages = (rcs ?? []).flatMap((r) => buildMessages(r.data as RuleChangeDoc, (tokens ?? []) as PushToken[]));
    let sent = 0;
    const gone: string[] = [];
    for (const batch of chunk(messages, 100)) {
      const res = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(Deno.env.get('EXPO_ACCESS_TOKEN') ? { Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}` } : {}),
        },
        body: JSON.stringify(batch),
      });
      const body = (await res.json().catch(() => ({}))) as { data?: { status: string; details?: { error?: string } }[] };
      body.data?.forEach((ticket, i) => {
        if (ticket.status === 'ok') sent++;
        else if (ticket.details?.error === 'DeviceNotRegistered') gone.push(batch[i].to);
      });
    }
    if (gone.length) await db.from('push_tokens').delete().in('token', gone);
    result.push = { messages: messages.length, sent, removedTokens: gone.length };
  }

  await db.from('content_events').update({ processed_at: new Date().toISOString(), result }).eq('id', record.id);
  return json(result);
});
