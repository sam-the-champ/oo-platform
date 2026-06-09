'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ProfileData } from '@/lib/firestore';

export default function AboutSection({ profile }: { profile: ProfileData | null }) {
  return (
    <section id="about" className="section" style={{ background: 'var(--bg2)' }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-eyebrow">About Me</div>
            <h2 className="font-display font-black mb-5" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>
              Engineering the<br /><span className="grad-text">Future of Africa</span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.85, marginBottom: 20 }}>
              {profile?.bio ?? "I'm a Full Stack Software Engineer and AWS Cloud Architect with deep expertise in building systems that scale. From Lagos to the global stage, I've architected platforms serving hundreds of thousands of users."}
            </p>
            <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.85, marginBottom: 32 }}>
              My work sits at the intersection of elegant code and robust infrastructure — I believe great software is both an art and an engineering discipline.
            </p>

            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline">
                Download CV ↓
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Contact info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Email', value: profile?.email ?? 'ogundimuolalekan55@gmail.com', icon: '✉', href: `mailto:${profile?.email ?? ''}` },
                { label: 'Phone', value: profile?.phone ?? '+234 812 942 4016', icon: '☎', href: `tel:${profile?.phone ?? ''}` },
                { label: 'Location', value: profile?.location ?? 'Lagos, Nigeria', icon: '📍', href: '#' },
                { label: 'LinkedIn', value: 'olalekanogundimu', icon: 'in', href: profile?.linkedinUrl ?? '#' },
              ].map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 card-hover text-sm no-underline"
                  style={{ textDecoration: 'none', color: 'var(--text)' }}>
                  <span className="font-mono text-base" style={{ color: 'var(--accent)', minWidth: 24 }}>{item.icon}</span>
                  <div>
                    <div className="font-mono text-xs mb-1" style={{ color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</div>
                    <div className="font-medium text-sm">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
