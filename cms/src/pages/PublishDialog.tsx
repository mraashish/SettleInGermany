import { useEffect, useMemo, useState } from 'react';

import { fmt, useCms } from '../cms';
import { defOf } from '../schema';
import { type Doc, store } from '../store';

/**
 * Publish to all platforms: every selected change goes live in ONE release
 * (one version bump) → iOS, Android and web update together.
 */
export function PublishDialog({ onClose, only }: { onClose: () => void; only?: string[] }) {
  const { docs, reload, toast } = useCms();
  const pending = useMemo(
    () => docs.filter((d) => d.has_changes && d.status !== 'unpublished' && (!only || only.includes(d.id))),
    [docs, only],
  );
  const [problems, setProblems] = useState<Record<string, string[]>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void Promise.all(pending.map(async (d) => [d.id, await store.validate(d.collection, d.data)] as const)).then((r) => {
      if (!alive) return;
      const p = Object.fromEntries(r);
      setProblems(p);
      setSelected(pending.filter((d) => !p[d.id]?.length).map((d) => d.id));
    });
    return () => { alive = false; };
  }, [pending]);

  const ready = pending.filter((d) => !problems[d.id]?.length);
  const blocked = pending.filter((d) => problems[d.id]?.length);
  const title = (d: Doc) => defOf(d.collection)?.title(d.data) ?? d.key;

  const publish = async () => {
    setBusy(true); setError(null);
    try {
      const v = await store.publish(selected, note);
      await reload();
      toast(`Published ${selected.length} change${selected.length === 1 ? '' : 's'} — live on iOS, Android and web (version ${v}). The website rebuild has started.`);
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="pub-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="pub-title" style={{ fontSize: 22, lineHeight: '28px' }}>Publish to all platforms</h2>
        <p className="muted" style={{ margin: 0 }}>
          Selected changes go live together in one release. Open apps update within seconds; the website’s static pages are rebuilt automatically.
        </p>
        {pending.length === 0 ? <div className="banner ok">Everything is published. There are no pending changes.</div> : null}
        {ready.length ? (
          <div>
            <div className="row between"><strong>Ready ({ready.length})</strong>
              <button type="button" className="btn text small" onClick={() => setSelected(selected.length === ready.length ? [] : ready.map((d) => d.id))}>
                {selected.length === ready.length ? 'Select none' : 'Select all'}
              </button>
            </div>
            {ready.map((d) => (
              <label key={d.id} className="check-row">
                <input type="checkbox" checked={selected.includes(d.id)} onChange={(e) => setSelected((s) => (e.target.checked ? [...s, d.id] : s.filter((x) => x !== d.id)))} />
                <span style={{ flex: 1 }}>
                  <strong>{title(d)}</strong>
                  <span className="muted small"> · {defOf(d.collection)?.label} · {d.status === 'draft' ? 'new' : 'edited'} · saved {fmt(d.updated_at)}</span>
                </span>
              </label>
            ))}
          </div>
        ) : null}
        {blocked.length ? (
          <div className="banner warn">
            <strong>Not ready ({blocked.length}) — fix these first, or leave them as drafts:</strong>
            {blocked.map((d) => (
              <div key={d.id} style={{ marginTop: 6 }}>
                <a href={`#/c/${d.collection}/${d.id}`} onClick={onClose}>{title(d)}</a>: {problems[d.id].join('; ')}
              </div>
            ))}
          </div>
        ) : null}
        <label className="field">
          <span className="label">Release note (optional)</span>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. New 2027 blocked-account amount" />
        </label>
        {error ? <div className="banner danger" role="alert">{error}</div> : null}
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn text" onClick={onClose}>Cancel</button>
          <button type="button" className="btn primary" disabled={busy || selected.length === 0} onClick={publish}>
            {busy ? 'Publishing…' : `Publish ${selected.length} to iOS, Android and web`}
          </button>
        </div>
      </div>
    </div>
  );
}
