import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Sparkles, Loader2, ShieldCheck, Target,
  BookOpen, PiggyBank, CreditCard, AlertTriangle, Zap
} from 'lucide-react';
import { useProfile, useTransactions, useGoals } from '../store/useAppStore';

const emptyHealthScoreBreakdown = [
  { label: 'Savings Rate', score: 0, max: 100, tip: 'Save at least 20% of income' },
  { label: 'Debt Management', score: 0, max: 100, tip: 'Keep debt low' },
  { label: 'Emergency Fund', score: 0, max: 100, tip: 'Build 6 months of expenses' },
  { label: 'Budget Adherence', score: 0, max: 100, tip: 'Stick to monthly budget' },
  { label: 'Investment Portfolio', score: 0, max: 100, tip: 'Start investing' },
  { label: 'Scam Awareness', score: 0, max: 100, tip: 'Stay vigilant' },
  { label: 'Financial Knowledge', score: 0, max: 100, tip: 'Complete more lessons' },
];

// ─── Local AI Health Report Generator ──────────────────────────────────────
function generateHealthReport(breakdown: { label: string; score: number }[], overallScore: number, name: string): string {
  const weakest = [...breakdown].sort((a, b) => a.score - b.score).slice(0, 2);
  const strongest = [...breakdown].sort((a, b) => b.score - a.score).slice(0, 2);

  const tips: Record<string, string> = {
    'Savings Rate': 'Target at least 20% of monthly income for savings. Set up an auto-debit SIP on salary day.',
    'Debt Management': 'List all EMIs and credit card debts. Prioritize paying off highest-interest debt first.',
    'Emergency Fund': 'Build 6 months of expenses in a liquid fund or sweep-in FD. Start with ₹2,000/month.',
    'Budget Adherence': 'Track every expense using a spreadsheet or app. Review spending weekly.',
    'Investment Portfolio': 'Start a ₹500/month SIP in a Nifty 50 index fund — even small amounts compound greatly.',
    'Scam Awareness': 'Never share OTP, PIN or CVV on call. Report fraud at cybercrime.gov.in or call 1930.',
    'Financial Knowledge': 'Spend 10 minutes per day on the ArthSaathi Learn tab to earn XP and level up.',
  };

  const gradeLabel = overallScore >= 80 ? 'Excellent' : overallScore >= 65 ? 'Good' : overallScore >= 50 ? 'Fair' : 'Needs Work';
  const percentile = overallScore >= 80 ? 90 : overallScore >= 65 ? 68 : overallScore >= 50 ? 45 : 25;

  let report = `📊 PERSONALIZED FINANCIAL HEALTH REPORT FOR ${name.toUpperCase()}\n`;
  report += `${'─'.repeat(48)}\n\n`;
  report += `🏆 Overall Score: ${overallScore}/100 (${gradeLabel})\n`;
  report += `   You're doing better than ${percentile}% of Indians your age.\n\n`;

  report += `✅ WHAT YOU'RE DOING WELL:\n`;
  strongest.forEach(s => {
    report += `  • ${s.label} — Score: ${s.score}/100. ${s.score >= 70 ? 'Great job! Keep this up.' : 'Showing solid progress.'}\n`;
  });

  report += `\n🎯 TOP AREAS TO IMPROVE:\n`;
  weakest.forEach(w => {
    report += `  • ${w.label} — Score: ${w.score}/100\n`;
    report += `    → ${tips[w.label] || 'Focus on building consistency in this area.'}\n`;
  });

  const priorityArea = weakest[0];
  report += `\n⚡ THIS WEEK'S PRIORITY ACTION:\n`;
  report += `  ${tips[priorityArea?.label] || 'Review your financial habits and identify one area to improve immediately.'}\n`;

  report += `\n💡 DEMO AI TIP:\n`;
  report += `  Your financial score updates weekly. Stay consistent with the Learn tab and Goals tracker for the fastest improvement!`;

  return report;
}
// ────────────────────────────────────────────────────────────────────────────

function DemoBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
      fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.03em'
    }}>
      <Zap size={10} fill="#10b981" /> DEMO AI · Offline
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

  return (
    <div style={{ position: 'relative', width: 170, height: 170 }}>
      <svg width="170" height="170" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="85" cy="85" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="85" cy="85" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s ease', filter: `drop-shadow(0 0 10px ${color}60)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="font-display" style={{ fontSize: 38, fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>/ 100</span>
        <span style={{ fontSize: 12, fontWeight: 600, color, marginTop: 2 }}>{label}</span>
      </div>
    </div>
  );
}

