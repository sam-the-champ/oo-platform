'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getProjects, getArticles, getContactRequests,
  getMentorshipApplications, getNewsletterSubscribers,
} from '@/lib/firestore';
import { format } from 'date-fns';

interface Stats {
  projects: number;
  publishedArticles: number;
  newContacts: number;
  pendingMentorship: number;
  subscribers: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Awaited<ReturnType<typeof getContactRequests>>>([]);
  const [applications, setApplications] = useState<Awaited<ReturnType<typeof getMentorshipApplications>>>([]);

  useEffect(() => {
    Promise.all([
      getProjects(),
      getArticles(),
      getContactRequests(),
      getMentorshipApplications(),
      getNewsletterSubscribers(),
    ]).then(([projects, articles, contactReqs, mentorApps, subs]) => {
      setStats({
        projects: projects.filter(p => p.status === 'live').length,
        publishedArticles: articles.filter(a => a.status === 'published').length,
        newContacts: contactReqs.filter(c => c.status === 'new').length,
        pendingMentorship: mentorApps.filter(m => m.status === 'pending').length,
        subscribers: subs.length,
      });
      setContacts(contactReqs.slice(0, 5));
      setApplications(mentorApps.slice(0, 4));
    });
  }, []);

  const statCards = [
    { label: 'Live Projects', value: stats?.projects ?? '—', color: 'var(--accent)', href: '/admin/projects' },
    { label: 'Published Articles', value: stats?.publishedArticles ?? '—', color: 'var(--purple)', href: '/admin/articles' },
    { label: 'New Contacts', value: stats?.newContacts ?? '—', color: 'var(--gold)', href: '/admin/contact-requests' },
    { label: 'Pending Mentorship', value: stats?.pendingMentorship ?? '—', color: 'var(--green)', href: '/admin/mentorship' },
    { label: 'Newsletter Subs', value: stats?.subscribers ?? '—', color: '#ff4757', href: '/admin/newsletter' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl mb-1">Good day, Lekan 👋</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Here&apos;s your platform at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {statCards.map(s => (
          <Link key={s.label} href={s.href}
            className="card p-5 flex flex-col gap-2 card-hover"
            style={{ textDecoration: 'none', color: 'var(--text)' }}>
            <div className="font-display font-black text-3xl" style={{ color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div className="font-mono text-xs" style={{ color: 'var(--text3)', lineHeight: 1.3 }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent contacts */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display font-bold text-base">Recent Contact Requests</h2>
            <Link href="/admin/contact-requests" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
              View all →
            </Link>
          </div>
          {contacts.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text3)' }}>No contacts yet.</p>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
              {contacts.map(c => (
                <div key={c.id} className="flex justify-between items-center py-3 gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{c.name}</div>
                    <div className="font-mono text-xs truncate" style={{ color: 'var(--text3)' }}>{c.email}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${c.status === 'new' ? 'badge-gold' : c.status === 'replied' ? 'badge-green' : 'badge-blue'}`}>
                      {c.status}
                    </span>
                    {c.createdAt && (
                      <span className="font-mono text-xs" style={{ color: 'var(--text3)' }}>
                        {format(c.createdAt.toDate(), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentorship applications */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display font-bold text-base">Mentorship Applications</h2>
            <Link href="/admin/mentorship" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
              View all →
            </Link>
          </div>
          {applications.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text3)' }}>No applications yet.</p>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
              {applications.map(a => (
                <div key={a.id} className="flex justify-between items-center py-3 gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{a.name}</div>
                    <div className="font-mono text-xs" style={{ color: 'var(--text3)' }}>{a.plan}</div>
                  </div>
                  <span className={`badge flex-shrink-0 ${a.status === 'pending' ? 'badge-gold' : a.status === 'approved' ? 'badge-green' : 'badge-red'}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <h2 className="font-display font-bold text-base mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ New Project', href: '/admin/projects?new=1' },
            { label: '+ New Article', href: '/admin/articles?new=1' },
            { label: '+ Add Certification', href: '/admin/certifications?new=1' },
            { label: '+ Add Skill', href: '/admin/skills?new=1' },
            { label: '+ Add Testimonial', href: '/admin/testimonials?new=1' },
          ].map(a => (
            <Link key={a.label} href={a.href} className="btn btn-outline text-xs px-4 py-2">
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
