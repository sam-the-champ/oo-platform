'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  RiDashboardLine, RiFolderLine, RiArticleLine, RiUserStarLine,
  RiContactsLine, RiGroupLine, RiImageLine, RiMailLine,
  RiBarChartLine, RiSettingsLine, RiLogoutCircleLine, RiExternalLinkLine,
  RiAwardLine, RiStarLine, RiToolsLine,
} from 'react-icons/ri';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: RiDashboardLine, exact: true },
      { href: '/admin/analytics', label: 'Analytics', icon: RiBarChartLine },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/projects', label: 'Projects', icon: RiFolderLine },
      { href: '/admin/articles', label: 'Articles', icon: RiArticleLine },
      { href: '/admin/media', label: 'Media Library', icon: RiImageLine },
    ],
  },
  {
    label: 'Profile Data',
    items: [
      { href: '/admin/skills', label: 'Skills', icon: RiToolsLine },
      { href: '/admin/certifications', label: 'Certifications', icon: RiAwardLine },
      { href: '/admin/testimonials', label: 'Testimonials', icon: RiStarLine },
    ],
  },
  {
    label: 'Audience',
    items: [
      { href: '/admin/contact-requests', label: 'Contact Requests', icon: RiContactsLine },
      { href: '/admin/mentorship', label: 'Mentorship Apps', icon: RiUserStarLine },
      { href: '/admin/newsletter', label: 'Newsletter', icon: RiMailLine },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Site Settings', icon: RiSettingsLine },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '2px solid var(--border)',
            borderTop: '2px solid var(--accent)',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span className="font-mono text-xs" style={{ color: 'var(--text3)' }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;
  if (!user || !isAdmin) return null;

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar flex flex-col" style={{ padding: '20px 12px' }}>
        {/* Brand */}
        <div className="px-3 mb-6">
          <div className="font-display font-black text-xl grad-text mb-0.5" style={{ letterSpacing: '-1px' }}>OO.</div>
          <div className="font-mono text-xs" style={{ color: 'var(--text3)' }}>Admin Dashboard</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="mb-4">
              <div className="font-mono text-xs px-3 mb-1.5" style={{ color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {section.label}
              </div>
              {section.items.map(item => (
                <Link key={item.href} href={item.href}
                  className={`admin-nav-item ${isActive(item.href, item.exact) ? 'active' : ''}`}>
                  <item.icon size={15} />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t pt-3 mt-2" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" target="_blank"
            className="admin-nav-item mb-1">
            <RiExternalLinkLine size={15} /> View Site
          </Link>
          <button onClick={() => signOut().then(() => router.push('/admin/login'))}
            className="admin-nav-item w-full"
            style={{ color: 'var(--red)' }}>
            <RiLogoutCircleLine size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 h-14"
          style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
          <div className="font-mono text-xs" style={{ color: 'var(--text3)' }}>
            {pathname.replace('/admin', '').replace('/', ' / ') || ' / overview'}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', color: '#000' }}>
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <span className="font-mono text-xs hide-mobile" style={{ color: 'var(--text3)' }}>
              {user?.email}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', maxWidth: 1200 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
