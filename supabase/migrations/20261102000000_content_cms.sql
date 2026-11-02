-- ============================================================================
-- Settle in Germany — central content database (HANDOFF §8)
--
-- One database feeds every platform:
--   * Editors work on drafts in `content_documents` (never visible to the public).
--   * Publishing copies documents into `published_content` (public, read-only) and
--     bumps the single-row `content_state`. Apps subscribe to that row over Supabase
--     Realtime and refetch the changed collections — iOS, Android and web update at once.
--   * Every publish also writes a `content_events` row. A webhook sends it to the
--     `on-content-published` Edge Function, which rebuilds the static website (SEO
--     pages) and sends push notifications for newly published rule changes.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.cms_role as enum ('editor', 'admin');
create type public.content_status as enum ('draft', 'published', 'unpublished');

-- ---------------------------------------------------------------------------
-- CMS users (Supabase Auth users who may edit content)
-- ---------------------------------------------------------------------------
create table public.cms_editors (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role public.cms_role not null default 'editor',
  created_at timestamptz not null default now()
);

create or replace function public.cms_current_role()
returns public.cms_role
language sql stable security definer set search_path = ''
as $$
  select role from public.cms_editors where user_id = auth.uid()
$$;

create or replace function public.is_editor()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.cms_editors where user_id = auth.uid())
$$;

create or replace function public.is_cms_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.cms_editors where user_id = auth.uid() and role = 'admin')
$$;

-- ---------------------------------------------------------------------------
-- Collections and their key field (mirror of src/content/collections.ts)
-- ---------------------------------------------------------------------------
create or replace function public.content_collections()
returns text[]
language sql immutable
as $$
  select array['guides', 'tasks', 'cities', 'rules', 'ruleChanges', 'providers', 'phrases', 'helpServices', 'scamWarnings', 'embassies']
$$;

create or replace function public.content_key(p_collection text, p_data jsonb)
returns text
language sql immutable
as $$
  select case p_collection
    when 'guides' then p_data ->> 'slug'
    when 'cities' then p_data ->> 'slug'
    when 'rules' then 'default'
    when 'embassies' then p_data ->> 'country'
    else p_data ->> 'id'
  end
$$;

-- Returns a list of human-readable problems; empty = ready to publish.
-- The CMS calls this live while editing, and publishing refuses invalid documents.
create or replace function public.content_validate(p_collection text, p_data jsonb)
returns text[]
language plpgsql immutable
as $$
declare
  errs text[] := '{}';
  k text := public.content_key(p_collection, p_data);
