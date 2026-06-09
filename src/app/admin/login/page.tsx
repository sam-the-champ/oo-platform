'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/admin');
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials.';
      toast.error(msg.includes('wrong-password') || msg.includes('user-not-found')
        ? 'Invalid email or password.' : 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-6"
      style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-display font-black text-3xl grad-text mb-2" style={{ letterSpacing: '-1.5px' }}>OO.</div>
          <h1 className="font-display font-bold text-xl mb-1">Admin Portal</h1>
          <p className="font-mono text-xs" style={{ color: 'var(--text3)' }}>
            Sign in to manage your platform
          </p>
        </div>

        <form onSubmit={handleLogin}
          className="card p-8 flex flex-col gap-5"
          style={{ borderRadius: 20 }}>
          <div>
            <label className="input-label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="admin@yourdomain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary justify-center py-3 mt-1"
            style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #00003380', borderTop: '2px solid #000', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Signing in...
              </span>
            ) : 'Sign In →'}
          </button>
        </form>

        <p className="text-center font-mono text-xs mt-6" style={{ color: 'var(--text3)' }}>
          Create your Firebase Auth user at<br />
          <span style={{ color: 'var(--accent)' }}>firebase.google.com/console</span>
        </p>
      </div>
    </div>
  );
}
