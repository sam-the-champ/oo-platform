import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { getArticleBySlug, incrementArticleViews } from '@/lib/firestore';
import { format } from 'date-fns';

interface Props { params: { slug: string }; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article || article.status !== 'published') notFound();

  // Increment view count (fire and forget)
  if (article.id) {
    incrementArticleViews(article.id).catch(() => {});
  }

  return (
    <PublicLayout>
      <div style={{ paddingTop: 80 }}>
        {/* Hero */}
        <section className="section-sm grid-bg" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container max-w-3xl mx-auto">
            <Link href="/blog" className="font-mono text-xs mb-6 flex items-center gap-2"
              style={{ color: 'var(--text3)', textDecoration: 'none' }}>
              ← Back to Blog
            </Link>

            {/* Category */}
            <div className="mb-4">
              <span className="badge badge-blue">{article.category}</span>
            </div>

            <h1 className="font-display font-black mb-5 leading-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-base mb-6" style={{ color: 'var(--text2)', lineHeight: 1.75 }}>
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs" style={{ color: 'var(--text3)' }}>
              {article.publishedAt && (
                <span>{format(article.publishedAt.toDate(), 'MMMM d, yyyy')}</span>
              )}
              {article.readTime && <><span>·</span><span>{article.readTime} read</span></>}
              {article.views > 0 && <><span>·</span><span>{article.views.toLocaleString()} views</span></>}
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {article.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </div>
        </section>

        {/* Cover image */}
        {article.coverImage && (
          <div className="relative w-full" style={{ height: 400, maxWidth: 900, margin: '0 auto' }}>
            <Image src={article.coverImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
          </div>
        )}

        {/* Content */}
        <section className="section">
          <div className="container max-w-3xl mx-auto">
            <div
              className="prose-content"
              style={{
                color: 'var(--text2)',
                lineHeight: 1.85,
                fontSize: 16,
              }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
