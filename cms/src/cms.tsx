import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { type Doc, type Role, store, type User } from './store';

interface Cms {
  user: User | null;
  role: Role | null;
  docs: Doc[];
  version: number;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  toast: (msg: string) => void;
}

const Ctx = createContext<Cms | null>(null);
export const useCms = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCms outside provider');
  return c;
};

/** Hash routes: #/, #/c/guides, #/c/guides/<id|new>, #/editors */
export function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash.split('/').filter(Boolean);
}
export const go = (path: string) => { window.location.hash = path; };

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToast] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [d, v] = await Promise.all([store.listDocuments(), store.liveVersion()]);
      setDocs(d);
      setVersion(v.version);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async (u: User | null) => {
      setUser(u);
      if (!u) { setRole(null); setLoading(false); return; }
      try {
        const r = await store.role();
        if (!alive) return;
        setRole(r);
        if (r) await reload();
      } catch (e) {
        setError((e as Error).message);
      }
      if (alive) setLoading(false);
    };
    void store.currentUser().then(load);
    const off = store.onAuthChange((u) => void load(u));
    return () => { alive = false; off(); };
  }, [reload]);

  // Other editors' saves and releases show up without reloading the page.
  useEffect(() => (role ? store.subscribe(() => void reload()) : undefined), [role, reload]);

  const toast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 5000);
  }, []);

  return (
    <Ctx.Provider value={{ user, role, docs, version, loading, error, reload, toast }}>
      {children}
      {toastMsg ? <div className="toast" role="status">{toastMsg}</div> : null}
    </Ctx.Provider>
  );
}

export function statusChip(d: Pick<Doc, 'status' | 'has_changes'>) {
  if (d.status === 'unpublished') return <span className="chip off">● Offline</span>;
  if (d.status === 'draft') return <span className="chip draft">○ Draft</span>;
  if (d.has_changes) return <span className="chip changed">◐ Live · changes not published</span>;
  return <span className="chip live">✓ Live</span>;
}

export const fmt = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '—';
