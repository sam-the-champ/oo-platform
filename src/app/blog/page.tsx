import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { getArticles } from '@/lib/firestore';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles on cloud architecture, full stack engineering, and career growth.',
};

export const revalidate = 60;

const CAT_COLORS: Record<string, string> = {
  'Cloud Architecture': '#f5a623',
  'Engineering': '#00e5ff',
  'Backend': '#a855f7',
  'Frontend': '#0ea5e9',
  'DevOps': '#00d68f',
  'Career Growth': '#ff4757',
  'TypeScript': '#3178c6',
};

export default async function BlogPage() {
  const articles = await getArticles(true);

  const featured = articles.filter(a => a.featured);
  const rest = articles.filter(a => !a.featured);

  return (
    <PublicLayout>
      <div style={{ paddingTop: 80 }}>
        {/* Header */}
        <section className="section-sm grid-bg" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="section-eyebrow">Technical Writing</div>
            <h1 className="font-display font-black mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
              The <span className="grad-text">Blog</span>
            </h1>
            <p className="text-base" style={{ color: 'var(--text2)', maxWidth: 500, lineHeight: 1.75 }}>
              Deep dives into cloud architecture, full stack engineering, system design, and the craft of building great software.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {articles.length === 0 ? (
              <div className="text-center py-24" style={{ color: 'var(--text3)' }}>
                <div className="text-6xl mb-6">✍️</div>
                <h2 className="font-display font-bold text-xl mb-3">Articles Coming Soon</h2>
                <p className="text-sm">Check back soon for technical deep dives and engineering insights.</p>
              </div>
            ) : (
              <>
                {/* Featured grid */}
                {featured.length > 0 && (
                  <div className="mb-16">
                    <h2 className="font-display font-bold text-lg mb-6" style={{ color: 'var(--text3)' }}>
                      Featured Articles
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {featured.slice(0, 2).map(article => (
                        <Link key={article.id} href={`/blog/${article.slug}`}
                          className="card card-hover overflow-hidden block"
                          style={{ textDecoration: 'none', color: 'var(--text)', borderRadius: 20 }}>
                          <div style={{
                            height: 240, position: 'relative', overflow: 'hidden',
                            background: `linear-gradient(135deg, ${CAT_COLORS[article.category] ?? '#00e5ff'}18, transparent)`,
                          }}>
                            {article.coverImage && (
                              <Image src={article.coverImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="badge"
                                style={{ background: `${CAT_COLORS[article.category] ?? '#00e5ff'}18`, color: CAT_COLORS[article.category] ?? 'var(--accent)', border: `1px solid ${CAT_COLORS[article.category] ?? 'var(--accent)'}30` }}>
                                {article.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-display font-bold text-lg mb-3 leading-snug">{article.title}</h3>
                            {article.excerpt && (
                              <p className="text-sm mb-4" style={{ color: 'var(--text2)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {article.excerpt}
                              </p>
                            )}
                            <div className="flex gap-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                              {article.publishedAt && (
                                <span>
                                  {format(article.publishedAt.toDate(), 'MMM d, yyyy')}
                                </span>
                              )}
                              {article.readTime && <><span>·</span><span>{article.readTime} read</span></>}
                              {article.views > 0 && <><span>·</span><span>{article.views.toLocaleString()} views</span></>}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* All articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map(article => (
                    <Link key={article.id} href={`/blog/${article.slug}`}
                      className="card card-hover overflow-hidden block"
                      style={{ textDecoration: 'none', color: 'var(--text)', borderRadius: 16 }}>
                      <div style={{
                        height: 160, position: 'relative', overflow: 'hidden',
                        background: `linear-gradient(135deg, ${CAT_COLORS[article.category] ?? 'var(--accent)'}14, var(--surface))`,
                      }}>
                        {article.coverImage && (
                          <Image src={article.coverImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
                        )}
                        <div className="absolute bottom-3 left-3">
                          <span className="badge font-mono text-xs"
                            style={{ background: 'rgba(0,0,0,0.6)', color: CAT_COLORS[article.category] ?? 'var(--accent)', backdropFilter: 'blur(10px)' }}>
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display font-bold text-sm mb-2 leading-snug"
                          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.title}
                        </h3>
                        <div className="flex gap-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                          {article.publishedAt && <span>{format(article.publishedAt.toDate(), 'MMM d, yyyy')}</span>}
                          {article.readTime && <><span>·</span><span>{article.readTime}</span></>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
