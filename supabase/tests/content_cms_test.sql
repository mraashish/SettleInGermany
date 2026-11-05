-- Tests for the central content database. Run with scripts/test-db.sh.
-- Each block raises an exception (and stops psql) when an expectation fails.

-- Test users
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@example.com'),
  ('00000000-0000-0000-0000-00000000000e', 'editor@example.com'),
  ('00000000-0000-0000-0000-00000000000f', 'reader@example.com');
insert into public.cms_editors (user_id, email, role) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@example.com', 'admin'),
  ('00000000-0000-0000-0000-00000000000e', 'editor@example.com', 'editor');

-- 1. Seed: one release; the bundled Leipzig content is complete, so every document is live
do $$
declare v bigint; live int; drafts int;
begin
  select version into v from public.content_state;
  if v <> 1 then raise exception 'seed should publish exactly one release, version=%', v; end if;
  select count(*) into live from public.published_content where collection = 'guides';
  select count(*) into drafts from public.content_documents where collection = 'guides' and status = 'draft';
  if live < 1 or drafts <> 0 then raise exception 'expected all guides live, got % live / % draft', live, drafts; end if;
  if not exists (select 1 from public.published_content where collection = 'rules' and key = 'default') then
    raise exception 'rules singleton not published';
  end if;
  if (select count(*) from public.published_content where collection = 'tasks') <> (select count(*) from public.content_documents where collection = 'tasks') then
    raise exception 'all tasks should be live';
  end if;
end $$;

-- 2. Anonymous visitors (the apps) read live content only
set role anon;
do $$
begin
  if (select count(*) from public.published_content) = 0 then raise exception 'anon cannot read live content'; end if;
  if (select version from public.content_state) <> 1 then raise exception 'anon cannot read version'; end if;
  begin
    perform 1 from public.content_documents limit 1;
    raise exception 'anon must not read drafts';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.published_content (document_id, collection, key, data) values (gen_random_uuid(), 'guides', 'x', '{}');
    raise exception 'anon must not write live content';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.publish_all_changes();
    raise exception 'anon must not publish';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.push_tokens limit 1;
    raise exception 'anon must not read push tokens';
  exception when insufficient_privilege then null;
  end;
  -- Devices can register for rule-change notifications
  perform public.register_push_token('ExponentPushToken[abc123]', 'ios', 'nepal', 'student', 'leipzig', 'ne');
  begin
    perform public.register_push_token('not-a-token', 'ios');
    raise exception 'invalid push token accepted';
  exception when invalid_parameter_value then null;
  end;
end $$;
reset role;
do $$ begin
  if (select count(*) from public.push_tokens where nationality = 'nepal') <> 1 then raise exception 'push token not stored'; end if;
end $$;

-- 3. Signed-in users who are not editors see no drafts and cannot publish
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000f';
do $$
begin
  if (select count(*) from public.content_documents) <> 0 then raise exception 'non-editor can see drafts'; end if;
  begin
    perform public.publish_all_changes();
    raise exception 'non-editor published';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 4. Editors: drafts, history, publishing
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000e';
do $$
declare
  doc uuid; doc2 uuid; rc uuid; v0 bigint; v1 bigint; v2 bigint; ev public.content_events%rowtype;
