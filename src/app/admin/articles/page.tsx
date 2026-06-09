'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
  getArticles, createArticle, updateArticle, deleteArticle,
  type Article,
} from '@/lib/firestore';
import { Modal, ConfirmDialog, Field, TagsInput, StatusBadge, Spinner, EmptyState } from '@/components/admin/AdminUI';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min`;
}

const BLANK: Omit<Article, 'id' | 'views'> = {
  title: '', slug: '', content: '', excerpt: '',
  category: '', tags: [], status: 'draft',
  coverImage: '', readTime: '', seoTitle: '', seoDescription: '',
  featured: false,
};

function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const ToolBtn = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      className={`tiptap-btn ${active ? 'active' : ''}`}>{children}</button>
  );

  return (
    <div className="tiptap-editor">
      <div className="tiptap-toolbar">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}><b>B</b></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}><i>I</i></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>H1</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>• List</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>1. List</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>" Quote</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>{'</>'} Code</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()}>— HR</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().undo().run()}>↩ Undo</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()}>↪ Redo</ToolBtn>
      </div>
      <div className="tiptap-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default function AdminArticles() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<Omit<Article, 'id' | 'views'>>(BLANK);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getArticles();
    setArticles(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (searchParams.get('new') === '1') openNew();
  }, [searchParams]);

  function openNew() {
    setEditing(null);
    setForm({ ...BLANK });
    setEditorOpen(true);
  }

  function openEdit(a: Article) {
    setEditing(a);
    setForm({
      title: a.title, slug: a.slug, content: a.content, excerpt: a.excerpt,
      category: a.category, tags: a.tags, status: a.status,
      coverImage: a.coverImage ?? '', readTime: a.readTime ?? '',
      seoTitle: a.seoTitle ?? '', seoDescription: a.seoDescription ?? '',
      featured: a.featured,
    });
    setEditorOpen(true);
  }

  function handleTitleChange(title: string) {
    setForm(f => ({
      ...f, title,
      slug: editing ? f.slug : slugify(title),
      seoTitle: f.seoTitle || title,
    }));
  }

  async function handleSave(publish = false) {
    if (!form.title || !form.content) {
      toast.error('Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        readTime: estimateReadTime(form.content),
        status: publish ? 'published' as const : form.status,
      };
      if (editing?.id) {
        await updateArticle(editing.id, payload);
        toast.success(publish ? 'Article published!' : 'Article saved.');
      } else {
        await createArticle({ ...payload, views: 0 });
        toast.success(publish ? 'Article published!' : 'Draft saved.');
      }
      setEditorOpen(false);
      load();
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteArticle(id);
      toast.success('Article deleted.');
      load();
    } catch {
      toast.error('Delete failed.');
    }
  }

  return (
    <div>
      {editorOpen ? (
        // Full-screen editor
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display font-black text-xl">{editing ? 'Edit Article' : 'New Article'}</h1>
            <button onClick={() => setEditorOpen(false)} className="btn btn-ghost text-sm">
              ← Back to Articles
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Field label="Title *">
                <input className="input text-base font-display font-bold" placeholder="Article title..."
                  value={form.title} onChange={e => handleTitleChange(e.target.value)} />
              </Field>
              <Field label="Content *">
                <RichEditor value={form.content} onChange={content => setForm({ ...form, content })} />
              </Field>
              <Field label="Excerpt">
                <textarea className="input text-sm" placeholder="Short summary shown in article listings..."
                  style={{ minHeight: 80 }}
                  value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
              </Field>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Publish */}
              <div className="card p-5">
                <h3 className="font-display font-bold text-sm mb-4">Publish</h3>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleSave(false)} disabled={saving}
                    className="btn btn-outline text-sm justify-center py-2.5">
                    {saving ? <Spinner size={14} /> : '💾 Save Draft'}
                  </button>
                  <button onClick={() => handleSave(true)} disabled={saving}
                    className="btn btn-primary text-sm justify-center py-2.5">
                    {saving ? <Spinner size={14} /> : '🚀 Publish'}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <StatusBadge status={form.status} />
                  {form.readTime && <span style={{ color: 'var(--text3)' }}>{form.readTime} read</span>}
                </div>
              </div>

              {/* Settings */}
              <div className="card p-5 flex flex-col gap-3">
                <h3 className="font-display font-bold text-sm mb-1">Settings</h3>
                <Field label="Slug">
                  <input className="input text-xs font-mono" placeholder="url-slug"
                    value={form.slug} onChange={e => setForm({ ...form, slug: slugify(e.target.value) })} />
                </Field>
                <Field label="Category">
                  <input className="input text-sm" placeholder="Cloud Architecture, Backend..."
                    value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </Field>
                <Field label="Tags">
                  <TagsInput value={form.tags} onChange={tags => setForm({ ...form, tags })} />
                </Field>
                <Field label="Cover Image URL">
                  <input className="input text-xs" placeholder="https://..."
                    value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} />
                </Field>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured-art" checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    style={{ accentColor: 'var(--accent)', width: 14, height: 14, cursor: 'pointer' }} />
                  <label htmlFor="featured-art" className="text-sm cursor-pointer">Featured article</label>
                </div>
              </div>

              {/* SEO */}
              <div className="card p-5 flex flex-col gap-3">
                <h3 className="font-display font-bold text-sm mb-1">SEO</h3>
                <Field label="SEO Title">
                  <input className="input text-xs" placeholder="Browser tab title"
                    value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} />
                </Field>
                <Field label="Meta Description">
                  <textarea className="input text-xs" style={{ minHeight: 70 }}
                    placeholder="150-160 characters ideal"
                    value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} />
                </Field>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Article list
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display font-black text-2xl mb-1">Articles</h1>
              <p className="text-sm" style={{ color: 'var(--text3)' }}>{articles.length} total</p>
            </div>
            <button className="btn btn-primary" onClick={openNew}>+ New Article</button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size={32} /></div>
          ) : articles.length === 0 ? (
            <EmptyState icon="✍️" title="No articles yet"
              desc="Share your engineering insights and attract a following."
              action={<button className="btn btn-primary" onClick={openNew}>+ Write Article</button>} />
          ) : (
            <div className="flex flex-col gap-3">
              {articles.map(a => (
                <div key={a.id} className="card p-4 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-display font-bold text-sm truncate">{a.title}</span>
                      {a.featured && <span className="badge badge-gold">Featured</span>}
                    </div>
                    <div className="flex gap-3 font-mono text-xs flex-wrap" style={{ color: 'var(--text3)' }}>
                      <span>{a.category}</span>
                      {a.readTime && <><span>·</span><span>{a.readTime}</span></>}
                      {a.views > 0 && <><span>·</span><span>{a.views.toLocaleString()} views</span></>}
                      {a.publishedAt && <><span>·</span><span>{format(a.publishedAt.toDate(), 'MMM d, yyyy')}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    <StatusBadge status={a.status} />
                    <button onClick={() => openEdit(a)} className="btn btn-outline text-xs px-3 py-1.5">Edit</button>
                    <button onClick={() => setDeleteId(a.id!)} className="btn btn-danger text-xs px-3 py-1.5">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Article" message="This will permanently delete the article and all its content." />
    </div>
  );
}
