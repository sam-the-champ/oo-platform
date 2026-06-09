import { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: 'Schedule a Call',
  description: 'Book a 30-minute call with Olalekan to discuss your project, consulting needs, or mentorship.',
};

export default function SchedulePage() {
  return (
    <PublicLayout>
      <div style={{ paddingTop: 80 }}>
        <section className="section-sm grid-bg" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="section-eyebrow">Schedule</div>
            <h1 className="font-display font-black mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Book a <span className="grad-text">30-Min Call</span>
            </h1>
            <p className="text-base" style={{ color: 'var(--text2)', maxWidth: 480, lineHeight: 1.75 }}>
              Let&apos;s talk about your project, cloud challenges, mentorship goals, or anything tech.
              No sales pitch — just a real conversation.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Info */}
              <div className="flex flex-col gap-6">
                {[
                  { icon: '⏱', title: '30 Minutes', desc: 'Focused, no-fluff conversation' },
                  { icon: '🎥', title: 'Google Meet / Zoom', desc: 'Your choice of platform' },
                  { icon: '🌍', title: 'Any Timezone', desc: 'WAT, GMT, EST — I work async' },
                ].map(item => (
                  <div key={item.title} className="card p-5 flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-display font-bold text-sm mb-1">{item.title}</div>
                      <div className="text-xs" style={{ color: 'var(--text3)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}

                <div className="card p-5">
                  <div className="font-mono text-xs mb-3" style={{ color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                    What we can cover
                  </div>
                  {[
                    'Cloud architecture review',
                    'Tech stack consultation',
                    'Career / mentorship chat',
                    'Project scoping',
                    'System design session',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm py-1.5" style={{ color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--accent)' }}>→</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendly embed placeholder */}
              <div className="lg:col-span-2 card p-8 flex flex-col items-center justify-center text-center"
                style={{ minHeight: 500 }}>
                <div className="text-5xl mb-5">📅</div>
                <h3 className="font-display font-bold text-lg mb-3">Calendly Integration</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text2)', maxWidth: 340, lineHeight: 1.65 }}>
                  To enable real-time booking, add your Calendly URL in the admin settings.
                  The scheduling widget will appear here automatically.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="mailto:ogundimuolalekan55@gmail.com?subject=Booking a Call"
                    className="btn btn-primary">
                    Email to Book →
                  </a>
                  <a href="https://www.linkedin.com/in/olalekanogundimu"
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline">
                    Message on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
