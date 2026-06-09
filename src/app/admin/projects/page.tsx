'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  getProjects, createProject, updateProject, deleteProject,
  type Project,
} from '@/lib/firestore';
import { getGitHubRepos, type GitHubRepo } from '@/lib/github';
import { Modal, ConfirmDialog, Field, TagsInput, StatusBadge, Spinner, EmptyState } from '@/components/admin/AdminUI';
import toast from 'react-hot-toast';

const BLANK: Omit<Project, 'id'> = {
  title: '', category: '', description: '', tags: [], status: 'draft',
  coverImage: '', githubUrl: '', demoUrl: '',
  featured: false, order: 0, techStack: [],
};

export default function AdminProjects() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, 'id'>>(BLANK);
  const [saving, setSaving] = useState(false);
  // GitHub import
  const [ghRepos, setGhRepos] = useState<GitHubRepo[]>([]);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghTab, setGhTab] = useState<'manual' | 'github'>('manual');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (searchParams.get('new') === '1') openNew();
  }, [searchParams]);

  function openNew() {
    setEditing(null);
    setForm({ ...BLANK, order: projects.length });
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({ title: p.title, category: p.category, description: p.description, tags: p.tags,
      status: p.status, coverImage: p.coverImage ?? '', githubUrl: p.githubUrl ?? '',
      demoUrl: p.demoUrl ?? '', featured: p.featured, order: p.order, techStack: p.techStack });
    setModalOpen(true);
  }

  async function loadGitHubRepos() {
    setGhLoading(true);
    const repos = await getGitHubRepos(30);
    setGhRepos(repos);
    setGhLoading(false);
  }

  function importFromGitHub(repo: GitHubRepo) {
    setForm(f => ({
      ...f,
      title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: repo.description ?? '',
      githubUrl: repo.html_url,
      demoUrl: repo.homepage ?? '',
      tags: repo.topics,
      techStack: repo.language ? [repo.language] : [],
      category: 'Open Source',
    }));
    setGhTab('manual');
    toast.success('Imported from GitHub. Review and save.');
  }

  async function handleSave() {
    if (!form.title || !form.category || !form.description) {
      toast.error('Title, category and description are required.');
      return;
    }
    setSaving(true);
    try {
      if (editing?.id) {
        await updateProject(editing.id, form);
        toast.success('Project updated.');
      } else {
        await createProject(form);
        toast.success('Project created.');
      }
      setModalOpen(false);
      load();
    } catch {
      toast.error('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      toast.success('Project deleted.');
      load();
    } catch {
      toast.error('Delete failed.');
    }
  }

  async function toggleStatus(p: Project) {
    const next = p.status === 'live' ? 'draft' : 'live';
    await updateProject(p.id!, { status: next });
    toast.success(`Project ${next === 'live' ? 'published' : 'unpublished'}.`);
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Projects</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>{projects.length} total</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ New Project</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : projects.length === 0 ? (
        <EmptyState icon="🚀" title="No projects yet"
          desc="Add your first project to showcase your work on the public site."
          action={<button className="btn btn-primary" onClick={openNew}>+ Add Project</button>} />
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map(p => (
            <div key={p.id} className="card p-4 flex items-center gap-4 flex-wrap">
              {/* Thumb */}
              <div style={{
                width: 56, height: 56, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
                background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {p.coverImage ? (
                  <Image src={p.coverImage} alt={p.title} width={56} height={56} style={{ objectFit: 'cover' }} />
                ) : (
                  <span className="font-display font-black text-lg grad-text">
                    {p.title.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display font-bold text-sm">{p.title}</span>
                  {p.featured && <span className="badge badge-gold">Featured</span>}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs" style={{ color: 'var(--text3)' }}>{p.category}</span>
                  {p.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <StatusBadge status={p.status} />
                <button onClick={() => toggleStatus(p)}
                  className="btn btn-outline text-xs px-3 py-1.5">
                  {p.status === 'live' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => openEdit(p)}
                  className="btn btn-outline text-xs px-3 py-1.5">Edit</button>
                <button onClick={() => setDeleteId(p.id!)}
                  className="btn btn-danger text-xs px-3 py-1.5">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Project' : 'New Project'}>
        {/* Tabs */}
        {!editing && (
          <div className="flex mb-5 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {(['manual', 'github'] as const).map(tab => (
              <button key={tab} onClick={() => { setGhTab(tab); if (tab === 'github' && !ghRepos.length) loadGitHubRepos(); }}
                className="flex-1 py-2 text-xs font-semibold capitalize transition-all"
                style={{
                  background: ghTab === tab ? 'var(--accent)' : 'transparent',
                  color: ghTab === tab ? '#000' : 'var(--text2)',
                  border: 'none', cursor: 'pointer',
                }}>
                {tab === 'github' ? '⭐ Import from GitHub' : '✏️ Manual Entry'}
              </button>
            ))}
          </div>
        )}

        {ghTab === 'github' && !editing ? (
          <div>
            {ghLoading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : ghRepos.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: 'var(--text3)' }}>
                No repos found. Make sure NEXT_PUBLIC_GITHUB_USERNAME is set.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {ghRepos.map(repo => (
                  <button key={repo.id} onClick={() => importFromGitHub(repo)}
                    className="card p-3 text-left flex items-start gap-3 w-full hover:border-accent transition-all"
                    style={{ cursor: 'pointer' }}>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm font-semibold mb-1" style={{ color: 'var(--accent)' }}>{repo.name}</div>
                      <p className="text-xs mb-2 truncate" style={{ color: 'var(--text2)' }}>{repo.description ?? 'No description'}</p>
                      <div className="flex gap-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                        {repo.language && <span>{repo.language}</span>}
                        <span>★ {repo.stargazers_count}</span>
                        <span>⑂ {repo.forks_count}</span>
                      </div>
                    </div>
                    <span className="btn btn-outline text-xs px-3 py-1 flex-shrink-0">Import</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Title *">
                <input className="input text-sm" placeholder="Project name"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Category *">
                <input className="input text-sm" placeholder="SaaS, DevOps, Fintech..."
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </Field>
            </div>
            <Field label="Description *">
              <textarea className="input text-sm" placeholder="What does this project do?"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <input className="input text-sm" placeholder="https://github.com/..."
                  value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
              </Field>
              <Field label="Demo URL">
                <input className="input text-sm" placeholder="https://..."
                  value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} />
              </Field>
            </div>
            <Field label="Cover Image URL">
              <input className="input text-sm" placeholder="https://... (leave blank for auto)"
                value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} />
            </Field>
            <Field label="Tags">
              <TagsInput value={form.tags} onChange={tags => setForm({ ...form, tags })} placeholder="React, TypeScript..." />
            </Field>
            <Field label="Tech Stack">
              <TagsInput value={form.techStack} onChange={techStack => setForm({ ...form, techStack })} placeholder="Node.js, AWS..." />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Status">
                <select className="input text-sm" value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as Project['status'] })}>
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
              <Field label="Order">
                <input className="input text-sm" type="number" min={0}
                  value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
              </Field>
              <Field label="Featured">
                <div className="flex items-center h-10">
                  <input type="checkbox" id="featured" checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="featured" className="ml-2 text-sm cursor-pointer">Featured</label>
                </div>
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 justify-center">
                {saving ? <Spinner size={16} /> : (editing ? 'Save Changes' : 'Create Project')}
              </button>
              <button onClick={() => setModalOpen(false)} className="btn btn-outline px-5">Cancel</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}
