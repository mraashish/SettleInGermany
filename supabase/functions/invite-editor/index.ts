/**
 * Admins invite a new CMS editor by email (called from the CMS "Editors" page).
 * The caller's JWT is checked against public.cms_editors (role = admin).
 * Env: CMS_SITE_URL (where the invite link should land, i.e. the CMS URL).
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = Deno.env.get('SUPABASE_URL')!;
  const caller = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    auth: { persistSession: false },
  });
  const { data: isAdmin } = await caller.rpc('is_cms_admin');
  if (!isAdmin) return json({ error: 'Only CMS admins can invite editors' }, 403);

  const { email, role } = (await req.json()) as { email?: string; role?: 'editor' | 'admin' };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'A valid email is required' }, 400);

  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: Deno.env.get('CMS_SITE_URL') });
  if (error || !data.user) return json({ error: error?.message ?? 'Invite failed' }, 400);
  const { error: e2 } = await admin.from('cms_editors').upsert({ user_id: data.user.id, email, role: role === 'admin' ? 'admin' : 'editor' });
  if (e2) return json({ error: e2.message }, 400);
  return json({ ok: true, userId: data.user.id });
});
