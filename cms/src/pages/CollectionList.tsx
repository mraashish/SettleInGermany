import { useMemo, useState } from 'react';

import { isOutdated } from '../../../src/content/freshness';
import { fmt, go, statusChip, useCms } from '../cms';
import { defOf, missingTranslations } from '../schema';
import { store } from '../store';

export function CollectionList({ name }: { name: string }) {
  const def = defOf(name);
  const { docs, reload, toast } = useCms();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'changes' | 'drafts' | 'translations' | 'outdated'>('all');
  const list = useMemo(() => docs.filter((d) => d.collection === name).sort((a, b) => a.sort_order - b.sort_order), [docs, name]);
  if (!def) return <div className="page"><h1>Not found</h1></div>;

  if (def.singleton && list[0]) {
    go(`/c/${name}/${list[0].id}`);
    return null;
  }

  const shown = list.filter((d) => {
    const text = `${def.title(d.data)} ${d.key} ${def.subtitle?.(d.data) ?? ''}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (filter === 'changes') return d.has_changes && d.status !== 'unpublished';
    if (filter === 'drafts') return d.status === 'draft';
    if (filter === 'translations') return missingTranslations(def.fields, d.data).length > 0;
    if (filter === 'outdated') return typeof d.data.lastVerified === 'string' && isOutdated(d.data.lastVerified);
    return true;
  });

  const move = async (i: number, dir: -1 | 1) => {
    const a = list[i];
    const b = list[i + dir];
    if (!a || !b) return;
    await store.reorder([{ id: a.id, sort_order: b.sort_order }, { id: b.id, sort_order: a.sort_order === b.sort_order ? b.sort_order + dir : a.sort_order }]);
    await reload();
    toast('Order saved. Publish the changed items to update the apps.');
  };

  return (
    <div className="page">
      <div className="row between">
        <div>
          <h1>{def.label}</h1>
          <p className="muted" style={{ margin: '4px 0 0' }}>{def.description}</p>
        </div>
        <a className="btn primary" href={`#/c/${name}/new`}>+ New {def.singular}</a>
      </div>
      <div className="row">
        <input type="search" aria-label={`Search ${def.label}`} placeholder={`Search ${def.label.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
        <div className="row" role="tablist" aria-label="Filter" style={{ gap: 6 }}>
          {([
            ['all', 'All'], ['changes', 'Unpublished changes'], ['drafts', 'Drafts'], ['translations', 'Needs translation'],
            ...(name === 'guides' ? [['outdated', 'Older than 6 months']] : []),
          ] as [typeof filter, string][]).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={filter === id} className={`btn small ${filter === id ? 'primary' : ''}`} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>
      </div>
      <table>
        <thead>
          <tr><th style={{ width: 70 }}>Order</th><th>Title</th><th>Status</th><th>Translations</th><th>Saved</th></tr>
        </thead>
        <tbody>
          {shown.map((d) => {
            const i = list.indexOf(d);
            const missing = missingTranslations(def.fields, d.data).length;
            const outdated = typeof d.data.lastVerified === 'string' && isOutdated(d.data.lastVerified);
            return (
              <tr key={d.id}>
                <td>
                  <button type="button" className="btn text small" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                  <button type="button" className="btn text small" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)}>↓</button>
                </td>
                <td>
                  <a className="title" href={`#/c/${name}/${d.id}`}>{def.title(d.data)}</a>
                  <div className="muted small">{d.key}{def.subtitle ? ` · ${def.subtitle(d.data)}` : ''}</div>
                </td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    {statusChip(d)}
                    {outdated ? <span className="chip changed" title="Apps show “We’re re-checking this guide”">↻ Re-check</span> : null}
                  </div>
                </td>
                <td>{missing ? <span className="chip changed">{missing} missing</span> : <span className="chip live">✓ en · ne · hi</span>}</td>
                <td className="muted small">{fmt(d.updated_at)}</td>
              </tr>
            );
          })}
          {shown.length === 0 ? <tr><td colSpan={5} className="muted">Nothing here.</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}
