import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { homeFor, useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Alert } from '../../components/ui/alert.jsx';
import { Field, Input } from '../../components/ui/input.jsx';
import { errorMessage } from '../../lib/utils.js';

const EXIT_MS = 700;

export default function LoginPage() {
  const { user, authenticate, commit } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await authenticate(username.trim(), password);
      setLeaving(true);
      await new Promise((resolve) => setTimeout(resolve, EXIT_MS));
      const loggedIn = commit(data);
      navigate(homeFor(loggedIn.role), { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Login failed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-in-out motion-reduce:transition-none ${leaving ? 'pointer-events-none -translate-y-3 opacity-0 blur-sm' : 'opacity-100'}`}>
      <div className="animate-item mb-10 text-center">
        <div className="eyebrow mb-6 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gradient-to-l from-mint to-transparent" aria-hidden="true" />
          <span>Microbanking and interest management</span>
          <span className="h-px w-16 bg-gradient-to-r from-mint to-transparent" aria-hidden="true" />
        </div>
        <h1 className="font-display text-[72px] font-medium leading-[1.05] text-skywash">B-Trust</h1>
      </div>

      <div style={{ '--i': 3 }} className="animate-item w-full max-w-sm rounded-2xl bg-canvas/[0.97] p-8 shadow-modal">
        <h2 className="font-display text-[24px] font-medium leading-[1.17] text-ice">Sign in</h2>
        <p className="mt-1 mb-6 text-[14px] text-steel">Customers, agents and administrators all sign in here.</p>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Username" htmlFor="login-user">
            <Input id="login-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required />
          </Field>
          <Field label="Password" htmlFor="login-pass">
            <Input id="login-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </Field>
          <Alert tone="error">{error}</Alert>
          <Button type="submit" variant="violet" size="form" className="w-full" disabled={busy}>{leaving ? 'Welcome' : busy ? 'Signing in...' : 'Continue'}</Button>
        </form>
      </div>
    </div>
  );
}
