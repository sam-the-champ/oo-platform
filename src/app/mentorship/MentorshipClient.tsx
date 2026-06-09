'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createMentorshipApplication } from '@/lib/firestore';
import toast from 'react-hot-toast';

const PLANS = [
  {
    name: 'Starter', price: '$199', period: '/month', color: '#00e5ff',
    features: ['2× 1-hr sessions/month', 'Code reviews (up to 3)', 'Career guidance', 'Discord community access'],
  },
  {
    name: 'Growth', price: '$399', period: '/month', color: '#a855f7', featured: true,
    features: ['4× 1-hr sessions/month', 'Unlimited code reviews', 'Live project collaboration', 'Job referrals', 'Priority Slack DM'],
  },
  {
    name: 'Elite', price: '$799', period: '/month', color: '#f5a623',
    features: ['Weekly 1-hr sessions', 'Hands-on project builds', 'System design coaching', 'Interview prep', 'Direct network access'],
  },
];

export default function MentorshipClient() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [form, setForm] = useState({ name: '', email: '', background: '', goals: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !form.name || !form.email || !form.goals) {
      toast.error('Please fill in all fields and select a plan.');
      return;
    }
    setLoading(true);
    try {
      await createMentorshipApplication({ ...form, plan: selectedPlan });
      setSubmitted(true);
      toast.success('Application submitted! I\'ll review and reach out within 48 hours.');
    } catch {
      toast.error('Failed to submit. Please email me directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <section className="section-sm grid-bg" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <div className="section-eyebrow justify-center">Mentorship Hub</div>
          <h1 className="font-display font-black mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Accelerate Your <span className="grad-text">Engineering Career</span>
          </h1>
          <p className="text-base mx-auto" style={{ color: 'var(--text2)', maxWidth: 520, lineHeight: 1.75 }}>
            Join engineers I&apos;ve mentored to senior roles at Flutterwave, Andela, Microsoft, and funded startups. My approach is direct, practical, and results-driven.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="section">
        <div className="container">
          <h2 className="font-display font-black text-center mb-12" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            {PLANS.map((plan) => (
              <motion.div key={plan.name}
                className="card p-7 relative cursor-pointer"
                style={{
                  borderColor: selectedPlan === plan.name ? plan.color : plan.featured ? `${plan.color}30` : 'var(--border)',
                  background: plan.featured ? `linear-gradient(135deg, ${plan.color}08, var(--surface))` : 'var(--surface)',
                  transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: selectedPlan === plan.name ? `0 0 0 2px ${plan.color}` : plan.featured ? `0 20px 60px ${plan.color}15` : 'none',
                  transition: 'all 0.25s',
                }}
                onClick={() => setSelectedPlan(plan.name)}
                whileHover={{ y: -4 }}>
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: plan.color, color: '#000', whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                {selectedPlan === plan.name && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: plan.color, color: '#000' }}>✓</div>
                )}
                <div className="font-mono text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: plan.color }}>
                  {plan.name}
                </div>
                <div className="mb-5">
                  <span className="font-display font-black" style={{ fontSize: 38, color: plan.color }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--text3)' }}>{plan.period}</span>
                </div>
                <ul className="flex flex-col gap-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text2)' }}>
                      <span style={{ color: plan.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn w-full justify-center text-sm"
                  style={{
                    background: selectedPlan === plan.name ? plan.color : 'transparent',
                    border: `1px solid ${plan.color}`,
                    color: selectedPlan === plan.name ? '#000' : plan.color,
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.name); document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  {selectedPlan === plan.name ? '✓ Selected' : 'Select Plan'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Application form */}
          <div id="apply-form" className="max-w-2xl mx-auto">
            <h2 className="font-display font-black text-center mb-8" style={{ fontSize: 'clamp(22px, 3vw, 34px)' }}>
              Apply for Mentorship
            </h2>
            {submitted ? (
              <div className="card p-12 text-center" style={{ borderColor: 'rgba(0,214,143,0.3)' }}>
                <div className="text-5xl mb-5">✅</div>
                <h3 className="font-display font-bold text-xl mb-3">Application Received!</h3>
                <p style={{ color: 'var(--text2)', fontSize: 15 }}>
                  I review every application personally. Expect a response within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="card p-8 flex flex-col gap-5">
                {selectedPlan && (
                  <div className="p-3 rounded-lg text-sm font-semibold text-center"
                    style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)', color: 'var(--accent)' }}>
                    Selected: {selectedPlan} Plan
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input className="input" placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="input-label">Email *</label>
                    <input className="input" type="email" placeholder="you@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Your Background</label>
                  <textarea className="input" style={{ minHeight: 100 }}
                    placeholder="Current role, years of experience, tech stack..."
                    value={form.background} onChange={e => setForm({ ...form, background: e.target.value })} />
                </div>
                <div>
                  <label className="input-label">What do you want to achieve? *</label>
                  <textarea className="input" style={{ minHeight: 100 }}
                    placeholder="Be specific: land a senior role, pass system design interviews, build a startup MVP..."
                    value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })} />
                </div>
                {!selectedPlan && (
                  <div className="text-sm text-center" style={{ color: 'var(--gold)' }}>
                    ↑ Please select a plan above
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn btn-primary justify-center py-3">
                  {loading ? 'Submitting...' : 'Submit Application →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
