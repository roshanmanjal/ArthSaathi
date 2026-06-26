import { motion } from 'framer-motion';
import { useNotifications } from '../store/useAppStore';
import { Bell, ShieldAlert, TrendingUp, BookOpen, Target, CheckCircle, X } from 'lucide-react';

const ICON_MAP: Record<string, typeof Bell> = {
  'Scam Alert': ShieldAlert,
  'Budget Alert': TrendingUp,
  'Goal Progress': Target,
  'Learning Reminder': BookOpen,
  'Achievement Unlocked': CheckCircle,
  'Weekly Insight': Bell,
  'Bill Reminder': TrendingUp,
};

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  danger:  { color: '#ef4444', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.15)'   },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.15)'  },
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.07)',  border: 'rgba(16,185,129,0.15)'  },
  info:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.15)'  },
};

export default function Notifications() {
  const { notifications, markAllRead, dismiss, unreadCount } = useNotifications();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{ marginLeft: 10, padding: '2px 10px', background: '#ef4444', color: 'white', borderRadius: 99, fontSize: 13, fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your alerts, reminders, and financial updates</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{ padding: '8px 16px', borderRadius: 9, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 720 }}>
        {notifications.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div className="font-display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>All caught up!</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No notifications right now.</div>
          </div>
        ) : (
          notifications.map((n, i) => {
            const cfg = typeConfig[n.type] || typeConfig.info;
            const Icon = ICON_MAP[n.title] || Bell;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 16px', borderRadius: 12,
                  background: n.read ? 'var(--surface-2)' : cfg.bg,
                  border: `1px solid ${n.read ? 'var(--border)' : cfg.border}`,
                  opacity: n.read ? 0.75 : 1, transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={17} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                    {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color }} />}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{n.time}</div>
                </div>
                <button onClick={() => dismiss(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                  <X size={14} color="var(--text-dim)" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
