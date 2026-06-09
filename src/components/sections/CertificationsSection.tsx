'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Certification } from '@/lib/firestore';

interface Props { certifications: Certification[]; }

export default function CertificationsSection({ certifications }: Props) {
  if (!certifications.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="mb-12">
          <div className="section-eyebrow">Credentials</div>
          <h2 className="font-display font-black" style={{ fontSize: 'clamp(30px, 5vw, 52px)' }}>
            Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              className="card card-hover p-6"
              style={{
                background: `linear-gradient(135deg, var(--surface) 0%, ${cert.color}08 100%)`,
                borderColor: `${cert.color}18`,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Logo or initials */}
              <div className="mb-5 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: `${cert.color}12`, border: `1px solid ${cert.color}25` }}>
                {cert.imageUrl ? (
                  <Image src={cert.imageUrl} alt={cert.issuer} width={40} height={40}
                    style={{ objectFit: 'contain' }} />
                ) : (
                  <span className="font-display font-black text-lg" style={{ color: cert.color }}>
                    {cert.issuer.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="font-mono text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: cert.color }}>
                {cert.level}
              </div>
              <h3 className="font-display font-bold text-sm mb-1 leading-snug">{cert.name}</h3>
              <p style={{ color: 'var(--text3)', fontSize: 12 }}>{cert.issuer}</p>

              <div className="flex items-center justify-between mt-4 pt-4"
                style={{ borderTop: `1px solid ${cert.color}15` }}>
                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: cert.color }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: cert.color, animation: 'pulse-slow 2s infinite',
                  }} />
                  Verified {cert.year}
                </div>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-xs"
                    style={{ color: 'var(--text3)' }}>
                    View ↗
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
