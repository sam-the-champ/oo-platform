'use client';

import { useEffect, useState, useCallback } from 'react';
import { getNewsletterSubscribers, type NewsletterSubscriber } from '@/lib/firestore';
import { Spinner, EmptyState } from '@/components/admin/AdminUI';
import { format } from 'date-fns';

export default function AdminNewsletter() {
  const [subs, setSubs] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setSubs(await getNewsletterSubscribers());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = subs.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const csvExport = () => {
    const rows = [['Email', 'Name', 'Subscribed At'], ...subs.map(s => [s.email, s.name ?? '', s.subscribedAt ? format(s.subscribedAt.toDate(), 'yyyy-MM-dd') : ''])];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Newsletter</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>{subs.length} subscriber{subs.length !== 1 ? 's' : ''}</p>
        </div>
        {subs.length > 0 && (
          <button onClick={csvExport} className="btn btn-outline text-sm">↓ Export CSV</button>
        )}
      </div>

      {subs.length > 0 && (
        <div className="mb-5">
          <input className="input text-sm" placeholder="Search by email or name..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 360 }} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : subs.length === 0 ? (
        <EmptyState icon="📧" title="No subscribers yet"
          desc="Subscribers from the newsletter form on your public site will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Email', 'Name', 'Subscribed', 'Status'].map(h => (
                  <th key={h} className="font-mono text-xs text-left p-4" style={{ color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}
                  className="hover:bg-surface2 transition-colors">
                  <td className="p-4 text-sm font-mono">{s.email}</td>
                  <td className="p-4 text-sm" style={{ color: 'var(--text2)' }}>{s.name || '—'}</td>
                  <td className="p-4 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                    {s.subscribedAt ? format(s.subscribedAt.toDate(), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="p-4">
                    <span className={`badge ${s.active ? 'badge-green' : 'badge-red'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm" style={{ color: 'var(--text3)' }}>No results for "{search}"</div>
          )}
        </div>
      )}
    </div>
  );
}
