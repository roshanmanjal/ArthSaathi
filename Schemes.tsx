import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockSchemes } from '../data/mock';
import { Building2, Search, Sparkles, Loader2, ChevronRight, CheckCircle } from 'lucide-react';

const categories = ['All', 'Banking', 'Savings', 'Pension', 'Insurance', 'Loan', 'Agriculture'];
const tagColors: Record<string, string> = {
  Popular: 'badge-green', 'High Returns': 'badge-gold', Retirement: 'badge-blue',
  Business: 'badge-blue', Farmers: 'badge-green', 'Must Have': 'badge-red',
};

export default function Schemes() {
  const [selected, setSelected] = useState('All');
  const [profile, setProfile] = useState({ age: '', occupation: '', income: '' });
  const [aiSchemes, setAiSchemes] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = selected === 'All' ? mockSchemes : mockSchemes.filter(s => s.category === selected);

  async function findSchemes() {
    if (!profile.age || !profile.occupation) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `I am ${profile.age} years old, working as ${profile.occupation}, earning approximately ₹${profile.income || '25,000'}/month.

List the top 5 Indian government schemes I'm eligible for. For each scheme, give:
1. Scheme name
2. Key benefit (1 line with ₹ amounts)
3. How to apply (1 line)

Keep it very concise and actionable.`
          }],
        }),
      });
      const data = await res.json();
      setAiSchemes(data.content?.[0]?.text || '');
    } catch {
      setAiSchemes('Unable to fetch recommendations. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Government Schemes</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Find schemes you're eligible for · ₹1000s in free benefits waiting for you</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left */}
        <div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelected(c)}
                style={{
                  padding: '6px 16px', borderRadius: 99,
                  background: selected === c ? 'rgba(16,185,129,0.12)' : 'var(--surface-2)',
                  border: selected === c ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
                  color: selected === c ? '#10b981' : 'var(--text-muted)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  transition: 'all 0.15s',
                }}
              >{c}</button>
            ))}
          </div>

          {/* Scheme cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((scheme, i) => (
              <motion.div
                key={scheme.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card"
                style={{ padding: '18px 20px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>{scheme.name}</div>
                      <span className={`badge ${tagColors[scheme.tag] || 'badge-blue'}`}>{scheme.tag}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                      {scheme.benefit}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle size={12} color="#10b981" />
                      <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Eligibility: {scheme.eligibility}</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 12px', borderRadius: 99,
                    background: 'var(--surface-3)', border: '1px solid var(--border)',
                    fontSize: 11, color: 'var(--text-dim)',
                  }}>{scheme.category}</div>
                </div>

                <div style={{
                  marginTop: 12, paddingTop: 12,
                  borderTop: '1px solid var(--border)',
                  display: 'flex', gap: 10,
                }}>
                  <button style={{
                    flex: 1, padding: '8px',
                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 8, color: '#10b981', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                  }}>How to Apply</button>
                  <button style={{
                    flex: 1, padding: '8px',
                    background: 'var(--surface-3)', border: '1px solid var(--border)',
                    borderRadius: 8, color: 'var(--text-muted)', fontSize: 12,
                    cursor: 'pointer',
                  }}>Learn More</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: AI finder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sparkles size={16} color="#10b981" />
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600 }}>AI Scheme Finder</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              Tell us about yourself and we'll find schemes you're eligible for right now.
            </p>

            {[
              { label: 'Your Age', key: 'age', placeholder: 'e.g. 28' },
              { label: 'Occupation', key: 'occupation', placeholder: 'e.g. Farmer, Student, Salaried' },
              { label: 'Monthly Income (₹)', key: 'income', placeholder: 'e.g. 25000' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 5 }}>{label}</div>
                <input
                  value={profile[key as keyof typeof profile]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    width: '100%', padding: '9px 12px',
                    background: 'var(--surface-3)', border: '1px solid var(--border)',
                    borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>
            ))}

            <button
              onClick={findSchemes}
              disabled={!profile.age || !profile.occupation || loading}
              style={{
                width: '100%', padding: '11px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', borderRadius: 9,
                color: 'white', fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: !profile.age || !profile.occupation ? 0.6 : 1,
              }}
            >
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Finding...</> : 'Find My Schemes'}
            </button>

            {aiSchemes && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 16,
                  background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)',
                  borderRadius: 9, padding: '12px 14px',
                  fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text)',
                }}
              >{aiSchemes}</motion.div>
            )}
          </div>

          {/* Quick stat */}
          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Did you know?</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Over <strong style={{ color: '#f59e0b' }}>50 crore Indians</strong> are eligible for PMSBY — accident insurance for just ₹20/year — but most don't know about it.
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}