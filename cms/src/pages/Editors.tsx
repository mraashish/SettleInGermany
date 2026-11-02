import { useEffect, useState } from 'react';

import { useCms } from '../cms';
import { type Editor, type Role, store } from '../store';

export function Editors() {
  const { role, user, toast } = useCms();
  const [list, setList] = useState<Editor[]>([]);
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('editor');
  const [error, setError] = useState<string | null>(null);
  const load = () => void store.listEditors().then(setList).catch((e: Error) => setError(e.message));
  useEffect(load, []);
  if (role !== 'admin') return <div className="page"><h1>Editors</h1><p className="muted">Only admins can manage editors.</p></div>;

  return (
    <div className="page">
      <h1>Editors</h1>
      <p className="muted" style={{ margin: 0 }}>Editors write and publish content. Admins can also delete documents and manage editors.</p>
      <form className="card row" onSubmit={async (e) => {
        e.preventDefault(); setError(null);
        try { await store.inviteEditor(email, newRole); toast(`Invitation sent to ${email}.`); setEmail(''); load(); } catch (x) { setError((x as Error).message); }
      }}>
        <label className="field" style={{ flex: 1, minWidth: 220 }}><span className="label">Invite by email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" /></label>
        <label className="field"><span className="label">Role</span>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value as Role)}><option value="editor">Editor</option><option value="admin">Admin</option></select></label>
        <button className="btn primary" type="submit" style={{ alignSelf: 'flex-end' }}>Send invite</button>
      </form>
      {error ? <div className="banner danger" role="alert">{error}</div> : null}
      <table>
        <thead><tr><th>Email</th><th>Role</th><th /></tr></thead>
        <tbody>
          {list.map((e) => (
            <tr key={e.user_id}>
              <td>{e.email ?? e.user_id}{e.user_id === user?.id ? <span className="muted"> (you)</span> : null}</td>
              <td>
                <select aria-label={`Role for ${e.email}`} value={e.role} disabled={e.user_id === user?.id}
                  onChange={async (x) => { await store.setEditorRole(e.user_id, x.target.value as Role); load(); }}>
                  <option value="editor">Editor</option><option value="admin">Admin</option>
                </select>
              </td>
              <td style={{ textAlign: 'right' }}>
                {e.user_id !== user?.id ? <button type="button" className="btn text small" style={{ color: 'var(--danger)' }}
                  onClick={async () => { if (window.confirm(`Remove ${e.email} as an editor?`)) { await store.removeEditor(e.user_id); load(); } }}>Remove</button> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
