import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { analyzeMessageForScam } from '../utils/scamDetector';

interface AnalysisResult {
  probability: number;
  verdict: 'SCAM' | 'SUSPICIOUS' | 'SAFE';
  reasons: string[];
  action: string;
  redFlags: string[];
}

const examples = [
  { label: 'Fake KYC', text: 'Dear customer, your SBI account will be blocked. Update KYC now: bit.ly/sbi-kyc-update immediately.' },
  { label: 'UPI Scam', text: 'To receive your cashback of ₹5,000, open PhonePe and enter your UPI PIN now.' },
  { label: 'Lottery Win', text: 'Congratulations! You won a cash prize of ₹10,00,000. Send OTP to claim.' },
  { label: 'Job Scam', text: 'Earn ₹5,000 daily working from home by liking videos! Click link to join: bit.ly/easyjob-india' },
  { label: 'Investment Scam', text: 'Double your money in 30 days! 100% guaranteed returns with zero risk. invest now at tinyurl.com/double-fast' },
];


const verdictConfig = {
  SCAM: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: XCircle, label: '⚠️ High Risk — Likely Scam' },
  SUSPICIOUS: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: AlertTriangle, label: '🔶 Be Careful — Suspicious' },
  SAFE: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: CheckCircle, label: '✅ Looks Safe' },
};

export default function ScamShield() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<{ text: string; result: AnalysisResult }[]>([]);

  function analyze(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setLoading(true);
    setResult(null);

    // Simulate local analysis delay
    setTimeout(() => {
      const parsed = analyzeMessageForScam(content);
      
      let verdictMapped: 'SCAM' | 'SUSPICIOUS' | 'SAFE' = 'SAFE';
      if (parsed.verdict === 'CRITICAL' || parsed.verdict === 'HIGH') {
        verdictMapped = 'SCAM';
      } else if (parsed.verdict === 'MEDIUM') {
        verdictMapped = 'SUSPICIOUS';
      }

      const mappedResult: AnalysisResult = {
        probability: parsed.probability,
        verdict: verdictMapped,
        reasons: parsed.reasons,
        action: parsed.action,
        redFlags: parsed.redFlags,
      };

      setResult(mappedResult);
      setHistory(prev => [{ text: content, result: mappedResult }, ...prev.slice(0, 4)]);
      setLoading(false);
    }, 600);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldAlert size={20} color="#ef4444" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Scam Shield</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Local fraud detection · Paste any suspicious message</p>
          </div>
          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Demo AI</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Main panel */}
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10, color: 'var(--text-muted)' }}>
              Paste WhatsApp message, SMS, email, or describe what you received:
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. 'Dear user, your account will be blocked. Click here to update KYC: bit.ly/...'"
              rows={5}
              style={{
                width: '100%', background: 'var(--surface-3)',
                border: '1px solid var(--border)', borderRadius: 10,
                color: 'var(--text)', fontSize: 14, padding: '12px 14px',
                outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', alignSelf: 'center' }}>Try example:</span>
              {examples.map(ex => (
                <button key={ex.label} onClick={() => { setInput(ex.text); analyze(ex.text); }} style={{
                  padding: '4px 12px', borderRadius: 99,
                  background: 'var(--surface-3)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
                }}>{ex.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              <button
                onClick={() => {
                  setInput("Dear customer, your SBI account will be blocked today. Update KYC via this link immediately: http://sbi-update-kyc.in");
                  analyze("Dear customer, your SBI account will be blocked today. Update KYC via this link immediately: http://sbi-update-kyc.in");
                }}
                style={{
                  flex: 1, padding: '13px',
                  background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 12,
                  color: 'var(--text)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                <AlertTriangle size={18} /> Upload Image (Demo)
              </button>
              
              <button
                onClick={() => analyze()}
                disabled={!input.trim() || loading}
                style={{
                  flex: 2, padding: '13px',
                  background: loading || !input.trim() ? 'var(--surface-3)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none', borderRadius: 12,
                  color: loading || !input.trim() ? 'var(--text-dim)' : 'white',
                  fontWeight: 600, fontSize: 15, cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: input.trim() && !loading ? '0 0 20px rgba(239,68,68,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {loading
                  ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
                  : <><ShieldAlert size={18} /> Analyze for Scam</>}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ padding: 22, background: verdictConfig[result.verdict].bg, border: `1px solid ${verdictConfig[result.verdict].border}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: verdictConfig[result.verdict].color, marginBottom: 4 }}>
                      {verdictConfig[result.verdict].label}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Risk probability: <strong style={{ color: verdictConfig[result.verdict].color }}>{result.probability}%</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 70, height: 70, borderRadius: '50%',
                      background: `conic-gradient(${verdictConfig[result.verdict].color} ${result.probability * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: verdictConfig[result.verdict].color }}>{result.probability}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>Why we think this</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.reasons.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: verdictConfig[result.verdict].color, fontSize: 14, marginTop: 1 }}>•</span>
                        <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.redFlags.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>Red Flags</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {result.redFlags.map((f, i) => <span key={i} className="badge badge-red">{f}</span>)}
                    </div>
                  </div>
                )}

                <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, borderLeft: `3px solid ${verdictConfig[result.verdict].color}` }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4, fontWeight: 600 }}>WHAT TO DO</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{result.action}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Protection Stats</div>
            {[
              { label: 'Scams caught', value: '2.3M+', color: '#ef4444' },
              { label: 'Money saved', value: '₹840Cr+', color: '#10b981' },
              { label: 'Accuracy', value: '97.2%', color: '#3b82f6' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
                <span className="font-display" style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Top Scams in India</div>
            {[
              { name: 'Fake KYC Update', risk: 'Very High' },
              { name: 'UPI Prize Money', risk: 'Very High' },
              { name: 'Investment Doubling', risk: 'High' },
              { name: 'Fake Job Offers', risk: 'High' },
              { name: 'OTP Fraud', risk: 'Very High' },
            ].map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text)' }}>{s.name}</span>
                <span className="badge badge-red" style={{ fontSize: 10 }}>{s.risk}</span>
              </div>
            ))}
          </div>

          {history.length > 0 && (
            <div className="card" style={{ padding: 18 }}>
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Checks</div>
              {history.map((h, i) => (
                <div key={i} style={{
                  padding: '8px 0', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
                }} onClick={() => setResult(h.result)}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: verdictConfig[h.result.verdict].color }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.text.slice(0, 35)}...
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
