import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Shield, Palette, Download, Trash2, ChevronRight,
  Check, Save, Zap, Moon, Sun, Monitor, Circle
} from 'lucide-react';
import {
  useProfile, useNotifPrefs, useTheme,
  resetAllDemoData, exportUserData,
  ACCENT_COLORS
} from '../store/useAppStore';

type Section = 'profile' | 'notifications' | 'privacy' | 'appearance' | null;

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

function Toast({ msg, onHide }: { msg: string; onHide: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onAnimationComplete={() => setTimeout(onHide, 2000)}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 999,
        padding: '12px 20px', background: '#10b981', color: 'white',
        borderRadius: 10, fontSize: 13, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(16,185,129,0.4)'
      }}
    >
      <Check size={15} /> {msg}
    </motion.div>
  );
}

function SectionCard({
  icon: Icon, label, color, active, onClick
}: {
  icon: typeof User; label: string; color: string; active: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        borderRadius: 12, background: active ? `${color}12` : 'var(--surface-2)',
        border: `1px solid ${active ? color + '30' : 'var(--border)'}`,
        cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s'
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: `${color}18`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Icon size={17} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
      </div>
      <ChevronRight size={15} color="var(--text-dim)" style={{ transform: active ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
    </motion.button>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: checked ? '#10b981' : 'var(--surface-3)',
        border: `1px solid ${checked ? '#10b981' : 'var(--border)'}`,
        padding: 2, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, display: 'flex', alignItems: 'center'
      }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
      />
    </button>
  );
}

export default function Settings() {
  const { profile, setProfile } = useProfile();
  const { prefs, setPrefs } = useNotifPrefs();
  const { theme, setTheme } = useTheme();

  const [active, setActive] = useState<Section>('profile');
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ ...profile });
  const [confirmReset, setConfirmReset] = useState(false);

  function handleSaveProfile() {
    setProfile(form);
    setToast('Profile saved successfully!');
  }

  function handleExport() {
    exportUserData();
    setToast('Data exported to JSON!');
  }

  const sections: { key: Section; icon: typeof User; label: string; color: string }[] = [
    { key: 'profile', icon: User, label: 'Profile', color: '#10b981' },
    { key: 'notifications', icon: Bell, label: 'Notifications', color: '#3b82f6' },
    { key: 'privacy', icon: Shield, label: 'Privacy & Security', color: '#f59e0b' },
    { key: 'appearance', icon: Palette, label: 'Appearance', color: '#8b5cf6' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your account, preferences, and data</p>
        </div>
        <DemoBadge />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sections.map(s => (
            <SectionCard
              key={s.key}
              icon={s.icon}
              label={s.label}
              color={s.color}
              active={active === s.key}
              onClick={() => setActive(active === s.key ? null : s.key)}
            />
          ))}
        </div>

        {/* Right panel */}
        <AnimatePresence mode="wait">
          {active === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="card" style={{ padding: 24 }}>
              <div className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Edit Profile</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Your name' },
                  { key: 'email', label: 'Email', placeholder: 'you@example.com' },
                  { key: 'phone', label: 'Phone', placeholder: '+91 ...' },
                  { key: 'age', label: 'Age', placeholder: '28' },
                  { key: 'occupation', label: 'Occupation', placeholder: 'Software Engineer' },
                  { key: 'city', label: 'City', placeholder: 'Mumbai' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                      {label}
                    </label>
                    <input
                      value={(form as Record<string, string>)[key] || ''}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 9,
                        background: 'var(--surface-3)', border: '1px solid var(--border)',
                        color: 'var(--text)', fontSize: 13, outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ gridColumn: '1/-1', marginTop: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Monthly Income (₹)
                </label>
                <input
                  value={form.income || ''}
                  onChange={e => setForm(f => ({ ...f, income: e.target.value }))}
                  placeholder="42000"
                  type="number"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 9,
                    background: 'var(--surface-3)', border: '1px solid var(--border)',
                    color: 'var(--text)', fontSize: 13, outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                onClick={handleSaveProfile}
                style={{
                  marginTop: 20, padding: '10px 20px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none', color: 'white', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Save size={14} /> Save Profile
              </button>
            </motion.div>
          )}

          {active === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="card" style={{ padding: 24 }}>
              <div className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Notification Preferences</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'scamAlerts', label: 'Scam Alerts', desc: 'Real-time alerts when suspicious messages are detected' },
                  { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Notify when spending exceeds category budgets' },
                  { key: 'goalReminders', label: 'Goal Reminders', desc: 'Weekly updates on your savings goal progress' },
                  { key: 'learningReminders', label: 'Learning Reminders', desc: "Daily nudge if you haven't completed your lesson" },
                  { key: 'weeklyReport', label: 'Weekly Financial Report', desc: 'Summary of your financial health every Sunday' },
                  { key: 'billReminders', label: 'Bill Reminders', desc: 'Alerts 3 days before upcoming bill due dates' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                    </div>
                    <ToggleSwitch
                      checked={(prefs as unknown as Record<string, boolean>)[key]}
                      onChange={v => setPrefs({ [key]: v })}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {active === 'privacy' && (
            <motion.div key="privacy" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="card" style={{ padding: 24 }}>
              <div className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Privacy & Data</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                ArthSaathi stores all your data locally in your browser's localStorage. Nothing is sent to any server. You are in full control.
              </p>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#10b981', marginBottom: 4 }}>🔒 100% Local Storage</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Your financial data, goals, chat history, and settings never leave your device. The AI engine runs entirely offline.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handleExport}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)',
                    color: 'var(--text)', cursor: 'pointer', fontSize: 13, fontWeight: 500
                  }}
                >
                  <Download size={15} color="#3b82f6" /> Export My Data as JSON
                </button>

                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                      borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 500
                    }}
                  >
                    <Trash2 size={15} /> Reset All Demo Data
                  </button>
                ) : (
                  <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 10 }}>⚠️ This will erase all your goals, history, and settings. Are you sure?</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={resetAllDemoData} style={{ padding: '8px 16px', borderRadius: 8, background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                        Yes, Reset Everything
                      </button>
                      <button onClick={() => setConfirmReset(false)} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {active === 'appearance' && (
            <motion.div key="appearance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="card" style={{ padding: 24 }}>
              <div className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Appearance</div>

              {/* Theme mode */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Theme Mode</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {([
                    { mode: 'dark', icon: Moon, label: 'Dark' },
                    { mode: 'light', icon: Sun, label: 'Light' },
                    { mode: 'system', icon: Monitor, label: 'System' },
                  ] as const).map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setTheme({ mode })}
                      style={{
                        flex: 1, padding: '12px 10px', borderRadius: 12,
                        background: theme.mode === mode ? 'rgba(139,92,246,0.12)' : 'var(--surface-2)',
                        border: `1.5px solid ${theme.mode === mode ? '#8b5cf6' : 'var(--border)'}`,
                        color: theme.mode === mode ? '#8b5cf6' : 'var(--text-muted)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        fontSize: 12, fontWeight: 600, transition: 'all 0.15s'
                      }}
                    >
                      <Icon size={18} />
                      {label}
                      {theme.mode === mode && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Accent Color</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {Object.entries(ACCENT_COLORS).map(([name, hex]) => (
                    <button
                      key={name}
                      onClick={() => setTheme({ accent: hex })}
                      title={name}
                      style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: hex, border: `3px solid ${theme.accent === hex ? 'white' : 'transparent'}`,
                        cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
                        outline: theme.accent === hex ? `2px solid ${hex}` : 'none',
                        outlineOffset: 2
                      }}
                    >
                      {theme.accent === hex && (
                        <Check size={16} color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                      )}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>
                  Current: <span style={{ color: theme.accent, fontWeight: 600 }}>{theme.accent}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && <Toast msg={toast} onHide={() => setToast('')} />}
      </AnimatePresence>
    </div>
  );
}
