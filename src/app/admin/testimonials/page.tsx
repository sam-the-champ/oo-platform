'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  type Testimonial,
} from '@/lib/firestore';
import { Modal, ConfirmDialog, Field, Spinner, EmptyState } from '@/components/admin/AdminUI';
import toast from 'react-hot-toast';

const BLANK: Omit<Testimonial, 'id'> = {
  name: '', role: '', company: '', text: '', avatarUrl: '', featured: true, order: 0,
};

export default function AdminTestimonials() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(BLANK);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getTestimonials());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (searchParams.get('new') === '1') openNew(); }, [searchParams]);

  function openNew() {
    setEditing(null);
    setForm({ ...BLANK, order: items.length });
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({ name: t.name, role: t.role, company: t.company, text: t.text,
      avatarUrl: t.avatarUrl ?? '', featured: t.featured, order: t.order });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.text) { toast.error('Name and testimonial text are required.'); return; }
    setSaving(true);
    try {
      if (editing?.id) { await updateTestimonial(editing.id, form); toast.success('Testimonial updated.'); }
      else { await createTestimonial(form); toast.success('Testimonial added.'); }
      setModalOpen(false);
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    try { await deleteTestimonial(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Testimonials</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>{items.length} total</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Add Testimonial</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : items.length === 0 ? (
        <EmptyState icon="⭐" title="No testimonials yet"
          desc="Add testimonials from colleagues, clients, and mentees."
          action={<button className="btn btn-primary" onClick={openNew}>+ Add Testimonial</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(t => (
            <div key={t.id} className="card p-5">
              <div className="flex justify-between items-start mb-3 gap-2">
                <div>
                  <div className="font-display font-bold text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text3)' }}>{t.role}{t.company ? `, ${t.company}` : ''}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {t.featured && <span className="badge badge-gold">Featured</span>}
                  <button onClick={() => openEdit(t)} className="btn btn-outline text-xs px-2 py-1">Edit</button>
                  <button onClick={() => setDeleteId(t.id!)} className="btn btn-danger text-xs px-2 py-1">×</button>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name *">
              <input className="input text-sm" placeholder="Adaeze Okonkwo"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Role / Title">
              <input className="input text-sm" placeholder="CTO"
                value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            </Field>
          </div>
          <Field label="Company">
            <input className="input text-sm" placeholder="Company name"
              value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          </Field>
          <Field label="Testimonial Text *">
            <textarea className="input text-sm" style={{ minHeight: 120 }}
              placeholder="What did they say about working with you?"
              value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
          </Field>
          <Field label="Avatar Image URL">
            <input className="input text-sm" placeholder="https://... (optional)"
              value={form.avatarUrl} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} />
          </Field>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="feat-t" checked={form.featured}
              onChange={e => setForm({ ...form, featured: e.target.checked })}
              style={{ accentColor: 'var(--accent)', width: 14, height: 14, cursor: 'pointer' }} />
            <label htmlFor="feat-t" className="text-sm cursor-pointer">Show on homepage</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 justify-center">
              {saving ? <Spinner size={14} /> : (editing ? 'Save Changes' : 'Add Testimonial')}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn btn-outline px-5">Cancel</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Testimonial" message="Remove this testimonial?" />
    </div>
  );
}
