import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, ShieldAlert, PieChart,
  Target, BookOpen, Building2, Settings, TrendingUp, Zap
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MessageSquare, label: 'AI Coach', path: '/coach' },
  { icon: ShieldAlert, label: 'Scam Shield', path: '/scam-shield' },
  { icon: PieChart, label: 'Budget', path: '/budget' },
  { icon: Target, label: 'Goals', path: '/goals' },
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
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 20px', cursor: 'pointer' }}
      >
        <div style={{
          width: 34, height: 34,
          background: 'linear-gradient(135deg, #10b981, #3b82f6)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={18} color="white" fill="white" />
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>ArthSaathi</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>AI FINANCIAL GUARDIAN</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {navItems.map(({ icon: Icon, label, path }) => (
          <div
            key={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {path === '/scam-shield' && (
              <span className="badge badge-red" style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px' }}>NEW</span>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="sidebar-link" onClick={() => navigate('/settings')}>
          <Settings size={17} />
          <span>Settings</span>
        </div>
        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', marginTop: 4,
          background: 'var(--surface-3)', borderRadius: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, color: 'white',
          }}>R</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Rahul K.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={10} color="#10b981" />
              <span style={{ fontSize: 10, color: '#10b981' }}>Score: 72</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}