begin
  select version into v0 from public.content_state;

  -- New documents always start as drafts, even if a status is sent
  insert into public.content_documents (collection, key, data, status)
  values ('phrases', 'ignored', '{"id":"p-test","german":"Guten Tag","transliteration":{},"meaning":{"en":"Good day"},"situation":{"en":"Bank"}}', 'published')
  returning id into doc;
  if (select status from public.content_documents where id = doc) <> 'draft' then raise exception 'insert must create a draft'; end if;
  if (select key from public.content_documents where id = doc) <> 'p-test' then raise exception 'key must come from the data'; end if;
  if exists (select 1 from public.published_content where document_id = doc) then raise exception 'draft leaked to live content'; end if;

  -- Editing creates history; status cannot be changed by a plain update
  update public.content_documents set data = jsonb_set(data, '{german}', '"Guten Morgen"'), status = 'published' where id = doc;
  if (select status from public.content_documents where id = doc) <> 'draft' then raise exception 'status changed without publishing'; end if;
  if (select count(*) from public.content_revisions where document_id = doc) <> 2 then raise exception 'history missing'; end if;

  -- Validation blocks incomplete content
  begin
    insert into public.content_documents (collection, key, data) values ('providers', 'x', '{"id":"bad","name":"P","category":"bank","url":"https://p.example","isPartner":true}')
    returning id into doc2;
    perform public.publish_documents(array[doc2], 'should fail');
    raise exception 'partner without referral URL was published';
  exception when check_violation then null;
  end;
  if exists (select 1 from public.content_documents where key = 'bad') then raise exception 'failed publish must roll back the block'; end if;

  -- A new rule change, published together with the phrase in ONE release
  insert into public.content_documents (collection, key, data)
  values ('ruleChanges', 'x', '{"id":"rc-test","date":"2026-11-02","affects":{"nationalities":["nepal"]},"summary":{"en":"Test change"}}')
  returning id into rc;
  v1 := public.publish_documents(array[doc, rc], 'Release test');
  if v1 <> v0 + 1 then raise exception 'one publish must bump the version once (% -> %)', v0, v1; end if;
  if (select changed_collections from public.content_state) <> array['phrases', 'ruleChanges'] then
    raise exception 'changed collections wrong: %', (select changed_collections from public.content_state);
  end if;
  if (select data ->> 'german' from public.published_content where document_id = doc) <> 'Guten Morgen' then raise exception 'live copy not updated'; end if;
  if (select has_changes from public.content_documents where id = doc) then raise exception 'published doc should have no pending changes'; end if;
  select * into ev from public.content_events order by id desc limit 1;
  if ev.version <> v1 or ev.action <> 'publish' or not (rc = any (ev.new_rule_changes)) then raise exception 'event wrong: %', to_jsonb(ev); end if;

  -- Editing a live document does not change the live copy until published
  update public.content_documents set data = jsonb_set(data, '{summary,en}', '"Edited"') where id = rc;
  if (select data #>> '{summary,en}' from public.published_content where document_id = rc) <> 'Test change' then raise exception 'edit leaked before publish'; end if;
  if not (select has_changes from public.content_documents where id = rc) then raise exception 'pending change not flagged'; end if;
  -- publish_all_changes skips incomplete drafts (a guide without sources) instead of failing
  insert into public.content_documents (collection, key, data)
  values ('guides', 'x', '{"slug":"incomplete-guide","title":{"en":"Incomplete"},"stage":"first30","sources":[]}');
  v2 := public.publish_all_changes('Second release');
  if not exists (select 1 from public.content_documents where collection = 'guides' and status = 'draft') then
    raise exception 'incomplete drafts must not be published';
  end if;
  if (select data #>> '{summary,en}' from public.published_content where document_id = rc) <> 'Edited' then raise exception 'publish_all_changes missed an edit'; end if;
  select * into ev from public.content_events order by id desc limit 1;
  if cardinality(ev.new_rule_changes) <> 0 then raise exception 're-publishing must not notify again'; end if;

  -- Unpublish takes it offline everywhere, the draft stays
  perform public.unpublish_documents(array[doc]);
  if exists (select 1 from public.published_content where document_id = doc) then raise exception 'unpublish failed'; end if;
  if (select status from public.content_documents where id = doc) <> 'unpublished' then raise exception 'status not unpublished'; end if;
  if (select action from public.content_events order by id desc limit 1) <> 'unpublish' then raise exception 'unpublish event missing'; end if;

  -- Editors cannot delete (admins only): RLS silently filters the row
  delete from public.content_documents where id = rc;
  if not exists (select 1 from public.content_documents where id = rc) then raise exception 'editor deleted a document'; end if;
end $$;

-- 5. Admins delete; deleting live content removes it from every platform
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
do $$
declare rc uuid; v0 bigint;
begin
  select id into rc from public.content_documents where key = 'rc-test';
  select version into v0 from public.content_state;
  delete from public.content_documents where id = rc;
  if exists (select 1 from public.published_content where document_id = rc) then raise exception 'deleted doc still live'; end if;
  if (select version from public.content_state) <> v0 + 1 then raise exception 'delete must bump the version'; end if;
  if (select action from public.content_events order by id desc limit 1) <> 'delete' then raise exception 'delete event missing'; end if;
end $$;
reset role;

select 'content_cms tests: all passed' as result;
