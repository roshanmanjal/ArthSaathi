import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useProfile, useTransactions } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Briefcase, DollarSign, TrendingDown, Target, Globe } from 'lucide-react';
import { MockDB } from '../utils/mockDB';

export default function Onboarding() {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const isGoogle = user?.provider === 'google';

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: '',
    occupation: '',
    income: '',
    expenses: '',
    currency: 'INR',
    goal: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.income) {
      setProfile({
        ...profile,
        name: form.name,
        age: form.age,
        occupation: form.occupation,
        income: form.income,
        currency: form.currency,
        goal: form.goal,
        phone: profile.phone || '', // Keep existing or default
        city: 'Not Specified' // Legacy field compatibility
      });
      
      if (form.expenses && Number(form.expenses) > 0) {
        addTransaction({
          type: 'expense',
          amount: Number(form.expenses),
          category: 'Others',
        });
      }
      
      setTimeout(() => {
        if (user?.email) {
          try {
            MockDB.updateUser(user.email, { onboarding_completed: true });
            MockDB.saveSessionSnapshots(user.email);
          } catch (e) {
            console.error('[Onboarding] Failed to update MockDB', e);
          }
        }
        navigate('/dashboard', { replace: true });
      }, 50);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: 500, padding: 40, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Complete Your Profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Let's personalize your financial journey.</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input required={!isGoogle} readOnly={isGoogle} value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none', opacity: isGoogle ? 0.5 : 1, cursor: isGoogle ? 'not-allowed' : 'text' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Age</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="25" style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Occupation</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input required value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} placeholder="e.g. Designer" style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Monthly Income</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="number" value={form.income} onChange={e => setForm({...form, income: e.target.value})} placeholder="50000" style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Monthly Expenses</label>
              <div style={{ position: 'relative' }}>
                <TrendingDown size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="number" value={form.expenses} onChange={e => setForm({...form, expenses: e.target.value})} placeholder="25000" style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Preferred Currency</label>
              <div style={{ position: 'relative' }}>
                <Globe size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none', appearance: 'none' }}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Financial Goal (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Target size={18} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} placeholder="e.g. Buy a house" style={{ width: '100%', padding: '14px 14px 14px 42px', outline: 'none' }} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: 16, marginTop: 12 }}>
            Continue to Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
}
