import { useEffect, useState } from 'react';

import { isOutdated } from '../../../src/content/freshness';
import { fmt, useCms } from '../cms';
import { COLLECTION_DEFS, missingTranslations } from '../schema';
import { type Release, store } from '../store';

export function Dashboard({ onPublish }: { onPublish: () => void }) {
  const { docs, version } = useCms();
  const [releases, setReleases] = useState<Release[]>([]);
  useEffect(() => { void store.releases().then(setReleases); }, [version]);

  const pending = docs.filter((d) => d.has_changes && d.status !== 'unpublished');
  const outdated = docs.filter((d) => d.collection === 'guides' && d.status === 'published' && typeof d.data.lastVerified === 'string' && isOutdated(d.data.lastVerified));
  const untranslated = docs.filter((d) => { const def = COLLECTION_DEFS.find((c) => c.name === d.collection); return def && missingTranslations(def.fields, d.data).length > 0; });
  const drafts = docs.filter((d) => d.status === 'draft');

  return (
    <div className="page">
      <div className="row between">
        <div>
          <h1>Content</h1>
          <p className="muted" style={{ margin: '4px 0 0' }}>One database for the iOS app, the Android app and the website. Publishing updates all three at once.</p>
        </div>
        <button type="button" className="btn primary" disabled={pending.length === 0} onClick={onPublish}>Publish {pending.length} change{pending.length === 1 ? '' : 's'}</button>
      </div>

      <div className="card row between">
        <div>
          <div className="muted small">Live content version</div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: '34px' }}>v{version}</div>
        </div>
        {store.mode === 'demo' ? (
          <div className="banner warn small" style={{ maxWidth: 520 }}>
            Demo mode: changes stay in this browser. Connect the Supabase project (see README) and every publish reaches the iOS app, the Android app and the website.
          </div>
        ) : (
          <div className="platforms" aria-label="Platforms reading this database">
            <span className="platform"><span className="ok">✓</span> iOS app · updates live</span>
            <span className="platform"><span className="ok">✓</span> Android app · updates live</span>
            <span className="platform"><span className="ok">✓</span> Website · updates live, pages rebuilt for search</span>
          </div>
        )}
      </div>

      <div className="grid2">
        <div className="card"><h2>Waiting to publish</h2><p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>{pending.length}</p><span className="muted small">{drafts.length} never published</span></div>
        <div className="card"><h2>Need Nepali / Hindi</h2><p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>{untranslated.length}</p><span className="muted small">Apps show English until translated</span></div>
        <div className="card"><h2>Guides to re-check</h2><p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>{outdated.length}</p><span className="muted small">Verified more than 6 months ago</span></div>
      </div>

      {outdated.length ? (
        <div className="card">
          <h2>Guides to re-check</h2>
          {outdated.map((d) => <div key={d.id} className="rev"><a href={`#/c/guides/${d.id}`}>{String((d.data.title as { en?: string })?.en ?? d.key)}</a><span className="muted">verified {String(d.data.lastVerified)}</span></div>)}
        </div>
      ) : null}

      <div className="card">
        <h2>Recent releases</h2>
        {releases.length === 0 ? <p className="muted small">No releases yet.</p> : (
          <table style={{ marginTop: 10 }}>
            <thead><tr><th>Version</th><th>What</th><th>When</th><th>Website rebuild / notifications</th></tr></thead>
            <tbody>
              {releases.map((r) => (
                <tr key={r.id}>
                  <td><strong>v{r.version}</strong></td>
                  <td>
                    <span className={`chip ${r.action === 'publish' ? 'live' : 'off'}`}>{r.action === 'publish' ? 'Published' : r.action === 'unpublish' ? 'Taken offline' : 'Deleted'}</span>{' '}
                    {r.document_ids.length} item{r.document_ids.length === 1 ? '' : 's'} · {r.collections.join(', ')}
                    {r.note ? <div className="muted small">“{r.note}”</div> : null}
                  </td>
                  <td className="muted small">{fmt(r.created_at)}</td>
                  <td className="small">
                    {r.processed_at ? <span className="mono">{JSON.stringify(r.result)}</span> : <span className="muted">Waiting for the webhook…</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
