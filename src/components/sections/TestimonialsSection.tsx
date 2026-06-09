'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Testimonial } from '@/lib/firestore';

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="section" style={{ background: 'var(--bg2)' }}>
      <div className="container">
        <div className="text-center mb-14">
          <div className="section-eyebrow justify-center">Social Proof</div>
          <h2 className="font-display font-black" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            What People <span className="grad-text">Say</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} className="card p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
              {/* Big quote mark */}
              <div className="absolute top-3 left-5 font-serif select-none"
                style={{ fontSize: 100, lineHeight: 1, color: 'var(--accent)', opacity: 0.08 }}>
                "
              </div>
              <div className="relative z-10">
                <p className="mb-6 leading-relaxed" style={{ color: 'var(--text2)', fontSize: 15 }}>
                  {t.text}
                </p>
                <div className="flex items-center gap-4">
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: `hsl(${i * 65 + 180}, 55%, 12%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid hsl(${i * 65 + 180}, 40%, 22%)`,
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    {t.avatarUrl ? (
                      <Image src={t.avatarUrl} alt={t.name} width={46} height={46}
                        style={{ objectFit: 'cover' }} />
                    ) : (
                      <span className="font-display font-bold text-sm"
                        style={{ color: `hsl(${i * 65 + 180}, 65%, 55%)` }}>
                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm">{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text3)' }}>
                      {t.role}{t.company ? `, ${t.company}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
