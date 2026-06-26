import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Brain, Zap, ChevronRight, Star, ArrowRight } from 'lucide-react';

const features = [
  { icon: Brain, label: 'AI Financial Coach', desc: 'Like having a CFP in your pocket 24/7', color: '#10b981' },
  { icon: ShieldCheck, label: 'Scam Shield', desc: 'Detects fraud before you lose money', color: '#3b82f6' },
  { icon: TrendingUp, label: 'Health Score', desc: 'Your complete financial fitness report', color: '#f59e0b' },
  { icon: Zap, label: 'Goal Planner', desc: 'Dream to plan in 60 seconds flat', color: '#8b5cf6' },
];

const personas = ['College Student', 'Salaried Employee', 'Gig Worker', 'Small Business Owner', 'Senior Citizen', 'Farmer'];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', overflow: 'hidden' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', padding: '18px 48px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span className="font-display" style={{ fontSize: 20, fontWeight: 700 }}>ArthSaathi</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '9px 22px', borderRadius: 10,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              color: 'var(--text)', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            }}
          >Sign in</button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '9px 22px', borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', color: 'white',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            }}
          >Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '96px 48px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          {/* Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 99, padding: '5px 14px', marginBottom: 28,
          }}>
            <Star size={12} color="#10b981" fill="#10b981" />
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 500 }}>India's first AI Financial Guardian</span>
          </div>

          <h1 className="font-display" style={{
            fontSize: 'clamp(42px, 6vw, 76px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 22,
          }}>
            Stop Googling<br />
            <span className="text-gradient">Your Finances.</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text-muted)',
            maxWidth: 520, margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            ArthSaathi combines AI coaching, scam detection, budget tracking, and goal planning — built for real Indians, not just investors.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '14px 32px', borderRadius: 12,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', color: 'white',
                cursor: 'pointer', fontSize: 16, fontWeight: 600,
                boxShadow: '0 0 30px rgba(16,185,129,0.35)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              Open Dashboard <ArrowRight size={18} />
            </motion.button>
            <button
              style={{
                padding: '14px 28px', borderRadius: 12,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                color: 'var(--text)', cursor: 'pointer', fontSize: 15, fontWeight: 500,
              }}
            >Watch Demo</button>
          </div>
        </motion.div>

        {/* Personas strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex', gap: 8, justifyContent: 'center',
            flexWrap: 'wrap', marginTop: 44,
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--text-dim)', alignSelf: 'center', marginRight: 4 }}>Built for:</span>
          {personas.map(p => (
            <span key={p} style={{
              padding: '4px 12px', borderRadius: 99,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              fontSize: 12, color: 'var(--text-muted)', fontWeight: 500,
            }}>{p}</span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            One app. Everything financial.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>
            No more switching between 5 apps to manage your money.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {features.map(({ icon: Icon, label, desc, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: 24 }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: `${color}18`,
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon size={22} color={color} />
              </div>
              <div className="font-display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '60px 48px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))',
            border: '1px solid rgba(16,185,129,0.15)',
            borderRadius: 24, padding: '48px',
            textAlign: 'center',
          }}
        >
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            Your financial health score is waiting.
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 16 }}>
            Takes 2 minutes. No credit card. No bank login required.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '14px 36px', borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', color: 'white',
              cursor: 'pointer', fontSize: 16, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 0 30px rgba(16,185,129,0.3)',
            }}
          >
            Get My Score Free <ChevronRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={16} color="#10b981" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>ArthSaathi AI</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
          Built with ❤️ for India · Hackathon 2025
        </span>
      </footer>
    </div>
  );
}