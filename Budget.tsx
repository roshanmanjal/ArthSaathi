import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockExpenses, mockCategories } from '../data/mock';
import { PlusCircle, TrendingUp, TrendingDown, Sparkles, Loader2 } from 'lucide-react';

export default function Budget() {
  const [aiTip, setAiTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  const income = 42000;
  const expenses = 29000;
  const savings = income - expenses;
  const savingsRate = Math.round((savings / income) * 100);

  async function getAIInsight() {
    setLoadingTip(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `I earn ₹42,000/month. My expenses: Rent ₹12,000, Food ₹5,500, Transport ₹3,000, Entertainment ₹2,500, Utilities ₹2,000, Others ₹5,000. Total savings: ₹12,000 (29%).

Give me 3 specific, actionable tips to improve my budget as an Indian salaried employee. Keep it short, practical, and use ₹ amounts. Format as bullet points.`
          }],
        }),
      });
      const data = await res.json();
      setAiTip(data.content?.[0]?.text || '');
    } catch {
      setAiTip('• Track daily expenses using any UPI app — most show spending categories automatically.\n• Your food spend is ₹5,500 — cooking at home 3 extra days/week can save ₹1,500.\n• Try 50-30-20 rule: ₹21,000 needs, ₹12,600 wants, ₹8,400 savings.');
    } finally {
      setLoadingTip(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Budget Intelligence</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>June 2025 · AI-powered insights for your spending</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Monthly Income', value: `₹${income.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#10b981' },
          { label: 'Total Expenses', value: `₹${expenses.toLocaleString('en-IN')}`, icon: TrendingDown, color: '#ef4444' },
          { label: 'Net Savings', value: `₹${savings.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#3b82f6' },
          { label: 'Savings Rate', value: `${savingsRate}%`, icon: TrendingUp, color: '#f59e0b', good: savingsRate >= 20 },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: '18px 20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>{label}</div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${color}15`, border: `1px solid ${color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Bar chart */}
        <div className="card" style={{ padding: 22 }}>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>6-Month Overview</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockExpenses} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="savings" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            {[['#10b981', 'Income'], ['#3b82f6', 'Expenses'], ['#f59e0b', 'Savings']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card" style={{ padding: 22 }}>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Expense Categories</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <PieChart width={140} height={140}>
              <Pie data={mockCategories} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="amount" paddingAngle={4}>
                {mockCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockCategories.map(c => (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color }} />
                      <span style={{ fontSize: 12, color: 'var(--text)' }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{c.percent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${c.percent}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#10b981" />
            <div className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>AI Budget Advisor</div>
          </div>
          <button
            onClick={getAIInsight}
            disabled={loadingTip}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 9,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', color: 'white',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >
            {loadingTip ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : '✨ Get AI Tips'}
          </button>
        </div>

        {aiTip ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)',
              borderRadius: 10, padding: '14px 16px',
              fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text)',
            }}
          >{aiTip}</motion.div>
        ) : (
          <div style={{
            background: 'var(--surface-3)', borderRadius: 10, padding: '16px',
            fontSize: 13, color: 'var(--text-muted)', textAlign: 'center',
          }}>
            Click "Get AI Tips" to receive personalized budget recommendations based on your spending
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}