'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getSkills, createSkill, updateSkill, deleteSkill, type Skill,
} from '@/lib/firestore';
import { Modal, ConfirmDialog, Field, StatusBadge, Spinner, EmptyState } from '@/components/admin/AdminUI';
import toast from 'react-hot-toast';

const CATEGORIES = ['Frontend', 'Backend', 'AWS Cloud', 'DevOps', 'Database', 'Mobile', 'Other'];
const BLANK: Omit<Skill, 'id'> = { name: '', category: 'Frontend', level: 80, order: 0 };

export default function AdminSkills() {
  const searchParams = useSearchParams();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Omit<Skill, 'id'>>(BLANK);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setSkills(await getSkills());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (searchParams.get('new') === '1') openNew(); }, [searchParams]);

  function openNew() {
    setEditing(null);
    setForm({ ...BLANK, order: skills.length });
    setModalOpen(true);
  }

  function openEdit(s: Skill) {
    setEditing(s);
    setForm({ name: s.name, category: s.category, level: s.level, order: s.order });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name) { toast.error('Name is required.'); return; }
    setSaving(true);
    try {
      if (editing?.id) { await updateSkill(editing.id, form); toast.success('Skill updated.'); }
      else { await createSkill(form); toast.success('Skill added.'); }
      setModalOpen(false);
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    try { await deleteSkill(id); toast.success('Skill deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  }

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Skills</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>{skills.length} total · shown as skill bars on public site</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Add Skill</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : skills.length === 0 ? (
        <EmptyState icon="⚡" title="No skills yet"
          desc="Add your technical skills. They'll appear as animated bars on the public site."
          action={<button className="btn btn-primary" onClick={openNew}>+ Add Skill</button>} />
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="font-mono text-xs font-semibold mb-3 uppercase tracking-widest"
                style={{ color: 'var(--accent)' }}>{cat}</h2>
              <div className="flex flex-col gap-2">
                {items.map(skill => (
                  <div key={skill.id} className="card p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1.5">
                        <span className="font-medium text-sm">{skill.name}</span>
                        <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{skill.level}%</span>
                      </div>
                      <div className="skill-track">
                        <div className="skill-fill" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEdit(skill)} className="btn btn-outline text-xs px-3 py-1.5">Edit</button>
                      <button onClick={() => setDeleteId(skill.id!)} className="btn btn-danger text-xs px-3 py-1.5">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <div className="flex flex-col gap-4">
          <Field label="Skill Name *">
            <input className="input text-sm" placeholder="e.g. React / Next.js"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Category">
            <select className="input text-sm" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={`Proficiency Level: ${form.level}%`}>
            <input type="range" min={10} max={100} step={5} value={form.level}
              onChange={e => setForm({ ...form, level: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div className="skill-track mt-1">
              <div className="skill-fill" style={{ width: `${form.level}%` }} />
            </div>
          </Field>
          <Field label="Display Order">
            <input className="input text-sm" type="number" min={0}
              value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
          </Field>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 justify-center">
              {saving ? <Spinner size={14} /> : (editing ? 'Save Changes' : 'Add Skill')}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn btn-outline px-5">Cancel</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Skill" message="Remove this skill from your profile?" />
    </div>
  );
}