begin
  if p_collection is null or not (p_collection = any (public.content_collections())) then
    return array['Unknown collection'];
  end if;
  if jsonb_typeof(p_data) is distinct from 'object' then
    return array['Content must be an object'];
  end if;
  if k is null or btrim(k) = '' then
    errs := array_append(errs, 'The key (slug / id) is required'::text);
  elsif p_collection in ('guides', 'cities') and k !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    errs := array_append(errs, 'Slug may only use lowercase letters, numbers and dashes'::text);
  end if;

  case p_collection
    when 'guides' then
      if coalesce(p_data #>> '{title,en}', '') = '' then errs := array_append(errs, 'English title is required'::text); end if;
      if coalesce(p_data #>> '{term,term}', '') = '' then errs := array_append(errs, 'German term is required'::text); end if;
      if coalesce(p_data ->> 'stage', '') not in ('before', 'first30', 'living', 'career') then errs := array_append(errs, 'Stage must be one of before, first30, living, career'::text); end if;
      if coalesce(p_data ->> 'lastVerified', '') !~ '^\d{4}-\d{2}-\d{2}$' then errs := array_append(errs, 'Last verified date (YYYY-MM-DD) is required'::text); end if;
      if jsonb_typeof(p_data -> 'sources') is distinct from 'array' or jsonb_array_length(p_data -> 'sources') = 0 then
        errs := array_append(errs, 'At least one official source is required'::text);
      end if;
    when 'tasks' then
      if coalesce(p_data #>> '{title,en}', '') = '' then errs := array_append(errs, 'English title is required'::text); end if;
      if coalesce(p_data #>> '{group,en}', '') = '' then errs := array_append(errs, 'Group (English) is required'::text); end if;
      if coalesce(p_data ->> 'stage', '') not in ('before', 'first30', 'living', 'career') then errs := array_append(errs, 'Stage must be one of before, first30, living, career'::text); end if;
    when 'cities' then
      if coalesce(p_data ->> 'name', '') = '' then errs := array_append(errs, 'City name is required'::text); end if;
    when 'rules' then
      null; -- numbers may be 0 (= unknown, the apps show a placeholder)
    when 'ruleChanges' then
      if coalesce(p_data #>> '{summary,en}', '') = '' then errs := array_append(errs, 'English summary is required'::text); end if;
      if coalesce(p_data ->> 'date', '') = '' then errs := array_append(errs, 'Date is required'::text); end if;
    when 'providers' then
      if coalesce(p_data ->> 'name', '') = '' then errs := array_append(errs, 'Name is required'::text); end if;
      if coalesce(p_data ->> 'category', '') not in ('blocked', 'bank', 'phone', 'insurance') then errs := array_append(errs, 'Category must be blocked, bank, phone or insurance'::text); end if;
      if coalesce(p_data ->> 'url', '') !~ '^https?://' then errs := array_append(errs, 'Provider URL must start with http(s)://'::text); end if;
      -- HANDOFF §7.7: every partner link must be a labelled referral link
      if coalesce((p_data ->> 'isPartner')::boolean, false) and coalesce(p_data ->> 'referralUrl', '') = '' then
        errs := array_append(errs, 'Partners need a referral URL (it is shown with the referral disclosure)'::text);
      end if;
    when 'phrases' then
      if coalesce(p_data ->> 'german', '') = '' then errs := array_append(errs, 'German phrase is required'::text); end if;
      if coalesce(p_data #>> '{meaning,en}', '') = '' then errs := array_append(errs, 'English meaning is required'::text); end if;
    when 'helpServices' then
      if coalesce(p_data ->> 'name', '') = '' then errs := array_append(errs, 'Name is required'::text); end if;
      if coalesce(p_data #>> '{kind,en}', '') = '' then errs := array_append(errs, 'Kind (English) is required'::text); end if;
    when 'scamWarnings' then
      if coalesce(p_data #>> '{title,en}', '') = '' then errs := array_append(errs, 'English title is required'::text); end if;
    when 'embassies' then
      if coalesce(p_data ->> 'name', '') = '' then errs := array_append(errs, 'Name is required'::text); end if;
    else
      null;
  end case;
  return errs;
end;
$$;

-- ---------------------------------------------------------------------------
-- Drafts (editors only)
-- ---------------------------------------------------------------------------
create table public.content_documents (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection = any (public.content_collections())),
  key text not null,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  published_hash text,
  published_at timestamptz,
  published_by uuid references auth.users (id) on delete set null,
  -- true when the draft differs from what is live (or was never published)
  has_changes boolean generated always as (published_hash is distinct from md5(data::text)) stored,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  unique (collection, key)
);
create index content_documents_collection_idx on public.content_documents (collection, sort_order);

-- Full history for audit and "restore this version".
create table public.content_revisions (
  id bigserial primary key,
  document_id uuid not null references public.content_documents (id) on delete cascade,
  action text not null check (action in ('create', 'update', 'publish', 'unpublish')),
  data jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);
create index content_revisions_document_idx on public.content_revisions (document_id, id desc);

-- ---------------------------------------------------------------------------
-- Live content (public, read-only) and the global version signal
-- ---------------------------------------------------------------------------
create table public.published_content (
  document_id uuid primary key references public.content_documents (id) on delete cascade,
  collection text not null,
  key text not null,
  data jsonb not null,
  sort_order integer not null default 0,
  published_at timestamptz not null default now(),
  unique (collection, key)
);
create index published_content_collection_idx on public.published_content (collection, sort_order, key);

create table public.content_state (
  id smallint primary key default 1 check (id = 1),
  version bigint not null default 0,
  changed_collections text[] not null default '{}',
  published_at timestamptz
);
insert into public.content_state (id) values (1);

-- Outbox: one row per publish / unpublish. Sent to the Edge Function by a webhook.
create table public.content_events (
  id bigserial primary key,
  version bigint not null,
  action text not null check (action in ('publish', 'unpublish', 'delete')),
  collections text[] not null,
  document_ids uuid[] not null,
  new_rule_changes uuid[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  processed_at timestamptz,
  result jsonb
);

-- ---------------------------------------------------------------------------
-- Device push tokens (rule-change notifications only to affected profiles)
-- ---------------------------------------------------------------------------
create table public.push_tokens (
  token text primary key check (length(token) <= 200),
  platform text check (platform in ('ios', 'android')),
  nationality text check (length(nationality) <= 40),
  status text check (length(status) <= 40),
  city text check (length(city) <= 80),
  language text check (language in ('en', 'ne', 'hi')),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.content_documents_before_write()
returns trigger
language plpgsql
as $$
begin
  new.key := public.content_key(new.collection, new.data);
  if new.key is null or btrim(new.key) = '' then
    raise exception 'The document key (slug / id) is required' using errcode = '23514';
  end if;
  new.updated_at := now();
  new.updated_by := auth.uid();
  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, auth.uid());
    -- New documents are always drafts; only the publish functions change status.
    new.status := 'draft';
    new.published_hash := null;
    new.published_at := null;
    new.published_by := null;
  elsif current_setting('cms.publishing', true) is distinct from 'on' then
    new.status := old.status;
    new.published_hash := old.published_hash;
    new.published_at := old.published_at;
    new.published_by := old.published_by;
  end if;
  return new;
end;
$$;

create trigger content_documents_before_write
before insert or update on public.content_documents
for each row execute function public.content_documents_before_write();

create or replace function public.content_documents_history()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.content_revisions (document_id, action, data, created_by) values (new.id, 'create', new.data, auth.uid());
  elsif new.data is distinct from old.data then
    insert into public.content_revisions (document_id, action, data, created_by) values (new.id, 'update', new.data, auth.uid());
  end if;
  return null;
end;
$$;

create trigger content_documents_history
after insert or update on public.content_documents
for each row execute function public.content_documents_history();

-- Bump the global version and queue the event. Internal helper.
create or replace function public.content_bump(
  p_action text, p_collections text[], p_document_ids uuid[], p_new_rule_changes uuid[], p_note text
)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  v bigint;
begin
  update public.content_state
     set version = version + 1,
         changed_collections = (select coalesce(array_agg(distinct c order by c), '{}') from unnest(p_collections) c),
         published_at = now()
   where id = 1
  returning version into v;
  insert into public.content_events (version, action, collections, document_ids, new_rule_changes, note, created_by)
  values (v, p_action, p_collections, p_document_ids, coalesce(p_new_rule_changes, '{}'), p_note, auth.uid());
  return v;
end;
$$;
revoke execute on function public.content_bump(text, text[], uuid[], uuid[], text) from public, anon, authenticated;

-- Deleting a live document removes it everywhere.
create or replace function public.content_documents_after_delete()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if old.status = 'published' then
    perform public.content_bump('delete', array[old.collection], array[old.id], '{}', null);
  end if;
  return null;
end;
$$;

create trigger content_documents_after_delete
after delete on public.content_documents
for each row execute function public.content_documents_after_delete();

-- ---------------------------------------------------------------------------
-- Publishing (the only way content reaches the apps)
-- ---------------------------------------------------------------------------

-- Publish documents in ONE transaction → one version bump → every platform updates together.
-- Internal worker (no permission check); used by publish_documents and the seed.
create or replace function public.content_publish_internal(p_ids uuid[], p_note text default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  d public.content_documents%rowtype;
  errs text[];
  cols text[] := '{}';
  ids uuid[] := '{}';
  new_rcs uuid[] := '{}';
begin
  if p_ids is null or cardinality(p_ids) = 0 then
    raise exception 'Nothing to publish';
  end if;

  perform set_config('cms.publishing', 'on', true);

  for d in select * from public.content_documents where id = any (p_ids) order by collection, sort_order for update loop
    errs := public.content_validate(d.collection, d.data);
    if cardinality(errs) > 0 then
      raise exception 'Cannot publish %/%: %', d.collection, d.key, array_to_string(errs, '; ') using errcode = '23514';
    end if;

    insert into public.published_content (document_id, collection, key, data, sort_order, published_at)
    values (d.id, d.collection, d.key, d.data, d.sort_order, now())
    on conflict (document_id) do update
      set key = excluded.key, data = excluded.data, sort_order = excluded.sort_order, published_at = excluded.published_at;

    if d.collection = 'ruleChanges' and d.status <> 'published' then
      new_rcs := array_append(new_rcs, d.id); -- first time live → notify affected devices
    end if;

    update public.content_documents
       set status = 'published', published_hash = md5(data::text), published_at = now(), published_by = auth.uid()
     where id = d.id;

    insert into public.content_revisions (document_id, action, data, note, created_by)
    values (d.id, 'publish', d.data, p_note, auth.uid());

    cols := array_append(cols, d.collection);
    ids := array_append(ids, d.id);
  end loop;

  perform set_config('cms.publishing', 'off', true);

  if cardinality(ids) = 0 then
    raise exception 'Nothing to publish';
  end if;
  return public.content_bump('publish', cols, ids, new_rcs, p_note);
end;
$$;
revoke execute on function public.content_publish_internal(uuid[], text) from public, anon, authenticated;

create or replace function public.publish_documents(p_ids uuid[], p_note text default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_editor() then
    raise exception 'Only CMS editors can publish' using errcode = '42501';
  end if;
  return public.content_publish_internal(p_ids, p_note);
end;
$$;

-- Publish every pending change (new drafts and edits to live documents) that passes
-- validation. Incomplete drafts are left for editors to finish.
create or replace function public.publish_all_changes(p_note text default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  ids uuid[];
begin
  if not public.is_editor() then
    raise exception 'Only CMS editors can publish' using errcode = '42501';
  end if;
  select array_agg(id) into ids from public.content_documents
   where has_changes and status <> 'unpublished' and cardinality(public.content_validate(collection, data)) = 0;
  if ids is null then
    raise exception 'Nothing to publish';
  end if;
  return public.publish_documents(ids, p_note);
end;
$$;

-- Take documents offline everywhere (the draft is kept).
create or replace function public.unpublish_documents(p_ids uuid[], p_note text default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  cols text[];
  ids uuid[];
begin
  if not public.is_editor() then
    raise exception 'Only CMS editors can unpublish' using errcode = '42501';
  end if;
  perform set_config('cms.publishing', 'on', true);
  with u as (
    update public.content_documents
       set status = 'unpublished', published_hash = null
     where id = any (p_ids) and status = 'published'
    returning id, collection, data
  ), r as (
    insert into public.content_revisions (document_id, action, data, note, created_by)
    select id, 'unpublish', data, p_note, auth.uid() from u
  )
  select array_agg(collection), array_agg(id) into cols, ids from u;
  perform set_config('cms.publishing', 'off', true);
  if ids is null then
    raise exception 'Nothing to unpublish';
  end if;
  delete from public.published_content where document_id = any (ids);
  return public.content_bump('unpublish', cols, ids, '{}', p_note);
end;
$$;

-- Devices register their push token with their profile (no account needed).
create or replace function public.register_push_token(
  p_token text, p_platform text, p_nationality text default null, p_status text default null,
  p_city text default null, p_language text default 'en'
)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if p_token !~ '^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$' then
    raise exception 'Invalid push token' using errcode = '22023';
  end if;
  insert into public.push_tokens (token, platform, nationality, status, city, language, updated_at)
  values (p_token, p_platform, p_nationality, p_status, p_city, coalesce(p_language, 'en'), now())
  on conflict (token) do update
    set platform = excluded.platform, nationality = excluded.nationality, status = excluded.status,
        city = excluded.city, language = excluded.language, updated_at = now();
end;
$$;

create or replace function public.unregister_push_token(p_token text)
returns void
language sql security definer set search_path = ''
as $$
  delete from public.push_tokens where token = p_token
$$;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.cms_editors enable row level security;
alter table public.content_documents enable row level security;
alter table public.content_revisions enable row level security;
alter table public.published_content enable row level security;
alter table public.content_state enable row level security;
alter table public.content_events enable row level security;
alter table public.push_tokens enable row level security;

-- Editors
create policy "editors see themselves, admins see all" on public.cms_editors
  for select to authenticated using (user_id = auth.uid() or public.is_cms_admin());
create policy "admins manage editors" on public.cms_editors
  for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());

-- Drafts: editors only
create policy "editors read drafts" on public.content_documents
  for select to authenticated using (public.is_editor());
create policy "editors create drafts" on public.content_documents
  for insert to authenticated with check (public.is_editor());
create policy "editors edit drafts" on public.content_documents
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "admins delete documents" on public.content_documents
  for delete to authenticated using (public.is_cms_admin());

create policy "editors read history" on public.content_revisions
  for select to authenticated using (public.is_editor());
create policy "editors read events" on public.content_events
  for select to authenticated using (public.is_editor());

-- Live content and the version signal: everyone can read, nobody writes directly
create policy "anyone reads live content" on public.published_content
  for select to anon, authenticated using (true);
create policy "anyone reads content version" on public.content_state
  for select to anon, authenticated using (true);

-- push_tokens: no policies → only the service role (Edge Function) can read them.

-- ---------------------------------------------------------------------------
-- Privileges (defence in depth on top of RLS)
-- ---------------------------------------------------------------------------
revoke insert, update, delete, truncate on public.published_content, public.content_state, public.content_events,
  public.content_revisions from anon, authenticated;
revoke all on public.push_tokens from anon, authenticated;
revoke all on public.content_documents, public.cms_editors from anon;

revoke execute on function public.publish_documents(uuid[], text) from public, anon;
revoke execute on function public.publish_all_changes(text) from public, anon;
revoke execute on function public.unpublish_documents(uuid[], text) from public, anon;
grant execute on function public.publish_documents(uuid[], text) to authenticated;
grant execute on function public.publish_all_changes(text) to authenticated;
grant execute on function public.unpublish_documents(uuid[], text) to authenticated;
grant execute on function public.register_push_token(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.unregister_push_token(text) to anon, authenticated;
grant execute on function public.content_validate(text, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Realtime: apps listen to the single content_state row
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.content_state;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Webhook: send each content event to the Edge Function (pg_net + Vault).
-- Store two secrets in Vault (Dashboard → Project Settings → Vault, or SQL):
--   select vault.create_secret('https://<project>.supabase.co/functions/v1/on-content-published', 'cms_events_url');
--   select vault.create_secret('<random string, same as CMS_WEBHOOK_SECRET>', 'cms_webhook_secret');
-- Without them (e.g. local development) publishing still works; nothing is sent.
-- ---------------------------------------------------------------------------
create or replace function public.content_events_notify()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  url text;
  secret text;
begin
  begin
    execute $q$select decrypted_secret from vault.decrypted_secrets where name = 'cms_events_url'$q$ into url;
    execute $q$select decrypted_secret from vault.decrypted_secrets where name = 'cms_webhook_secret'$q$ into secret;
  exception when others then
    return null; -- Vault not available
  end;
  if url is null then
    return null;
  end if;
  begin
    execute $q$select net.http_post(url := $1, body := $2, headers := $3, timeout_milliseconds := 5000)$q$
      using url,
            jsonb_build_object('type', 'INSERT', 'table', 'content_events', 'record', to_jsonb(new)),
            jsonb_build_object('Content-Type', 'application/json', 'x-cms-webhook-secret', coalesce(secret, ''));
  exception when others then
    raise warning 'content_events webhook not sent: %', sqlerrm; -- never block a publish
  end;
  return null;
end;
$$;

create trigger content_events_notify
after insert on public.content_events
for each row execute function public.content_events_notify();

-- ---------------------------------------------------------------------------
-- Media (guide audio, provider logos): public bucket, editors upload
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public) values ('content-media', 'content-media', true)
    on conflict (id) do nothing;
    execute $p$create policy "editors upload content media" on storage.objects
      for insert to authenticated with check (bucket_id = 'content-media' and public.is_editor())$p$;
    execute $p$create policy "editors update content media" on storage.objects
      for update to authenticated using (bucket_id = 'content-media' and public.is_editor())$p$;
    execute $p$create policy "editors delete content media" on storage.objects
      for delete to authenticated using (bucket_id = 'content-media' and public.is_editor())$p$;
  end if;
end $$;
