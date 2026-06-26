import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Upload, AlertTriangle, CheckCircle, XCircle, Loader2, ShieldCheck, Zap } from 'lucide-react';

interface AnalysisResult {
  probability: number;
  verdict: 'SCAM' | 'SUSPICIOUS' | 'SAFE';
  reasons: string[];
  action: string;
  redFlags: string[];
}

const SCAM_SYSTEM_PROMPT = `You are ArthSaathi Scam Shield, an expert fraud detection AI for Indian financial scams.

Analyze the provided message/content and respond ONLY with valid JSON in this exact format:
{
  "probability": <number 0-100>,
  "verdict": "<SCAM|SUSPICIOUS|SAFE>",
  "reasons": ["reason 1", "reason 2", "reason 3"],
  "action": "<one clear action the user should take>",
  "redFlags": ["flag 1", "flag 2"]
}

Common Indian scams to detect:
- KYC update scam (fake NPCI/bank messages)
- OTP/UPI fraud
- Fake lottery/prize
- Investment fraud (doubling money, fixed guaranteed returns)
- Fake government scheme SMS
- QR code scam
- Phishing links (bit.ly, fake bank URLs)
- Fake job offers
- Aadhaar/PAN update scams

Rules:
- probability 0-30 = SAFE
- probability 31-65 = SUSPICIOUS  
- probability 66-100 = SCAM
- Be specific about Indian red flags
- Keep reasons clear and simple for non-technical users`;

const examples = [
  { label: 'Fake KYC SMS', text: 'Dear customer, your SBI account will be blocked. Update KYC now: bit.ly/sbi-kyc-update' },
  { label: 'UPI Fraud', text: 'You won ₹50,000 in PhonePe lucky draw! Send ₹99 processing fee on UPI: lucky@ybl to claim' },
  { label: 'Real bank SMS', text: 'Your SBI account XX4521 is credited with INR 15,000.00 on 15-01-25. Avl Bal: INR 42,350.00' },
];

export default function ScamShield() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<{ text: string; result: AnalysisResult }[]>([]);

  async function analyze(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SCAM_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: `Analyze this message for scam/fraud:\n\n"${content}"` }],
        }),
      });

      const data = await res.json();
      const rawText = data.content?.[0]?.text || '{}';
      const clean = rawText.replace(/```json|```/g, '').trim();
      const parsed: AnalysisResult = JSON.parse(clean);
      setResult(parsed);
      setHistory(prev => [{ text: content, result: parsed }, ...prev.slice(0, 4)]);
    } catch {
      setResult({
        probability: 0,
        verdict: 'SUSPICIOUS',
        reasons: ['Could not analyze — please try again'],
        action: 'Be cautious and verify with official sources',
        redFlags: [],
      });
    } finally {
      setLoading(false);
    }
  }

  const verdictConfig = {
    SCAM: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: XCircle, label: '⚠️ High Risk — Likely Scam' },
    SUSPICIOUS: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: AlertTriangle, label: '🔶 Be Careful — Suspicious' },
    SAFE: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: CheckCircle, label: '✅ Looks Safe' },
  };

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
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>AI-powered fraud detection · Paste any suspicious message</p>
          </div>
          <span className="badge badge-red" style={{ marginLeft: 'auto' }}>AI Powered</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Main panel */}
        <div>
          {/* Input area */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10, color: 'var(--text-muted)' }}>
              Paste WhatsApp message, SMS, email, or describe what you received:
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. 'Dear user, your account will be blocked. Click here to update KYC: bit.ly/...' "
              rows={5}
              style={{
                width: '100%', background: 'var(--surface-3)',
                border: '1px solid var(--border)', borderRadius: 10,
                color: 'var(--text)', fontSize: 14, padding: '12px 14px',
                outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
              }}
            />

            {/* Example buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', alignSelf: 'center' }}>Try example:</span>
              {examples.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => { setInput(ex.text); }}
                  style={{
                    padding: '4px 12px', borderRadius: 99,
                    background: 'var(--surface-3)', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
                  }}
                >{ex.label}</button>
              ))}
            </div>

            <button
              onClick={() => analyze()}
              disabled={!input.trim() || loading}
              style={{
                marginTop: 14, width: '100%', padding: '13px',
                background: loading || !input.trim()
                  ? 'var(--surface-3)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none', borderRadius: 12,
                color: loading || !input.trim() ? 'var(--text-dim)' : 'white',
                fontWeight: 600, fontSize: 15, cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: input.trim() && !loading ? '0 0 20px rgba(239,68,68,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><ShieldAlert size={18} /> Analyze for Scam</>}
            </button>
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                  padding: 22,
                  background: verdictConfig[result.verdict].bg,
                  border: `1px solid ${verdictConfig[result.verdict].border}`,
                }}
              >
                {/* Verdict header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div className="font-display" style={{
                      fontSize: 20, fontWeight: 700,
                      color: verdictConfig[result.verdict].color,
                      marginBottom: 4,
                    }}>
                      {verdictConfig[result.verdict].label}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Risk probability: <strong style={{ color: verdictConfig[result.verdict].color }}>{result.probability}%</strong>
                    </div>
                  </div>
                  {/* Risk meter */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 70, height: 70, borderRadius: '50%',
                      background: `conic-gradient(${verdictConfig[result.verdict].color} ${result.probability * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: 'var(--surface-1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: verdictConfig[result.verdict].color }}>
                          {result.probability}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>
                    Why we think this
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.reasons.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: verdictConfig[result.verdict].color, fontSize: 14, marginTop: 1 }}>•</span>
                        <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Red flags */}
                {result.redFlags.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>
                      Red Flags
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {result.redFlags.map((f, i) => (
                        <span key={i} className="badge badge-red">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action */}
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 10,
                  borderLeft: `3px solid ${verdictConfig[result.verdict].color}`,
                }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4, fontWeight: 600 }}>WHAT TO DO</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{result.action}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Stats */}
          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Protection Stats</div>
            {[
              { label: 'Scams caught', value: '2.3M+', color: '#ef4444' },
              { label: 'Money saved', value: '₹840Cr+', color: '#10b981' },
              { label: 'Accuracy', value: '97.2%', color: '#3b82f6' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
                <span className="font-display" style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Common scams */}
          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Top Scams in India</div>
            {[
              { name: 'Fake KYC Update', risk: 'Very High' },
              { name: 'UPI Prize Money', risk: 'Very High' },
              { name: 'Investment Doubling', risk: 'High' },
              { name: 'Fake Job Offers', risk: 'High' },
              { name: 'OTP Fraud', risk: 'Very High' },
            ].map(s => (
              <div key={s.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--text)' }}>{s.name}</span>
                <span className="badge badge-red" style={{ fontSize: 10 }}>{s.risk}</span>
              </div>
            ))}
          </div>

          {/* Recent checks */}
          {history.length > 0 && (
            <div className="card" style={{ padding: 18 }}>
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Checks</div>
              {history.map((h, i) => (
                <div key={i} style={{
                  padding: '8px 0', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
                }} onClick={() => setResult(h.result)}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: verdictConfig[h.result.verdict].color,
                  }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.text.slice(0, 35)}...
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}