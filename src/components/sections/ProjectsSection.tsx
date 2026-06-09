'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/firestore';

interface Props { projects: Project[]; }

const COLORS = ['#00e5ff', '#a855f7', '#f5a623', '#00d68f', '#ff4757', '#0ea5e9'];

export default function ProjectsSection({ projects }: Props) {
  const [filter, setFilter] = useState('All');

  if (!projects.length) return null;

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-12">
          <div>
            <div className="section-eyebrow">Portfolio</div>
            <h2 className="font-display font-black" style={{ fontSize: 'clamp(30px, 5vw, 52px)' }}>
              Featured <span className="grad-text">Projects</span>
            </h2>
          </div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className="btn text-xs px-4 py-2"
                style={{
                  background: filter === cat ? 'var(--accent)' : 'var(--surface)',
                  color: filter === cat ? '#000' : 'var(--text2)',
                  border: `1px solid ${filter === cat ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((proj, i) => {
              const color = COLORS[i % COLORS.length];
              return (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="card card-hover overflow-hidden flex flex-col"
                  style={{ borderRadius: 20 }}
                >
                  {/* Thumb */}
                  <div style={{
                    height: 190, position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${color}12, ${color}06)`,
                  }}>
                    {proj.coverImage ? (
                      <Image src={proj.coverImage} alt={proj.title} fill
                        style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display font-black"
                          style={{ fontSize: 72, color: `${color}40`, letterSpacing: '-4px' }}>
                          {proj.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="badge font-mono text-xs"
                        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                        {proj.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`badge ${proj.status === 'live' ? 'badge-green' : proj.status === 'draft' ? 'badge-gold' : 'badge-blue'}`}>
                        {proj.status === 'live' ? '● Live' : proj.status === 'draft' ? '◌ Draft' : '◎ Archived'}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-base mb-2 leading-snug">{proj.title}</h3>
                    <p className="text-sm mb-4 flex-1"
                      style={{ color: 'var(--text2)', lineHeight: 1.65, display: '-webkit-box',
                        WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tags.slice(0, 4).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      {proj.demoUrl && (
                        <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer"
                          className="btn flex-1 text-xs py-2"
                          style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                          Live Demo ↗
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="btn btn-outline text-xs py-2 px-3">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--text3)' }}>
            <div className="text-4xl mb-4">🚧</div>
            <p>No projects in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
