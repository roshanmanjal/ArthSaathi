import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{
          height: 60,
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '8px 14px',
            maxWidth: 400,
          }}>
            <Search size={15} color="var(--text-dim)" />
            <input
              placeholder="Ask anything about your finances..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: 13, width: '100%',
              }}
            />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              position: 'relative', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 10, cursor: 'pointer',
            }}>
              <Bell size={16} color="var(--text-muted)" />
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 7, height: 7, background: '#ef4444',
                borderRadius: '50%', border: '1.5px solid var(--surface-1)',
              }} />
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}