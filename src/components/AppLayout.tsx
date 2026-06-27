import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, Settings, LogOut, User } from 'lucide-react';
import { useNotifications, useProfile, useAuth } from '../store/useAppStore';

export default function AppLayout() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { profile } = useProfile();
  const { signOut } = useAuth();

  const initial = profile.name?.charAt(0)?.toUpperCase() || 'U';

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Sidebar />
      
      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav-bottom">
        <div className="mobile-nav-item" onClick={() => navigate('/dashboard')} style={{ color: window.location.pathname === '/dashboard' ? 'var(--primary)' : '' }}>
          <Search size={20} />
          <span>Home</span>
        </div>
        <div className="mobile-nav-item" onClick={() => navigate('/budget')} style={{ color: window.location.pathname === '/budget' ? 'var(--primary)' : '' }}>
          <Bell size={20} />
          <span>Budget</span>
        </div>
        <div className="mobile-nav-item" onClick={() => navigate('/learn')} style={{ color: window.location.pathname === '/learn' ? 'var(--primary)' : '' }}>
          <User size={20} />
          <span>Learn</span>
        </div>
        <div className="mobile-nav-item" onClick={() => navigate('/settings')} style={{ color: window.location.pathname === '/settings' ? 'var(--primary)' : '' }}>
          <Settings size={20} />
          <span>Menu</span>
        </div>
      </div>

      <div className="app-main-content" style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Header */}
        <header className="app-header" style={{
          height: 70,
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          {/* Search */}
          <label className="hide-on-mobile" style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface-3)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '10px 16px', maxWidth: 480,
            transition: 'all 0.2s ease', cursor: 'text'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search transactions, ask AI coach..."
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, width: '100%' }}
            />
          </label>
          
          <div className="hide-on-mobile" style={{ flex: 1 }} />

          {/* Right Actions */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            
            {/* Notifications */}
            <div onClick={() => navigate('/notifications')} style={{
              position: 'relative', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
              <Bell size={18} color="var(--text)" />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  minWidth: 18, height: 18, background: 'var(--danger)', color: 'white',
                  borderRadius: 10, fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  border: '2px solid var(--surface-1)'
                }}>{unreadCount}</span>
              )}
            </div>

            {/* Settings */}
            <div className="hide-on-mobile" onClick={() => navigate('/settings')} style={{
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
              <Settings size={18} color="var(--text)" />
            </div>

            <div className="hide-on-mobile" style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />

            {/* Profile Avatar & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-2)', padding: '6px 12px 6px 6px', borderRadius: 24, border: '1px solid var(--border)' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 14
              }}>
                {initial}
              </div>
              <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{profile.name?.split(' ')[0] || 'User'}</span>
              </div>
              <div onClick={handleLogout} style={{ marginLeft: 8, padding: 6, cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '50%' }} title="Logout" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                <LogOut size={16} />
              </div>
            </div>
            
          </div>
        </header>

        {/* Main Content */}
        <main className="app-header" style={{ flex: 1, padding: 32, overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
