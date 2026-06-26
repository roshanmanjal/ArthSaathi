import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockGoals } from '../data/mock';
import { Plus, Target, Calendar, TrendingUp, X, Sparkles, Loader2 } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState(mockGoals);
  const [showAdd, setShowAdd] = useState(false);
  const [aiPlan, setAiPlan] = useState<Record<number, string>>({});
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', target: '', deadline: '', emoji: '🎯' });

  const emojis = ['🎯', '🏠', '🚗', '💻', '✈️', '📚', '💍', '🏖️', '🛡️', '💰'];

  async function getAIPlan(goal: typeof mockGoals[0]) {
    setLoadingPlan(goal.id);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `I want to achieve: "${goal.name}" costing ₹${goal.target.toLocaleString('en-IN')}. I've saved ₹${goal.saved.toLocaleString('en-IN')} so far. Target deadline: ${goal.deadline}. I earn ₹42,000/month.

Give me a concise 3-step action plan to reach this goal. Include specific amounts, specific Indian investment options (like RD, FD, liquid mutual funds), and one motivational line. Keep it under 120 words.`
          }],
        }),
      });
      const data = await res.json();
      setAiPlan(prev => ({ ...prev, [goal.id]: data.content?.[0]?.text || '' }));
    } catch {
      setAiPlan(prev => ({ ...prev, [goal.id]: `• Save ₹${goal.monthlyNeeded.toLocaleString('en-IN')}/month via auto-debit RD.\n• Invest in liquid mutual funds for better returns than savings account.\n• Review progress monthly — you're ${Math.round((goal.saved / goal.target) * 100)}% there!` }));
    } finally {
      setLoadingPlan(null);
    }
  }

  function addGoal() {
    if (!form.name || !form.target) return;
    setGoals(prev => [...prev, {
      id: Date.now(),
      name: form.name,
      target: parseInt(form.target),
      saved: 0,
      emoji: form.emoji,
      deadline: form.deadline || 'Dec 2025',
      monthlyNeeded: Math.round(parseInt(form.target) / 12),
    }]);
    setForm({ name: '', target: '', deadline: '', emoji: '🎯' });
    setShowAdd(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Goal Planner</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Track your financial goals · AI creates your savings plan</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none', color: 'white',
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
          }}
        ><Plus size={16} /> Add Goal</button>
      </div>

      {/* Goals grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {goals.map(goal => {
          const pct = Math.round((goal.saved / goal.target) * 100);
          const remaining = goal.target - goal.saved;
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
              style={{ padding: 22 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--surface-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>{goal.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{goal.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={11} color="var(--text-dim)" />
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{goal.deadline}</span>
                  </div>
                </div>
                <span className={`badge ${pct >= 75 ? 'badge-green' : pct >= 40 ? 'badge-gold' : 'badge-blue'}`}>
                  {pct}%
                </span>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>₹{goal.saved.toLocaleString('en-IN')} saved</span>
                  <span style={{ color: 'var(--text-dim)' }}>₹{goal.target.toLocaleString('en-IN')} target</span>
                </div>
                <div className="progress-bar" style={{ height: 7 }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: pct >= 75 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#3b82f6',
                    borderRadius: 4,
                  }} />
                </div>
              </div>

              {/* Monthly needed */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 12px',
                background: 'var(--surface-3)', borderRadius: 9,
                marginBottom: 12, fontSize: 12,
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly needed</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>₹{goal.monthlyNeeded.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 12, color: 'var(--text-muted)' }}>
                <span>Remaining: ₹{remaining.toLocaleString('en-IN')}</span>
              </div>

              {/* AI Plan */}
              {aiPlan[goal.id] ? (
                <div style={{
                  background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)',
                  borderRadius: 9, padding: '10px 12px',
                  fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text)',
                  marginBottom: 10,
                }}>{aiPlan[goal.id]}</div>
              ) : null}

              <button
                onClick={() => getAIPlan(goal)}
                disabled={loadingPlan === goal.id}
                style={{
                  width: '100%', padding: '8px',
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                  borderRadius: 9, color: '#10b981', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {loadingPlan === goal.id
                  ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Generating plan...</>
                  : <><Sparkles size={12} /> {aiPlan[goal.id] ? 'Refresh AI Plan' : 'Generate AI Plan'}</>
                }
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 200,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="card"
              style={{ width: 420, padding: 28 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>New Goal</div>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} color="var(--text-muted)" />
                </button>
              </div>

              {/* Emoji picker */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>Pick an emoji</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {emojis.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))} style={{
                      width: 38, height: 38, borderRadius: 8, fontSize: 20,
                      background: form.emoji === e ? 'rgba(16,185,129,0.15)' : 'var(--surface-3)',
                      border: form.emoji === e ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
                      cursor: 'pointer',
                    }}>{e}</button>
                  ))}
                </div>
              </div>

              {[
                { label: 'Goal Name', key: 'name', placeholder: 'e.g. Emergency Fund, New Car' },
                { label: 'Target Amount (₹)', key: 'target', placeholder: 'e.g. 100000' },
                { label: 'Deadline', key: 'deadline', placeholder: 'e.g. Dec 2025' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>{label}</div>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--surface-3)', border: '1px solid var(--border)',
                      borderRadius: 9, color: 'var(--text)', fontSize: 14, outline: 'none',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  />
                </div>
              ))}

              <button
                onClick={addGoal}
                style={{
                  width: '100%', padding: '12px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none', borderRadius: 10,
                  color: 'white', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', marginTop: 6,
                }}
              >Create Goal</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}