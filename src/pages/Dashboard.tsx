import { motion } from 'framer-motion';
import { useProfile, useTransactions } from '../store/useAppStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { profile } = useProfile();
  const { transactions } = useTransactions();
  const navigate = useNavigate();

  // Calculate Metrics
  const income = Number(profile.income) || 0;
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const extraIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = income + extraIncome;
  const balance = totalIncome - expenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

  // Format currency
  const fmt = (num: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: profile.currency || 'INR', maximumFractionDigits: 0 }).format(num);

  // Calculate actual category breakdown instead of mock data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (expenseData.length === 0) {
    expenseData.push({ name: 'No Data', value: 1 });
  }
  
  const COLORS = ['#00C853', '#00E676', '#14FF72', '#a7f3d0', '#ecfdf5'];

  const trendData = [
    { name: 'Week 1', balance: balance * 0.2 },
    { name: 'Week 2', balance: balance * 0.5 },
    { name: 'Week 3', balance: balance * 0.8 },
    { name: 'Week 4', balance: balance }
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <motion.div variants={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is what's happening with your finances this month.</p>
        </div>
        <button onClick={() => navigate('/budget')} className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <Plus size={16} /> Add Transaction
        </button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        
        <motion.div variants={item} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0, 200, 83, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={20} color="var(--primary)" />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: 13, fontWeight: 600, background: 'rgba(0,200,83,0.1)', padding: '4px 8px', borderRadius: 20 }}>
              <ArrowUpRight size={14} /> +2.4%
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Net Balance</p>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700 }}>{fmt(balance)}</h2>
        </motion.div>

        <motion.div variants={item} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownRight size={20} color="var(--danger)" />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
              This Month
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Total Expenses</p>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700 }}>{fmt(expenses)}</h2>
        </motion.div>

        <motion.div variants={item} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(20, 255, 114, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="var(--accent)" />
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Savings Rate</p>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700 }}>{savingsRate}%</h2>
        </motion.div>

      </motion.div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        
        <motion.div variants={item} className="card" style={{ padding: 24 }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Balance Trend</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dx={-10} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} itemStyle={{ color: 'var(--primary)' }} />
                <Area type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Expense Breakdown</h3>
          <div style={{ flex: 1, minHeight: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }} itemStyle={{ color: 'var(--text)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {expenseData.slice(0,3).map((item, i) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }} />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{((item.value / expenses) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
