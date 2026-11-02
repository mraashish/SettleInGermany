import { useEffect, useMemo, useState } from 'react';

import { fmt, go, statusChip, useCms } from '../cms';
import { defOf, missingTranslations, slugify } from '../schema';
import { type Doc, type Json, type Revision, store } from '../store';
import { FieldList } from '../ui/Fields';
import { PublishDialog } from './PublishDialog';

const SITE = import.meta.env.VITE_SITE_URL ?? import.meta.env.EXPO_PUBLIC_SITE_URL ?? '';

function webPath(collection: string, key: string) {
  if (collection === 'guides') return `/guides/${key}`;
  if (collection === 'cities') return `/guides/city/${key}`;
  return null;
}

export function Editor({ collection, id, autoPublish }: { collection: string; id: string; autoPublish?: boolean }) {
  const def = defOf(collection);
  const { docs, role, reload, toast } = useCms();
  const existing = docs.find((d) => d.id === id);
  const isNew = id === 'new';
  const [draft, setDraft] = useState<Json>(() => existing?.data ?? def?.blank() ?? {});
  const [baseline, setBaseline] = useState(() => JSON.stringify(existing?.data ?? null));
  const [problems, setProblems] = useState<string[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(!!autoPublish);
  const [json, setJson] = useState(false);
  const dirty = JSON.stringify(draft) !== baseline;

  // Another editor saved this document → take their version if we have no local edits.
  useEffect(() => {
    if (existing && !dirty && JSON.stringify(existing.data) !== baseline) {
      setDraft(existing.data);
      setBaseline(JSON.stringify(existing.data));
    }
  }, [existing, dirty, baseline]);

  useEffect(() => {
    if (!def) return;
    const t = window.setTimeout(() => void store.validate(def.name, draft).then(setProblems).catch(() => undefined), 300);
    return () => window.clearTimeout(t);
  }, [draft, def]);

  useEffect(() => {
    if (existing) void store.revisions(existing.id).then(setRevisions);
  }, [existing]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const missing = useMemo(() => (def ? missingTranslations(def.fields, draft) : []), [def, draft]);
  if (!def) return <div className="page"><h1>Not found</h1></div>;
  if (!isNew && !existing) return <div className="page"><p className="muted">Loading…</p></div>;

  const onChange = (next: Json) => {
    // New guide/city: suggest the slug from the English title / name until edited by hand.
    if (isNew && (collection === 'guides' || collection === 'cities')) {
      const src = collection === 'guides' ? ((next.title as Json)?.en as string) : (next.name as string);
      const prevSrc = collection === 'guides' ? ((draft.title as Json)?.en as string) : (draft.name as string);
      if (src !== prevSrc && (!draft.slug || draft.slug === slugify(prevSrc ?? ''))) next = { ...next, slug: slugify(src ?? '') };
    }
    setDraft(next);
  };

  const save = async (then = ''): Promise<Doc | null> => {
    setBusy(true); setError(null);
    try {
      const sort = existing?.sort_order ?? (Math.max(0, ...docs.filter((d) => d.collection === collection).map((d) => d.sort_order)) + 10);
      const doc = await store.saveDocument({ id: existing?.id, collection: def.name, data: draft, sort_order: sort });
      setBaseline(JSON.stringify(doc.data));
      await reload();
      if (isNew) go(`/c/${collection}/${doc.id}${then}`);
      else void store.revisions(doc.id).then(setRevisions);
      return doc;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const saveAndPublish = async () => {
    if (isNew) { await save('/publish'); return; }
    const doc = dirty ? await save() : existing;
    if (doc) setPublishing(true);
  };

  const unpublish = async () => {
    if (!existing || !window.confirm('Take this offline on iOS, Android and web? The draft is kept.')) return;
    try {
      const v = await store.unpublish([existing.id], '');
      await reload();
      toast(`Taken offline everywhere (version ${v}).`);
    } catch (e) { setError((e as Error).message); }
  };

  const remove = async () => {
    if (!existing || !window.confirm('Delete this document permanently? If it is live it disappears from all platforms.')) return;
    try {
      await store.deleteDocument(existing.id);
      await reload();
      toast('Deleted.');
      go(`/c/${collection}`);
    } catch (e) { setError((e as Error).message); }
  };

  const path = existing && existing.status === 'published' ? webPath(collection, existing.key) : null;

  return (
    <div className="page">
      <div className="row" style={{ gap: 8 }}>
        {!def.singleton ? <a href={`#/c/${collection}`}>← {def.label}</a> : null}
      </div>
      <div className="row between">
        <div>
          <h1>{isNew ? `New ${def.singular}` : def.title(draft)}</h1>
          <div className="row" style={{ gap: 8, marginTop: 6 }}>
            {existing ? statusChip(existing) : <span className="chip draft">○ Not saved yet</span>}
            {dirty ? <span className="chip changed">Unsaved edits</span> : null}
            {existing ? <span className="muted small">Saved {fmt(existing.updated_at)}</span> : null}
          </div>
        </div>
      </div>

      <div className="editor">
        <form className="form card" onSubmit={(e) => { e.preventDefault(); void save(); }} aria-label={`${def.singular} form`}>
          {json ? (
            <label className="field">
              <span className="label">Raw JSON (advanced)</span>
              <textarea className="mono" style={{ minHeight: 480 }} defaultValue={JSON.stringify(draft, null, 2)}
                onBlur={(e) => { try { setDraft(JSON.parse(e.target.value) as Json); setError(null); } catch { setError('That JSON is not valid.'); } }} />
            </label>
          ) : (
            <FieldList fields={def.fields} value={draft} onChange={onChange} ctx={{ docs }} />
          )}
        </form>

        <aside className="side">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="button" className="btn" disabled={busy || (!dirty && !isNew)} onClick={() => void save()}>{busy ? 'Saving…' : 'Save draft'}</button>
            <button type="button" className="btn primary" disabled={busy || problems.length > 0 || (!isNew && !dirty && !existing?.has_changes)} onClick={() => void saveAndPublish()}>
              Publish to all platforms
            </button>
            <span className="muted small">Saving keeps a draft only editors can see. Publishing updates the iOS app, the Android app and the website together.</span>
            {existing?.status === 'published' ? <button type="button" className="btn danger small" onClick={() => void unpublish()}>Take offline</button> : null}
            {existing && role === 'admin' ? <button type="button" className="btn text small" style={{ color: 'var(--danger)' }} onClick={() => void remove()}>Delete</button> : null}
            {path && SITE ? <a className="btn text small" href={`${SITE}${path}`} target="_blank" rel="noreferrer">View on the website ↗</a> : null}
            <button type="button" className="btn text small" onClick={() => setJson((j) => !j)}>{json ? 'Back to form' : 'Edit as JSON'}</button>
          </div>

          {error ? <div className="banner danger" role="alert">{error}</div> : null}
          {problems.length ? (
            <div className="banner warn" role="status">
              <strong>Before publishing:</strong>
              <ul className="errors">{problems.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ) : (
            <div className="banner ok" role="status">✓ Ready to publish</div>
          )}
          {missing.length ? (
            <div className="banner info">
              <strong>{missing.length} field{missing.length === 1 ? '' : 's'} need Nepali / Hindi.</strong>
              <div className="small">The apps show English until translated: {missing.slice(0, 4).join(', ')}{missing.length > 4 ? '…' : ''}</div>
            </div>
          ) : null}

          {existing ? (
            <div className="card">
              <h2>History</h2>
              {revisions.length === 0 ? <p className="muted small">No history yet.</p> : revisions.slice(0, 12).map((r) => (
                <div key={r.id} className="rev">
                  <span>
                    <strong style={{ textTransform: 'capitalize' }}>{r.action === 'update' ? 'Saved' : r.action === 'create' ? 'Created' : r.action === 'publish' ? 'Published' : 'Taken offline'}</strong>
                    <span className="muted"> · {fmt(r.created_at)}</span>
                    {r.note ? <div className="muted">“{r.note}”</div> : null}
                  </span>
                  <button type="button" className="btn text small" onClick={() => { setDraft(r.data); toast('Version loaded into the form — save to keep it.'); }}>Restore</button>
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
      {publishing && existing ? <PublishDialog only={[existing.id]} onClose={() => { setPublishing(false); if (autoPublish) go(`/c/${collection}/${existing.id}`); }} /> : null}
    </div>
  );
}
