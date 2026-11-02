import { useState } from 'react';

import { CmsProvider, useCms, useRoute } from './cms';
import { CollectionList } from './pages/CollectionList';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Editors } from './pages/Editors';
import { Login } from './pages/Login';
import { PublishDialog } from './pages/PublishDialog';
import { COLLECTION_DEFS } from './schema';
import { store } from './store';

function Shell() {
  const { user, role, docs, loading, error, version } = useCms();
  const route = useRoute();
  const [publishOpen, setPublishOpen] = useState(false);

  if (loading) return <div className="login"><p className="muted">Loading…</p></div>;
  if (!user || !role) return <Login />;

  const [section, collection, id, extra] = route;
  const pending = docs.filter((d) => d.has_changes && d.status !== 'unpublished');
  let page: React.ReactNode;
  if (section === 'c' && collection && id) page = <Editor key={`${collection}/${id}`} collection={collection} id={id} autoPublish={extra === 'publish'} />;
  else if (section === 'c' && collection) page = <CollectionList key={collection} name={collection} />;
  else if (section === 'editors') page = <Editors />;
  else page = <Dashboard onPublish={() => setPublishOpen(true)} />;

  return (
    <div className="shell">
      <nav className="sidebar" aria-label="Collections">
        <div className="brand"><span className="logo" />Content</div>
        <div className="nav">
          <a href="#/" aria-current={!section ? 'page' : undefined}>Overview</a>
        </div>
        <div className="nav-label">Collections</div>
        <div className="nav">
          {COLLECTION_DEFS.map((c) => {
            const list = docs.filter((d) => d.collection === c.name);
            const changes = list.some((d) => d.has_changes && d.status !== 'unpublished');
            return (
              <a key={c.name} href={`#/c/${c.name}`} aria-current={collection === c.name ? 'page' : undefined}>
                <span>{c.label}{changes ? <span className="dot" title="Unpublished changes" aria-label="has unpublished changes" /> : null}</span>
                <span className="count">{c.singleton ? '' : list.length}</span>
              </a>
            );
          })}
        </div>
        {role === 'admin' ? (<><div className="nav-label">Team</div><div className="nav"><a href="#/editors" aria-current={section === 'editors' ? 'page' : undefined}>Editors</a></div></>) : null}
      </nav>
      <div className="main">
        <header className="topbar">
          <span className="muted small">Live version <strong>v{version}</strong></span>
          {store.mode === 'demo' ? <span className="chip changed">Demo mode — saved in this browser only</span> : null}
          <span className="spacer" />
          <button type="button" className="btn primary" disabled={pending.length === 0} onClick={() => setPublishOpen(true)}>
            Publish {pending.length} change{pending.length === 1 ? '' : 's'}
          </button>
          <span className="muted small">{user.email} · {role}</span>
          <button type="button" className="btn text small" onClick={() => void store.signOut()}>{store.mode === 'demo' ? 'Reset demo' : 'Sign out'}</button>
        </header>
        {error ? <div className="page" style={{ paddingBottom: 0 }}><div className="banner danger" role="alert">{error}</div></div> : null}
        <main>{page}</main>
      </div>
      {publishOpen ? <PublishDialog onClose={() => setPublishOpen(false)} /> : null}
    </div>
  );
}

export default function App() {
  return <CmsProvider><Shell /></CmsProvider>;
}
