'use client';

import { useEffect, useState } from 'react';
import { getAnalytics, getArticles, getProjects } from '@/lib/firestore';
import { Spinner } from '@/components/admin/AdminUI';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [articles, setArticles] = useState<Awaited<ReturnType<typeof getArticles>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getArticles(true)]).then(([a, arts]) => {
      setAnalytics(a);
      setArticles(arts);
      setLoading(false);
    });
  }, []);

  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl mb-1">Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--text3)' }}>Content performance and engagement metrics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Article Views', value: totalViews.toLocaleString(), color: 'var(--accent)' },
          { label: 'Published Articles', value: articles.length, color: 'var(--purple)' },
          { label: 'Page Views (tracked)', value: (analytics.total ?? 0).toLocaleString(), color: 'var(--green)' },
          { label: 'Featured Articles', value: articles.filter(a => a.featured).length, color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="font-display font-black text-3xl mb-1" style={{ color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div className="font-mono text-xs" style={{ color: 'var(--text3)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Article performance */}
      {articles.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="font-display font-bold text-base mb-5">Article Views Breakdown</h2>
          <div className="flex flex-col gap-3">
            {articles.sort((a, b) => (b.views || 0) - (a.views || 0)).map(article => {
              const maxViews = Math.max(...articles.map(a => a.views || 0), 1);
              const pct = ((article.views || 0) / maxViews) * 100;
              return (
                <div key={article.id}>
                  <div className="flex justify-between mb-1.5 gap-4">
                    <span className="text-sm font-medium truncate flex-1">{article.title}</span>
                    <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--accent)' }}>
                      {(article.views || 0).toLocaleString()} views
                    </span>
                  </div>
                  <div className="skill-track">
                    <div className="skill-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card p-6">
        <h2 className="font-display font-bold text-base mb-3">Note on Analytics</h2>
        <p className="text-sm" style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
          View counts are tracked each time a blog post page is loaded. For full website analytics
          (sessions, bounce rate, traffic sources), connect Google Analytics or Plausible by adding
          the tracking script to your <code className="font-mono text-xs px-1 py-0.5 rounded"
            style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>layout.tsx</code>.
        </p>
      </div>
    </div>
  );
}
