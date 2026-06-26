import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, X, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { useGoals, useProfile } from '../store/useAppStore';
import { generateGoalPlan } from '../utils/goalPlanner';

export default function Goals() {
  const { goals, addGoal, deleteGoal } = useGoals();
  const { profile } = useProfile();
  
  const [showAdd, setShowAdd] = useState(false);
  const [aiPlan, setAiPlan] = useState<Record<number, string>>({});
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', target: '', deadline: '', emoji: '🎯' });

  const emojis = ['🎯', '🏠', '🚗', '💻', '✈️', '📚', '💍', '🏖️', '🛡️', '💰'];

  function getAIPlan(goal: typeof goals[0]) {
    setLoadingPlan(goal.id);
    setTimeout(() => {
      const plan = generateGoalPlan(goal);
      setAiPlan(prev => ({ ...prev, [goal.id]: plan }));
      setLoadingPlan(null);
    }, 600);
  }

  function handleCreateGoal() {
    if (!form.name || !form.target) return;
    const targetVal = parseInt(form.target) || 0;
    
    addGoal({
      name: form.name,
      target: targetVal,
      saved: 0,
      emoji: form.emoji,
      deadline: form.deadline || 'Dec 2025',
      monthlyNeeded: Math.round(targetVal / 12),
      category: form.name.toLowerCase().includes('emergency') ? 'Safety' : 'Purchase',
    });
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
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
        ><Plus size={16} /> Add Goal</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {goals.map(goal => {
          const pct = Math.round((goal.saved / goal.target) * 100);
          const remaining = goal.target - goal.saved;
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{goal.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{goal.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={11} color="var(--text-dim)" />
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{goal.deadline}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge ${pct >= 75 ? 'badge-green' : pct >= 40 ? 'badge-gold' : 'badge-blue'}`}>{pct}%</span>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 2, display: 'flex', alignItems: 'center' }}
                    title="Delete Goal"
                  >
                    <Trash2 size={14} style={{ transition: 'color 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>₹{goal.saved.toLocaleString('en-IN')} saved</span>
                  <span style={{ color: 'var(--text-dim)' }}>₹{goal.target.toLocaleString('en-IN')} target</span>
                </div>
                <div className="progress-bar" style={{ height: 7 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 75 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#3b82f6', borderRadius: 4 }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--surface-3)', borderRadius: 9, marginBottom: 8, fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly needed</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>₹{goal.monthlyNeeded.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ fontSize: 12, marginBottom: 12, color: 'var(--text-muted)' }}>Remaining: ₹{remaining.toLocaleString('en-IN')}</div>

              {aiPlan[goal.id] && (
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 9, padding: '10px 12px', fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text)', marginBottom: 10 }}>
                  {aiPlan[goal.id]}
                </div>
              )}

              <button
                onClick={() => getAIPlan(goal)}
                disabled={loadingPlan === goal.id}
                style={{ width: '100%', padding: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 9, color: '#10b981', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                {loadingPlan === goal.id
                  ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Generating plan...</>
                  : <><Sparkles size={12} /> {aiPlan[goal.id] ? 'Refresh AI Plan' : 'Generate AI Plan'}</>}
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="card" style={{ width: 420, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>New Goal</div>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--text-muted)" /></button>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>Pick an emoji</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {emojis.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))} style={{ width: 38, height: 38, borderRadius: 8, fontSize: 20, background: form.emoji === e ? 'rgba(16,185,129,0.15)' : 'var(--surface-3)', border: form.emoji === e ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)', cursor: 'pointer' }}>{e}</button>
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
                  <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 9, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                </div>
              ))}
              <button onClick={handleCreateGoal} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>Create Goal</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
