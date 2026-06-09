'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createContactRequest, subscribeNewsletter } from '@/lib/firestore';
import toast from 'react-hot-toast';

export function VisionSection() {
  const items = [
    { icon: '🌍', title: '10,000 Engineers Mentored', desc: 'Training the next generation of African tech leaders' },
    { icon: '📖', title: 'Open Source Everything', desc: 'Freely available tools for the African dev community' },
    { icon: '🎓', title: 'Free Cloud Academy', desc: 'Democratizing AWS and cloud education across Africa' },
    { icon: '🏗️', title: 'Build. Ship. Impact.', desc: 'Systems that outlive us and serve millions' },
  ];

  return (
    <section className="section" style={{ background: 'var(--bg2)', overflow: 'hidden' }}>
      <div className="container">
        <div className="text-center mb-14">
          <div className="section-eyebrow justify-center">Vision</div>
          <h2 className="font-display font-black" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            The <span className="grad-text">Bigger Mission</span>
          </h2>
          <p className="mx-auto mt-4 text-base" style={{ color: 'var(--text2)', maxWidth: 500 }}>
            Building is just the beginning. The real mission is transforming the African tech ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.div key={item.title}
              className="card p-7 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}>
              <div className="text-4xl mb-5">{item.icon}</div>
              <h3 className="font-display font-bold text-sm mb-2 leading-snug">{item.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text2)', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', type: 'project', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await createContactRequest(form);
      toast.success('Message sent! I'll get back to you within 24 hours.');
      setForm({ name: '', email: '', type: 'project', message: '' });
    } catch {
      toast.error('Failed to send. Please try emailing me directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}>
            <div className="section-eyebrow">Get In Touch</div>
            <h2 className="font-display font-black mb-5" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              Let&apos;s Build<br /><span className="grad-text">Something Great</span>
            </h2>
            <p className="mb-8 text-base" style={{ color: 'var(--text2)', lineHeight: 1.8, maxWidth: 420 }}>
              Whether you need a cloud architect, a full stack engineer, a technical mentor,
              or want to talk about the future of African tech — I&apos;m here.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { icon: '✉', label: 'Email', value: 'ogundimuolalekan55@gmail.com', href: 'mailto:ogundimuolalekan55@gmail.com' },
                { icon: '☎', label: 'Phone', value: '+234 812 942 4016', href: 'tel:08129424016' },
                { icon: 'in', label: 'LinkedIn', value: 'linkedin.com/in/olalekanogundimu', href: 'https://www.linkedin.com/in/olalekanogundimu' },
                { icon: '📸', label: 'Instagram', value: '@mr_sams01', href: 'https://www.instagram.com/mr_sams01' },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-4 card-hover text-sm"
                  style={{ textDecoration: 'none', color: 'var(--text)' }}>
                  <span className="font-mono font-bold w-6 text-center" style={{ color: 'var(--accent)' }}>{c.icon}</span>
                  <div>
                    <div className="font-mono text-xs mb-0.5" style={{ color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{c.label}</div>
                    <div className="font-medium text-sm">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}>
            <form onSubmit={handleSubmit}
              className="card p-8 flex flex-col gap-5"
              style={{ borderRadius: 20 }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Your Name</label>
                  <input className="input" placeholder="Adaeze Johnson"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input className="input" type="email" placeholder="you@company.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="input-label">Enquiry Type</label>
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="project">Project Collaboration</option>
                  <option value="consulting">Cloud Consulting</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="speaking">Speaking / Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="input-label">Message</label>
                <textarea className="input" placeholder="Tell me about your project, idea, or challenge..."
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary justify-center py-3 text-sm">
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setDone(true);
      toast.success('Welcome to the newsletter!');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-sm" style={{ background: 'var(--bg3)' }}>
      <div className="container">
        <div className="card p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.04), rgba(168,85,247,0.04))',
            borderColor: 'rgba(0,229,255,0.12)',
            borderRadius: 24,
          }}>
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
          </div>
          <div className="relative z-10">
            <div className="section-eyebrow justify-center mb-3">Newsletter</div>
            <h2 className="font-display font-black mb-4" style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}>
              Stay Ahead of the <span className="grad-text">Curve</span>
            </h2>
            <p className="text-base mb-8 mx-auto" style={{ color: 'var(--text2)', maxWidth: 440 }}>
              Weekly insights on cloud architecture, full stack engineering, and career growth.
            </p>
            {done ? (
              <p className="font-semibold text-base" style={{ color: 'var(--green)' }}>
                ✅ You&apos;re subscribed! Welcome aboard.
              </p>
            ) : (
              <form onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input className="input flex-1" type="email" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Subscribing...' : 'Subscribe →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
