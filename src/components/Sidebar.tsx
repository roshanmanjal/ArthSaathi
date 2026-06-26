import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, ShieldAlert, PieChart,
  Target, BookOpen, Building2, Zap, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MessageSquare, label: 'AI Coach', path: '/coach' },
  { icon: ShieldAlert, label: 'Scam Shield', path: '/scam-shield' },
  { icon: PieChart, label: 'Budget', path: '/budget' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Activity, label: 'Health Score', path: '/health' },
  { icon: Building2, label: 'Schemes', path: '/schemes' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      transition: 'width 0.3s ease'
    }}>
      {/* Logo */}
      <div onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 32px', cursor: 'pointer' }}>
        <div style={{
          width: 36, height: 36,
          background: 'var(--primary)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px var(--glow)'
        }}>
          <Zap size={20} color="#000" fill="#000" />
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>ArthSathi</div>
          <div style={{ fontSize: 10, color: 'var(--primary)', letterSpacing: '0.05em', fontWeight: 600 }}>AI FINANCIAL GUARDIAN</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {navItems.map(({ icon: Icon, label, path }, index) => {
          const isActive = location.pathname === path;
          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={path}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                background: isActive ? 'rgba(0, 200, 83, 0.1)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => navigate(path)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--surface-3)';
                  e.currentTarget.style.color = 'var(--text)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon size={18} />
              <span style={{ fontSize: 14 }}>{label}</span>
              {path === '/scam-shield' && (
                <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 6px', background: 'var(--danger)', color: 'white', borderRadius: 6, fontWeight: 700 }}>AI</span>
              )}
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
