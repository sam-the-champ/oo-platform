'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ProfileData } from '@/lib/firestore';

function TypewriterText({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing');

  useEffect(() => {
    const current = texts[idx] || '';
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 65);
      } else {
        timeout = setTimeout(() => setPhase('pause'), 2200);
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => setPhase('erasing'), 100);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
      } else {
        setIdx((idx + 1) % texts.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, idx, texts]);

  return (
    <span style={{ color: 'var(--accent)' }}>
      {displayed}
      <span style={{ animation: 'blink 1s step-end infinite', borderRight: '2px solid var(--accent)', marginLeft: 2 }}>
        &nbsp;
      </span>
    </span>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(target * ease);
      setCount(start);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

interface Props { profile: ProfileData | null; }

export default function HeroSection({ profile }: Props) {
  const roles = [
    'Full Stack Engineer',
    'AWS Cloud Architect',
    'Technical Mentor',
    'Open Source Builder',
    'Engineering Leader',
  ];

  const stats = [
    { label: 'Years Exp.', value: profile?.yearsExp ?? 0, suffix: '+' },
    { label: 'Projects', value: profile?.projectsCount ?? 0, suffix: '+' },
    { label: 'Mentored', value: profile?.mentoredCount ?? 0, suffix: '+' },
  ];

  return (
    <section
      id="hero"
      className="grid-bg relative min-h-screen flex items-center"
      style={{ paddingTop: 80 }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{
          top: '15%', left: '-8%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div className="absolute" style={{
          bottom: '10%', right: '-5%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div className="container relative z-10 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Status badge */}
            <div className="flex items-center gap-3 mb-7">
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: profile?.availableForWork ? 'var(--green)' : 'var(--text3)',
                boxShadow: profile?.availableForWork ? '0 0 10px var(--green)' : 'none',
                animation: profile?.availableForWork ? 'pulse-slow 2s infinite' : 'none',
              }} />
              <span className="font-mono text-xs" style={{ color: 'var(--text2)' }}>
                {profile?.availableForWork
                  ? 'Available for consulting'
                  : 'Currently unavailable'
                } · {profile?.location ?? 'Lagos, Nigeria 🇳🇬'}
              </span>
            </div>

            <h1 className="font-display font-black mb-4"
              style={{ fontSize: 'clamp(42px, 6vw, 76px)', letterSpacing: '-2.5px', lineHeight: 1.06 }}>
              {profile?.name ?? 'Olalekan'}<br />
              <span className="grad-text">
                {(profile?.name ?? 'Olalekan Ogundimu').split(' ').slice(1).join(' ') || 'Ogundimu'}
              </span>
            </h1>

            <div className="font-display font-semibold mb-5"
              style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', color: 'var(--text2)', minHeight: 42 }}>
              <TypewriterText texts={roles} />
            </div>

            <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.85, marginBottom: 36, maxWidth: 520 }}>
              {profile?.bio ?? 'Building resilient, scalable systems that power the future of African tech. I architect cloud solutions, ship production-grade software, and mentor the next generation of engineers.'}
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/#projects" className="btn btn-primary">
                View My Work →
              </Link>
              <Link href="/schedule" className="btn btn-outline">
                Book a Call
              </Link>
              <a href="https://www.linkedin.com/in/olalekanogundimu" target="_blank"
                rel="noopener noreferrer"
                className="btn text-xs"
                style={{
                  background: 'rgba(0,119,181,0.1)',
                  border: '1px solid rgba(0,119,181,0.3)',
                  color: '#0a66c2',
                }}>
                <span className="font-bold">in</span> LinkedIn
              </a>
            </div>

            {/* Stats */}
            {stats[0].value > 0 && (
              <div className="flex gap-10 flex-wrap">
                {stats.map(s => (
                  <div key={s.label}>
                    <div className="font-display font-black"
                      style={{
                        fontSize: 'clamp(28px, 3.5vw, 42px)',
                        background: 'linear-gradient(135deg, #00e5ff, #a855f7)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1,
                      }}>
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="font-mono text-xs mt-1" style={{ color: 'var(--text3)', letterSpacing: '1px' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT – Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="hide-mobile flex justify-center relative"
            style={{ animation: 'float 5s ease-in-out infinite' }}
          >
            <div className="avatar-ring" style={{ borderRadius: '50%' }}>
              <div style={{
                width: 300, height: 300, borderRadius: '50%',
                overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, var(--surface), var(--bg2))',
              }}>
                {profile?.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt={profile.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0d1f35, #080c14)' }}>
                    <span className="font-display font-black grad-text" style={{ fontSize: 80, lineHeight: 1 }}>
                      OO
                    </span>
                    <span className="font-mono text-xs mt-2" style={{ color: 'var(--text3)' }}>
                      @mr_sams01
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Floating chips */}
            {[
              { label: 'AWS Certified', color: '#f5a623', top: 10,  right: -24 },
              { label: `${profile?.yearsExp ?? 4}+ Years`, color: '#00e5ff', bottom: 60, left: -30 },
              { label: 'Lagos, NG 🇳🇬', color: '#a855f7', bottom: -8, right: 0 },
            ].map(chip => (
              <div key={chip.label} style={{
                position: 'absolute', top: chip.top, right: chip.right,
                bottom: chip.bottom, left: chip.left,
                background: 'var(--surface)',
                border: `1px solid ${chip.color}35`,
                borderRadius: 100, padding: '7px 16px',
                fontSize: 12, fontWeight: 600, color: chip.color,
                fontFamily: 'var(--font-jetbrains)',
                boxShadow: `0 4px 18px ${chip.color}18`,
                whiteSpace: 'nowrap',
              }}>
                ● {chip.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--text3)' }}>
        <span className="font-mono text-xs" style={{ letterSpacing: '2px' }}>SCROLL</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, var(--accent), transparent)',
          animation: 'fadeIn 2s ease-in-out infinite alternate',
        }} />
      </div>
    </section>
  );
}
