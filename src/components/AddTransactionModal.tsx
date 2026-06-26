import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../store/useAppStore';

export default function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(Object.keys(EXPENSE_CATEGORIES)[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && Number(amount) > 0) {
      addTransaction({ type, amount: Number(amount), category });
      onClose();
    }
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: 400, padding: 32, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Add Transaction</h2>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'var(--surface-3)', padding: 4, borderRadius: 12 }}>
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(Object.keys(EXPENSE_CATEGORIES)[0]); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, background: type === 'expense' ? 'var(--surface-1)' : 'transparent', border: 'none', color: type === 'expense' ? '#ef4444' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s', boxShadow: type === 'expense' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}
          >
            <TrendingDown size={16} /> Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(Object.keys(INCOME_CATEGORIES)[0]); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, background: type === 'income' ? 'var(--surface-1)' : 'transparent', border: 'none', color: type === 'income' ? '#10b981' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s', boxShadow: type === 'income' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}
          >
            <TrendingUp size={16} /> Income
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Amount (₹)</label>
            <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', appearance: 'none' }}>
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 10, background: type === 'expense' ? '#ef4444' : '#10b981', border: 'none', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 10 }}>
            Save {type === 'expense' ? 'Expense' : 'Income'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
