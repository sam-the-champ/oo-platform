'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  getCertifications, createCertification, updateCertification, deleteCertification,
  type Certification,
} from '@/lib/firestore';
import { Modal, ConfirmDialog, Field, ColorPicker, Spinner, EmptyState } from '@/components/admin/AdminUI';
import toast from 'react-hot-toast';

const BLANK: Omit<Certification, 'id'> = {
  name: '', issuer: '', level: '', year: new Date().getFullYear().toString(),
  credentialId: '', credentialUrl: '', imageUrl: '', color: '#f5a623', order: 0,
};

export default function AdminCertifications() {
  const searchParams = useSearchParams();
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState<Omit<Certification, 'id'>>(BLANK);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setCerts(await getCertifications());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (searchParams.get('new') === '1') openNew(); }, [searchParams]);

  function openNew() {
    setEditing(null);
    setForm({ ...BLANK, order: certs.length });
    setModalOpen(true);
  }

  function openEdit(c: Certification) {
    setEditing(c);
    setForm({ name: c.name, issuer: c.issuer, level: c.level, year: c.year,
      credentialId: c.credentialId ?? '', credentialUrl: c.credentialUrl ?? '',
      imageUrl: c.imageUrl ?? '', color: c.color, order: c.order });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.issuer) { toast.error('Name and issuer are required.'); return; }
    setSaving(true);
    try {
      if (editing?.id) { await updateCertification(editing.id, form); toast.success('Certification updated.'); }
      else { await createCertification(form); toast.success('Certification added.'); }
      setModalOpen(false);
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    try { await deleteCertification(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Certifications</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>
            {certs.length} certification{certs.length !== 1 ? 's' : ''} · displayed on public site
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Add Certification</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : certs.length === 0 ? (
        <EmptyState icon="🏆" title="No certifications yet"
          desc="Add your professional certifications — AWS, GCP, Kubernetes, and more."
          action={<button className="btn btn-primary" onClick={openNew}>+ Add Certification</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map(cert => (
            <div key={cert.id} className="card p-5"
              style={{ borderColor: `${cert.color}20`, background: `linear-gradient(135deg, var(--surface), ${cert.color}06)` }}>
              <div className="flex justify-between items-start mb-3">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ background: `${cert.color}12`, border: `1px solid ${cert.color}25` }}>
                  {cert.imageUrl ? (
                    <Image src={cert.imageUrl} alt={cert.issuer} width={36} height={36} style={{ objectFit: 'contain' }} />
                  ) : (
                    <span className="font-display font-black text-sm" style={{ color: cert.color }}>
                      {cert.issuer.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(cert)} className="btn btn-outline text-xs px-2 py-1">Edit</button>
                  <button onClick={() => setDeleteId(cert.id!)} className="btn btn-danger text-xs px-2 py-1">×</button>
                </div>
              </div>
              <div className="font-mono text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: cert.color }}>
                {cert.level}
              </div>
              <h3 className="font-display font-bold text-sm mb-1 leading-snug">{cert.name}</h3>
              <div className="text-xs" style={{ color: 'var(--text3)' }}>{cert.issuer} · {cert.year}</div>
              {cert.credentialId && (
                <div className="mt-2 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                  ID: {cert.credentialId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Certification' : 'Add Certification'}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Certification Name *">
              <input className="input text-sm" placeholder="AWS Solutions Architect"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Issuing Organization *">
              <input className="input text-sm" placeholder="Amazon Web Services"
                value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Level / Type">
              <input className="input text-sm" placeholder="Professional, Associate..."
                value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} />
            </Field>
            <Field label="Year Obtained">
              <input className="input text-sm" placeholder="2024"
                value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </Field>
          </div>
          <Field label="Credential ID">
            <input className="input text-sm" placeholder="ABC-1234-XYZ"
              value={form.credentialId} onChange={e => setForm({ ...form, credentialId: e.target.value })} />
          </Field>
          <Field label="Credential URL (verify link)">
            <input className="input text-sm" placeholder="https://credly.com/..."
              value={form.credentialUrl} onChange={e => setForm({ ...form, credentialUrl: e.target.value })} />
          </Field>
          <Field label="Badge / Logo Image URL">
            <input className="input text-sm" placeholder="https://... (optional)"
              value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          </Field>
          <Field label="Accent Color">
            <ColorPicker value={form.color} onChange={color => setForm({ ...form, color })} />
          </Field>
          <Field label="Display Order">
            <input className="input text-sm" type="number" min={0}
              value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
          </Field>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 justify-center">
              {saving ? <Spinner size={14} /> : (editing ? 'Save Changes' : 'Add Certification')}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn btn-outline px-5">Cancel</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Certification" message="Remove this certification from your profile?" />
    </div>
  );
}
