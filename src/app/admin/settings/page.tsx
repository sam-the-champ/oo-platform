'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProfile, saveProfile, type ProfileData } from '@/lib/firestore';
import { Field, Spinner } from '@/components/admin/AdminUI';
import toast from 'react-hot-toast';

const BLANK: ProfileData = {
  name: 'Olalekan Ogundimu',
  title: 'Full Stack Engineer & AWS Cloud Architect',
  tagline: 'Building the future of African tech',
  bio: 'Full Stack Software Engineer and AWS Cloud Architect with 7+ years of experience building systems that scale.',
  email: 'ogundimuolalekan55@gmail.com',
  phone: '+234 812 942 4016',
  location: 'Lagos, Nigeria',
  linkedinUrl: 'https://www.linkedin.com/in/olalekanogundimu',
  githubUrl: 'https://github.com/',
  twitterUrl: '',
  instagramUrl: 'https://www.instagram.com/mr_sams01',
  avatarUrl: '',
  yearsExp: 7,
  projectsCount: 50,
  mentoredCount: 0,
  githubUsername: '',
  availableForWork: true,
  resumeUrl: '',
};

export default function AdminSettings() {
  const [form, setForm] = useState<ProfileData>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'contact' | 'social' | 'stats'>('profile');

  useEffect(() => {
    getProfile().then(p => {
      if (p) setForm({ ...BLANK, ...p });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveProfile(form);
      toast.success('Settings saved! Changes will appear on the public site.');
    } catch {
      toast.error('Save failed. Check your Firebase config.');
    } finally {
      setSaving(false);
    }
  }

  const TABS = ['profile', 'contact', 'social', 'stats'] as const;

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl mb-1">Site Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text3)' }}>
          Everything here powers the public site dynamically — no code changes needed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-7 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 text-xs font-semibold capitalize rounded-lg transition-all"
            style={{
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#000' : 'var(--text2)',
              border: 'none', cursor: 'pointer',
            }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {activeTab === 'profile' && (
          <>
            {/* Avatar preview */}
            {form.avatarUrl && (
              <div className="flex items-center gap-4 p-4 card">
                <Image src={form.avatarUrl} alt="Avatar preview" width={56} height={56}
                  style={{ borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div className="text-sm font-medium">{form.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text3)' }}>Avatar preview</div>
                </div>
              </div>
            )}
            <Field label="Full Name">
              <input className="input text-sm" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Professional Title">
              <input className="input text-sm" placeholder="Full Stack Engineer & AWS Cloud Architect"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <input className="input text-sm" placeholder="One-liner for the hero section"
                value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
            </Field>
            <Field label="Bio">
              <textarea className="input text-sm" style={{ minHeight: 120 }}
                placeholder="A few sentences about you..."
                value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </Field>
            <Field label="Profile Photo URL" hint="Paste a direct image URL. Use Firebase Storage or Cloudinary.">
              <input className="input text-sm" placeholder="https://..."
                value={form.avatarUrl ?? ''} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} />
            </Field>
            <Field label="Resume / CV URL">
              <input className="input text-sm" placeholder="https://... (Google Drive, Dropbox, etc.)"
                value={form.resumeUrl ?? ''} onChange={e => setForm({ ...form, resumeUrl: e.target.value })} />
            </Field>
            <Field label="Location">
              <input className="input text-sm" placeholder="Lagos, Nigeria"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </Field>
            <div className="flex items-center gap-3 p-3 card">
              <input type="checkbox" id="avail" checked={form.availableForWork}
                onChange={e => setForm({ ...form, availableForWork: e.target.checked })}
                style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer' }} />
              <label htmlFor="avail" className="text-sm cursor-pointer">
                Show &quot;Available for consulting&quot; badge on hero
              </label>
            </div>
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <Field label="Email Address">
              <input className="input text-sm" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone Number">
              <input className="input text-sm" placeholder="+234 812 942 4016"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Field>
          </>
        )}

        {activeTab === 'social' && (
          <>
            <Field label="LinkedIn URL">
              <input className="input text-sm" placeholder="https://linkedin.com/in/..."
                value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} />
            </Field>
            <Field label="GitHub Profile URL">
              <input className="input text-sm" placeholder="https://github.com/..."
                value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
            </Field>
            <Field label="GitHub Username" hint="Used to fetch your repos for the Projects GitHub import feature.">
              <input className="input text-sm" placeholder="your-github-username"
                value={form.githubUsername} onChange={e => setForm({ ...form, githubUsername: e.target.value })} />
            </Field>
            <Field label="Instagram URL">
              <input className="input text-sm" placeholder="https://instagram.com/..."
                value={form.instagramUrl ?? ''} onChange={e => setForm({ ...form, instagramUrl: e.target.value })} />
            </Field>
            <Field label="Twitter / X URL">
              <input className="input text-sm" placeholder="https://twitter.com/..."
                value={form.twitterUrl ?? ''} onChange={e => setForm({ ...form, twitterUrl: e.target.value })} />
            </Field>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <p className="text-sm p-3 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--text2)', lineHeight: 1.65 }}>
              These numbers appear as animated counters in the hero section. Set them to reflect your real-world numbers.
            </p>
            <Field label="Years of Experience">
              <input className="input text-sm" type="number" min={0}
                value={form.yearsExp} onChange={e => setForm({ ...form, yearsExp: Number(e.target.value) })} />
            </Field>
            <Field label="Projects Completed">
              <input className="input text-sm" type="number" min={0}
                value={form.projectsCount} onChange={e => setForm({ ...form, projectsCount: Number(e.target.value) })} />
            </Field>
            <Field label="Engineers Mentored">
              <input className="input text-sm" type="number" min={0}
                value={form.mentoredCount} onChange={e => setForm({ ...form, mentoredCount: Number(e.target.value) })} />
            </Field>
          </>
        )}

        <button onClick={handleSave} disabled={saving}
          className="btn btn-primary justify-center py-3 mt-2">
          {saving ? <Spinner size={16} /> : '💾 Save All Settings'}
        </button>
      </div>
    </div>
  );
}