const icons: Record<string, typeof TrendingUp> = {
  'Savings Rate': PiggyBank,
  'Debt Management': CreditCard,
  'Emergency Fund': ShieldCheck,
  'Budget Adherence': Target,
  'Investment Portfolio': TrendingUp,
  'Scam Awareness': AlertTriangle,
  'Financial Knowledge': BookOpen,
};

export default function FinancialHealth() {
  const { profile } = useProfile();
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const [aiReport, setAiReport] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic Computation
  const income = Number(profile.income) || 0;
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  
  const savingsScore = Math.min(100, Math.max(0, savingsRate * 3));
  const budgetScore = expenses > 0 ? (income > expenses ? 85 : 40) : 50;
  const emergencyScore = goals.some(g => g.name.toLowerCase().includes('emergency')) ? 80 : 30;
  
  const overallScore = Math.round((savingsScore + budgetScore + emergencyScore + 80 + 50 + 75 + 60) / 7);
  const gradeLabel = overallScore >= 80 ? 'Excellent' : overallScore >= 65 ? 'Good' : overallScore >= 50 ? 'Fair' : 'Needs Work';
  const gradeColor = overallScore >= 80 ? 'var(--success)' : overallScore >= 65 ? 'var(--primary)' : overallScore >= 50 ? 'var(--warning)' : 'var(--danger)';

  const computedBreakdown = [
    { label: 'Savings Rate', score: Math.round(savingsScore), max: 100, tip: 'Save at least 20% of income' },
    { label: 'Debt Management', score: 80, max: 100, tip: 'Keep debt low' },
    { label: 'Emergency Fund', score: emergencyScore, max: 100, tip: 'Build 6 months of expenses' },
    { label: 'Budget Adherence', score: budgetScore, max: 100, tip: 'Stick to monthly budget' },
    { label: 'Investment Portfolio', score: 50, max: 100, tip: 'Start investing' },
    { label: 'Scam Awareness', score: 75, max: 100, tip: 'Stay vigilant' },
    { label: 'Financial Knowledge', score: 60, max: 100, tip: 'Complete more lessons' },
  ];

  function generateReport() {
    setLoading(true);
    setAiReport('');
    setTimeout(() => {
      const report = generateHealthReport(computedBreakdown, overallScore, profile.name || 'User');
      setAiReport(report);
      setLoading(false);
    }, 900);
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Financial Health Score</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your complete financial fitness report · Updated weekly</p>
        </div>
        <DemoBadge />
      </div>

      {/* Hero score */}
      <div className="card" style={{ padding: 32, marginBottom: 20, background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(59,130,246,0.06))', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="mobile-col" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <ScoreRing score={overallScore} />
          <div style={{ flex: 1 }}>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Your Financial Health is <span style={{ color: gradeColor }}>{gradeLabel}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              {overallScore > 0 ? `${profile.name?.split(' ')[0] || 'You'} are doing great! Keep tracking your budget and learning to boost your score.` : `${profile.name?.split(' ')[0] || 'You'} don't have enough data for a health score yet. Start tracking your budget and learning!`}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ padding: '8px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                ✅ Better than 68% of peers
              </div>
              <div style={{ padding: '8px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>
                📈 +4 pts this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginBottom: 20 }}>
        {computedBreakdown.map(({ label, score, tip }, i) => {
          const Icon = icons[label] || TrendingUp;
          const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
          return (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{tip}</div>
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color }}>{score}</div>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Report */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#10b981" />
            <div className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>AI Financial Health Report</div>
            <DemoBadge />
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 9, background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : '✨ Generate Report'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {aiReport ? (
            <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)',
                borderRadius: 10, padding: '16px', fontSize: 13, lineHeight: 1.8,
                whiteSpace: 'pre-wrap', color: 'var(--text)', fontFamily: 'monospace'
              }}>
              {aiReport}
            </motion.div>
          ) : loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} color="#10b981" />
              <div>Analyzing your financial profile...</div>
            </motion.div>
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '16px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              Click "Generate Report" to get your personalized financial health analysis — runs fully offline, no API needed.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
