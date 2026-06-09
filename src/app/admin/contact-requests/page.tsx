'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getContactRequests, updateContactStatus, deleteContactRequest, type ContactRequest,
} from '@/lib/firestore';
import { ConfirmDialog, StatusBadge, Spinner, EmptyState } from '@/components/admin/AdminUI';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminContactRequests() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getContactRequests());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markStatus(id: string, status: ContactRequest['status']) {
    try {
      await updateContactStatus(id, status);
      setItems(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success(`Marked as ${status}.`);
    } catch { toast.error('Update failed.'); }
  }

  async function handleDelete(id: string) {
    try { await deleteContactRequest(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  }

  const newCount = items.filter(c => c.status === 'new').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Contact Requests</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>
            {items.length} total · {newCount > 0 && <span style={{ color: 'var(--gold)' }}>{newCount} new</span>}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : items.length === 0 ? (
        <EmptyState icon="📬" title="No contact requests yet"
          desc="When visitors fill out your contact form, requests will appear here." />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(c => (
            <div key={c.id} className="card overflow-hidden">
              <div className="p-4 flex items-start gap-4 flex-wrap cursor-pointer"
                onClick={() => setExpanded(expanded === c.id ? null : c.id!)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-display font-bold text-sm">{c.name}</span>
                    <span className="tag">{c.type}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="flex gap-3 font-mono text-xs flex-wrap" style={{ color: 'var(--text3)' }}>
                    <span>{c.email}</span>
                    {c.createdAt && <><span>·</span><span>{format(c.createdAt.toDate(), 'MMM d, yyyy HH:mm')}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {c.status === 'new' && (
                    <button onClick={e => { e.stopPropagation(); markStatus(c.id!, 'read'); }}
                      className="btn btn-outline text-xs px-3 py-1.5">Mark Read</button>
                  )}
                  {c.status !== 'replied' && (
                    <a href={`mailto:${c.email}?subject=Re: ${c.type}`}
                      onClick={e => { e.stopPropagation(); markStatus(c.id!, 'replied'); }}
                      className="btn btn-primary text-xs px-3 py-1.5" style={{ textDecoration: 'none' }}>
                      Reply →
                    </a>
                  )}
                  <button onClick={e => { e.stopPropagation(); setDeleteId(c.id!); }}
                    className="btn btn-danger text-xs px-3 py-1.5">×</button>
                </div>
              </div>

              {expanded === c.id && (
                <div className="px-4 pb-4 pt-0">
                  <div className="p-4 rounded-lg text-sm leading-relaxed"
                    style={{ background: 'var(--surface2)', color: 'var(--text2)', borderTop: '1px solid var(--border)' }}>
                    {c.message}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Contact Request" message="Permanently delete this contact request?" />
    </div>
  );
}
