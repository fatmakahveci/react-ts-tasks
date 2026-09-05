'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { firebaseServices } from '../lib/firebase';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [register, setRegister] = useState(false);

  useEffect(() => {
    try {
      return onAuthStateChanged(firebaseServices().auth, (nextUser) => {
        setUser(nextUser);
        setReady(true);
      });
    } catch {
      // Defer configuration feedback to avoid synchronous effect state updates.
      queueMicrotask(() => {
        setError('Task storage is not configured. Follow the README setup instructions.');
        setReady(true);
      });
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      const auth = firebaseServices().auth;
      const operation = register ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
      await operation(auth, String(data.get('email')).trim(), String(data.get('password')));
    } catch {
      setError('Unable to sign in or create this account. Check your details and try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="app-shell" role="status">Loading your workspace…</main>;
  if (user) return <div key={user.uid}>
    <nav className="account-bar" aria-label="Account">
      <span>{user.email}</span>
      <button disabled={busy} onClick={async () => {
        setBusy(true);
        try { await signOut(firebaseServices().auth); }
        catch { setError('Unable to sign out. Please try again.'); }
        finally { setBusy(false); }
      }}>Sign out</button>
      {error && <p role="alert">{error}</p>}
    </nav>
    {children}
  </div>;

  return <main className="app-shell">
    <header className="hero"><p className="eyebrow">DAILY FOCUS</p><h1>Your space to focus.</h1><p>Sign in to keep your tasks private and available across devices.</p></header>
    <form className="auth-form" onSubmit={submit}>
      <h2>{register ? 'Create your account' : 'Welcome back'}</h2>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required disabled={busy} />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} minLength={6} required disabled={busy} />
      <button type="submit" disabled={busy}>{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button>
      <button type="button" disabled={busy} onClick={() => { setRegister(!register); setError(''); }}>{register ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  </main>;
}
