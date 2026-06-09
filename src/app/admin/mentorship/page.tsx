'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getMentorshipApplications, updateMentorshipStatus, type MentorshipApplication,
} from '@/lib/firestore';
import { ConfirmDialog, StatusBadge, Spinner, EmptyState } from '@/components/admin/AdminUI';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminMentorship() {
  const [items, setItems] = useState<MentorshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getMentorshipApplications());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleStatus(id: string, status: MentorshipApplication['status']) {
    try {
      await updateMentorshipStatus(id, status);
      setItems(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      toast.success(`Application ${status}.`);
    } catch { toast.error('Update failed.'); }
  }

  const pending = items.filter(m => m.status === 'pending').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl mb-1">Mentorship Applications</h1>
        <p className="text-sm" style={{ color: 'var(--text3)' }}>
          {items.length} total · {pending > 0 && <span style={{ color: 'var(--gold)' }}>{pending} pending review</span>}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : items.length === 0 ? (
        <EmptyState icon="🎓" title="No applications yet"
          desc="Mentorship applications from the public site will appear here." />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(m => (
            <div key={m.id} className="card overflow-hidden">
              <div className="p-4 flex items-start gap-4 flex-wrap cursor-pointer"
                onClick={() => setExpanded(expanded === m.id ? null : m.id!)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-display font-bold text-sm">{m.name}</span>
                    <span className="tag">{m.plan}</span>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="flex gap-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                    <span>{m.email}</span>
                    {m.createdAt && <><span>·</span><span>{format(m.createdAt.toDate(), 'MMM d, yyyy')}</span></>}
                  </div>
                </div>
                {m.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); handleStatus(m.id!, 'approved'); }}
                      className="btn text-xs px-3 py-1.5"
                      style={{ background: 'rgba(0,214,143,0.1)', color: 'var(--green)', border: '1px solid rgba(0,214,143,0.2)' }}>
                      ✓ Approve
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleStatus(m.id!, 'declined'); }}
                      className="btn btn-danger text-xs px-3 py-1.5">
                      Decline
                    </button>
                  </div>
                )}
                {m.status === 'approved' && (
                  <a href={`mailto:${m.email}?subject=Your Mentorship Application - Approved`}
                    className="btn btn-primary text-xs px-3 py-1.5" style={{ textDecoration: 'none' }}>
                    Send Welcome →
                  </a>
                )}
              </div>

              {expanded === m.id && (
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {m.background && (
                    <div className="p-3 rounded-lg text-xs leading-relaxed"
                      style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                      <div className="font-mono font-semibold mb-1" style={{ color: 'var(--text3)' }}>BACKGROUND</div>
                      {m.background}
                    </div>
                  )}
                  {m.goals && (
                    <div className="p-3 rounded-lg text-xs leading-relaxed"
                      style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                      <div className="font-mono font-semibold mb-1" style={{ color: 'var(--text3)' }}>GOALS</div>
                      {m.goals}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
