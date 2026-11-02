import { useState } from 'react';

import { useCms } from '../cms';
import { store } from '../store';

export function Login() {
  const { user, role, error: loadError } = useCms();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (user && !role) {
    return (
      <div className="login"><div className="card">
        <h1>No editor access</h1>
        <p className="muted">You are signed in as {user.email}, but this account is not a CMS editor. Ask an admin to invite you.</p>
        {loadError ? <div className="banner danger">{loadError}</div> : null}
        <button type="button" className="btn" onClick={() => void store.signOut()}>Sign out</button>
      </div></div>
    );
  }
  return (
    <div className="login">
      <form className="card" onSubmit={async (e) => {
        e.preventDefault(); setError(null);
        try { await store.signInWithPassword(email, password); } catch (x) { setError((x as Error).message); }
      }}>
        <div className="brand" style={{ padding: 0 }}><span className="logo" />Settle in Germany · Content</div>
        <h1>Sign in</h1>
        <label className="field"><span className="label">Email</span><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="field"><span className="label">Password</span><input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error ? <div className="banner danger" role="alert">{error}</div> : null}
        {msg ? <div className="banner ok" role="status">{msg}</div> : null}
        <button className="btn primary" type="submit" disabled={!password}>Sign in</button>
        <button className="btn" type="button" disabled={!email} onClick={async () => {
          setError(null);
          try { await store.sendMagicLink(email); setMsg(`We sent a sign-in link to ${email}.`); } catch (x) { setError((x as Error).message); }
        }}>Email me a sign-in link</button>
      </form>
    </div>
  );
}
