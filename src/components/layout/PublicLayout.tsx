'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/#about',       label: 'About' },
  { href: '/#skills',      label: 'Skills' },
  { href: '/#projects',    label: 'Projects' },
  { href: '/blog',         label: 'Blog' },
  { href: '/mentorship',   label: 'Mentorship' },
  { href: '/#contact',     label: 'Contact' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [theme, setTheme]         = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (stored) { setTheme(stored); applyTheme(stored); }
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function applyTheme(t: 'dark' | 'light') {
    document.documentElement.classList.toggle('light', t === 'light');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  return (
    <>
      {/* NAV */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${
          scrolled ? 'border-b' : ''
        }`}
        style={{
          background: scrolled ? 'rgba(8,12,16,0.88)' : 'transparent',
          borderColor: 'var(--border)',
        }}
      >
        <nav className="container-lg flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display font-black text-xl grad-text" style={{ letterSpacing: '-1px' }}>
            OO.
          </Link>

          {/* Desktop links */}
          <ul className="hide-mobile flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs px-3 py-2 rounded-lg transition-all"
                  style={{
                    color: pathname === link.href ? 'var(--accent)' : 'var(--text2)',
                    background: pathname === link.href ? 'rgba(0,229,255,0.06)' : 'transparent',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Theme */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme}
              className="btn btn-ghost p-2 rounded-lg text-base"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link href="/schedule" className="hide-mobile btn btn-primary text-xs">
              Book a Call
            </Link>
            {/* Mobile menu btn */}
            <button
              className="show-mobile p-2 rounded-lg"
              style={{ color: 'var(--text)' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="show-mobile fixed inset-0 z-40 flex flex-col pt-20 px-6 gap-3"
            style={{ background: 'var(--bg)' }}
          >
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display font-bold text-2xl py-4 border-b"
                style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/schedule" onClick={() => setMenuOpen(false)}
              className="btn btn-primary mt-4 text-center justify-center">
              Book a Call
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="font-display font-black text-2xl grad-text mb-3" style={{letterSpacing: '-1px'}}>OO.</div>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
                Full Stack Engineer & AWS Cloud Architect, based in Lagos, Nigeria.
                Building the future of African technology.
              </p>
              <div className="flex gap-3 mt-5">
                {[
                  { label: 'GitHub', href: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || ''}` },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/olalekanogundimu' },
                  { label: 'Instagram', href: 'https://www.instagram.com/mr_sams01' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline text-xs px-3 py-2">{s.label}
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Work', links: [
                { label: 'Projects', href: '/#projects' },
                { label: 'GitHub', href: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || ''}` },
              ]},
              { title: 'Learn & Connect', links: [
                { label: 'Blog', href: '/blog' },
                { label: 'Mentorship', href: '/mentorship' },
                { label: 'Schedule a Call', href: '/schedule' },
                { label: 'Contact', href: '/#contact' },
              ]},
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-display font-bold text-sm mb-4">{col.title}</h4>
                <ul className="flex flex-col gap-2">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href}
                        style={{ color: 'var(--text3)', fontSize: 13 }}
                        className="hover:text-accent transition-colors">{l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8"
            style={{ borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>
              © {new Date().getFullYear()} Olalekan Ogundimu. All rights reserved.
            </span>
            <span className="font-mono" style={{ color: 'var(--text3)', fontSize: 11 }}>
              Lagos, Nigeria 🇳🇬
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
