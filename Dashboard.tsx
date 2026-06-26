import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShieldCheck, Target, BookOpen, AlertTriangle, ArrowUp, ArrowDown, Zap, ChevronRight } from 'lucide-react';
import { mockExpenses, mockCategories, mockAlerts, healthScoreBreakdown } from '../data/mock';
import { useNavigate } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="font-display" style={{ fontSize: 28, fontWeight: 700, color }}>{score}</span>
        <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>/ 100</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const totalIncome = 42000;
  const totalExpenses = 29000;
  const savingsRate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              Good morning, Rahul 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Your financial health improved by 4 points this week
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              padding: '8px 16px', borderRadius: 10,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              fontSize: 13, color: '#10b981', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Zap size={14} fill="#10b981" />
              Streak: 7 days 🔥
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alert banner */}
      {mockAlerts[0] && (
        <motion.div variants={fadeUp} style={{
          marginBottom: 20,
          padding: '12px 16px',
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer',
        }} onClick={() => navigate('/scam-shield')}>
          <AlertTriangle size={16} color="#ef4444" />
          <span style={{ fontSize: 13, color: '#f87171', flex: 1 }}>{mockAlerts[0].message}</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{mockAlerts[0].time}</span>
          <ChevronRight size={14} color="var(--text-dim)" />
        </motion.div>
      )}

      {/* Stats row */}
      <motion.div variants={container} style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20,
      }}>
        {[
          { label: 'Monthly Income', value: '₹42,000', change: '+8%', up: true, color: '#10b981' },
          { label: 'Expenses', value: '₹29,000', change: '-5%', up: false, color: '#3b82f6' },
          { label: 'Savings Rate', value: `${savingsRate}%`, change: '+3%', up: true, color: '#f59e0b' },
          { label: 'Goals Progress', value: '3 / 4', change: 'active', up: true, color: '#8b5cf6' },
        ].map(({ label, value, change, up, color }) => (
          <motion.div key={label} variants={fadeUp} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>{label}</div>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color }}>{value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {up ? <ArrowUp size={12} color="#10b981" /> : <ArrowDown size={12} color="#ef4444" />}
              <span style={{ fontSize: 12, color: up ? '#10b981' : '#ef4444' }}>{change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 16 }}>
        {/* Income vs Expense chart */}
        <motion.div variants={fadeUp} className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div className="font-display" style={{ fontSize: 16, fontWeight: 600 }}>Income vs Expenses</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months</div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />Income
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />Expenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockExpenses}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#gIncome)" />
              <Area type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2} fill="url(#gExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Health Score card */}
        <motion.div variants={fadeUp} className="card" style={{ padding: 22 }}>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Financial Health</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Based on 7 factors</div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <ScoreRing score={72} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {healthScoreBreakdown.slice(0, 4).map(({ label, score }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}>{score}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${score}%`,
                    background: score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
                  }} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', marginTop: 16, padding: '9px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: 9, color: '#10b981', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <TrendingUp size={14} /> View Full Report
          </button>
        </motion.div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Expense breakdown */}
        <motion.div variants={fadeUp} className="card" style={{ padding: 22 }}>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Spending Breakdown</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <PieChart width={120} height={120}>
              <Pie data={mockCategories} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="amount" paddingAngle={3}>
                {mockCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockCategories.slice(0, 4).map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>₹{c.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={fadeUp} className="card" style={{ padding: 22 }}>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🛡️', label: 'Check a suspicious message', path: '/scam-shield', color: '#ef4444' },
              { icon: '💬', label: 'Ask AI Coach a question', path: '/coach', color: '#10b981' },
              { icon: '🎯', label: 'Add a new goal', path: '/goals', color: '#8b5cf6' },
              { icon: '📚', label: "Today's lesson (5 min)", path: '/learn', color: '#f59e0b' },
            ].map(({ icon, label, path, color }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10,
                  background: 'var(--surface-3)', border: '1px solid var(--border)',
                  color: 'var(--text)', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                <ChevronRight size={14} color="var(--text-dim)" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Learning & streak */}
        <motion.div variants={fadeUp} className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>Learning Progress</div>
            <span className="badge badge-gold">Level 3</span>
          </div>

          {/* XP bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>XP Progress</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>340 / 500 XP</span>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: '68%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {['🎯 First Goal', '🛡️ Scam Free', '📊 Budgeter', '🔥 7 Day'].map(b => (
              <span key={b} style={{
                fontSize: 11, padding: '3px 8px',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 99, color: '#f59e0b',
              }}>{b}</span>
            ))}
          </div>

          <button
            onClick={() => navigate('/learn')}
            style={{
              width: '100%', padding: '9px',
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
              borderRadius: 9, color: '#f59e0b', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <BookOpen size={14} /> Continue Learning
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}