import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { TrendingUp, TrendingDown, Sparkles, Loader2, Plus, Trash2 } from 'lucide-react';
import { useProfile, useGoals, useTransactions, EXPENSE_CATEGORIES } from '../store/useAppStore';
import { generateBudgetAdvice } from '../utils/budgetAdvisor';
import AddTransactionModal from '../components/AddTransactionModal';
import { AnimatePresence } from 'framer-motion';

export default function Budget() {
  const [aiTip, setAiTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  const { profile } = useProfile();
  const { goals } = useGoals();
  const { transactions, removeTransaction } = useTransactions();
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const baseIncome = parseInt(profile.income) || 0;
  const extraIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const income = baseIncome + extraIncome;
  
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, e) => sum + e.amount, 0);
  const savings = Math.max(0, income - totalExpenses);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const categoryBreakdown = Object.entries(
    expenseTransactions.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, amount]) => ({ name, amount, color: EXPENSE_CATEGORIES[name] || '#6b7280', percent: totalExpenses ? Math.round((amount / totalExpenses) * 100) : 0 }))
  .sort((a, b) => b.amount - a.amount);

  function getAIInsight() {
    setLoadingTip(true);
    setTimeout(() => {
      const foodCat = categoryBreakdown.find(c => c.name.toLowerCase() === 'food');
      const entCat = categoryBreakdown.find(c => c.name.toLowerCase() === 'entertainment');
      const efGoal = goals.find(g => g.name.toLowerCase().includes('emergency'));

      const foodSpend = foodCat ? foodCat.amount : 0;
      const entertainmentSpend = entCat ? entCat.amount : 0;
      const emergencyFundSaved = efGoal ? efGoal.saved : 87000;
      const emergencyFundTarget = efGoal ? efGoal.target : 150000;

      const advice = generateBudgetAdvice({
        income,
        foodSpend,
        entertainmentSpend,
        savingsRate,
        emergencyFundSaved,
        emergencyFundTarget,
      });

      setAiTip(advice.join('\n'));
      setLoadingTip(false);
    }, 600);
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
          { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, icon: TrendingDown, color: '#ef4444' },
          { label: 'Net Savings', value: `₹${savings.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#3b82f6' },
          { label: 'Savings Rate', value: `${savingsRate}%`, icon: TrendingUp, color: '#f59e0b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>{label}</div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={17} color={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>6-Month Overview</div>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13, flexDirection: 'column' }}>
            <TrendingDown size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
            No monthly data to display
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            {[['#10b981', 'Income'], ['#3b82f6', 'Expenses'], ['#f59e0b', 'Savings']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>Expense Categories</div>
            <button onClick={() => setShowAddTransaction(true)} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 12px', borderRadius: 8, color: '#10b981', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <Plus size={14} /> Add Transaction
            </button>
          </div>
          
          {categoryBreakdown.length > 0 ? (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <PieChart width={140} height={140}>
                <Pie data={categoryBreakdown} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="amount" paddingAngle={4}>
                  {categoryBreakdown.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
              </PieChart>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categoryBreakdown.map(c => (
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
          ) : (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <PieChart width={140} height={140}>
                <Pie data={[{ value: 1 }]} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" fill="var(--surface-3)" stroke="none" />
              </PieChart>
              <div style={{ flex: 1, color: 'var(--text-dim)', fontSize: 12, textAlign: 'center' }}>
                Add expenses to see category breakdown
              </div>
            </div>
          )}
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
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9,
              background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >
            {loadingTip ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : '✨ Get AI Tips'}
          </button>
        </div>
        {aiTip ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 10, padding: '14px 16px', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
            {aiTip}
          </motion.div>
        ) : (
          <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '16px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            Click "Get AI Tips" to receive personalized budget recommendations based on your spending
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ padding: 22, marginTop: 18 }}>
        <h3 className="font-display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transactions.slice().reverse().map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface-3)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: EXPENSE_CATEGORIES[t.category] || 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{t.category}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                    {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                  </span>
                  <button onClick={() => removeTransaction(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            No transactions found. Click "Add Transaction" to begin.
          </div>
        )}
      </div>


      <AnimatePresence>
        {showAddTransaction && <AddTransactionModal onClose={() => setShowAddTransaction(false)} />}
      </AnimatePresence>
    </div>
  );
}
