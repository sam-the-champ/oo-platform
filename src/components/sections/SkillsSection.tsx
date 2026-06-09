'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '@/lib/firestore';

interface Props { skills: Skill[]; }

const CATEGORIES_COLORS: Record<string, string> = {
  Frontend: '#00e5ff',
  Backend: '#a855f7',
  'AWS Cloud': '#f5a623',
  DevOps: '#00d68f',
  Database: '#ff4757',
  Mobile: '#0ea5e9',
  Other: '#8899aa',
};

export default function SkillsSection({ skills }: Props) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(true); },
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (!skills.length) return null;

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg2)' }} ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <div className="section-eyebrow justify-center">Technical Arsenal</div>
          <h2 className="font-display font-black" style={{ fontSize: 'clamp(30px, 5vw, 52px)' }}>
            Skills &amp; <span className="grad-text">Expertise</span>
          </h2>
        </div>

        {/* Skill groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {Object.entries(grouped).map(([category, items], gi) => {
            const color = CATEGORIES_COLORS[category] || 'var(--accent)';
            return (
              <motion.div
                key={category}
                className="card p-7"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.08 }}
              >
                <div className="font-mono text-xs font-semibold mb-6 uppercase tracking-widest"
                  style={{ color }}>
                  {category}
                </div>
                <div className="flex flex-col gap-5">
                  {items.map(skill => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="font-mono text-xs" style={{ color }}>{skill.level}%</span>
                      </div>
                      <div className="skill-track">
                        <div
                          className="skill-fill"
                          style={{
                            width: animated ? `${skill.level}%` : '0%',
                            background: `linear-gradient(90deg, ${color}88, ${color})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* All technologies pill cloud */}
        <div className="text-center">
          <div className="font-mono text-xs mb-5" style={{ color: 'var(--text3)', letterSpacing: '2px' }}>
            // TECHNOLOGIES
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map(s => (
              <motion.div
                key={s.id}
                whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
                className="text-sm font-medium px-3 py-2 rounded-lg cursor-default"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                  transition: 'all 0.2s',
                }}
              >
                {s.name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
