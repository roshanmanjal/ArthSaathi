import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { schemesData } from '../data/schemesData';
import { Sparkles, Loader2, CheckCircle, Zap, X } from 'lucide-react';
import { useProfile } from '../store/useAppStore';

const categories = ['All', 'Banking', 'Savings', 'Pension', 'Insurance', 'Loan', 'Agriculture'];

const tagColors: Record<string, string> = {
  Popular: 'badge-green',
  'High Returns': 'badge-gold',
  Retirement: 'badge-blue',
  Business: 'badge-blue',
  Farmers: 'badge-green',
  'Must Have': 'badge-red',
};

const schemesDetails: Record<string, { apply: string; details: string }> = {
  'PM Jan Dhan Yojana': {
    apply: '1. Visit your nearest Public Sector Bank or authorized private bank.\n2. Request a PMJDY account opening form.\n3. Submit Aadhaar Card, Passport photos, and address proof.\n4. Receive your RuPay debit card with built-in ₹2 Lakh accidental insurance.',
    details: "Pradhan Mantri Jan Dhan Yojana (PMJDY) is India's national mission for financial inclusion. It ensures access to financial services like savings bank accounts, remittances, credit, insurance, and pensions at affordable rates. Accounts can be opened with zero balance. Key perks include overdraft up to ₹10,000 and mobile banking access.",
  },
  'Sukanya Samriddhi Yojana': {
    apply: "1. Visit any Post Office or commercial bank branch.\n2. Complete the SSY account opening form.\n3. Submit the girl child's birth certificate, along with parent's KYC (Aadhaar & PAN).\n4. Make the initial deposit (minimum ₹250).",
    details: 'Sukanya Samriddhi Yojana (SSY) is a savings scheme launched under the "Beti Bachao Beti Padhao" campaign. It offers an exceptionally high tax-free interest rate (currently 8.2% p.a.) and qualifies for Section 80C deductions. The account matures after 21 years or upon marriage after the girl turns 18.',
  },
  'Atal Pension Yojana': {
    apply: '1. Visit the bank branch where you hold a savings account.\n2. Fill out the APY enrollment form.\n3. Choose your desired pension amount (₹1,000 to ₹5,000/month).\n4. Provide consent for monthly auto-debits from your account.',
    details: 'Atal Pension Yojana (APY) is a government pension scheme targeting workers in the unorganized sector. Subscribers receive a guaranteed minimum pension after age 60. Monthly premium contributions depend on age at entry and chosen pension amount.',
  },
  'PM Mudra Yojana': {
    apply: '1. Prepare a business proposal showing capital requirements.\n2. Visit any public/private bank, micro-finance institution, or apply online on the UdyamiMitra portal.\n3. Fill the Mudra application form and submit identity, business address, and collateral-free loan documents.',
    details: 'Pradhan Mantri MUDRA Yojana (PMMY) provides collateral-free loans up to ₹10 Lakhs to micro-enterprises and startup businesses. Loans are structured into Shishu (up to ₹50,000), Kishor (₹50,000 to ₹5 Lakhs), and Tarun (₹5 Lakhs to ₹10 Lakhs) categories.',
  },
  'PM Kisan Samman Nidhi': {
    apply: '1. Open the official PM-Kisan portal (pmkisan.gov.in) or visit your village Lekhpal/CSC.\n2. Provide land ownership documents, Aadhaar details, and bank account number.\n3. Submit verification details for automated direct transfers.',
    details: 'PM Kisan is a central sector scheme that provides income support of ₹6,000 per year in three equal installments to all landholding farmer families across India. The cash is transferred directly into their bank accounts.',
  },
  'PMSBY Accident Insurance': {
    apply: "1. Log into your bank's internet banking portal or mobile app.\n2. Search for \"PMSBY\" or \"Social Security Schemes\".\n3. Select your savings bank account and click \"Enroll\". Confirm the annual ₹20 auto-debit consent.",
    details: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY) offers high-value accidental death and disability cover for a nominal premium of ₹20 per year. In case of accidental death or total disability, the nominee receives ₹2 Lakhs. Partial disability cover is ₹1 Lakh.',
  },
};

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

export default function Schemes() {
  const { profile: userProfile } = useProfile();
  const [selected, setSelected] = useState('All');
  const [finderProfile, setFinderProfile] = useState({
    age: userProfile.age || '',
    occupation: userProfile.occupation || '',
    income: userProfile.income || '',
  });
  const [aiSchemes, setAiSchemes] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalScheme, setModalScheme] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'apply' | 'details'>('apply');

  const filtered = selected === 'All' ? schemesData : schemesData.filter(s => s.category === selected);

  function findSchemes() {
    if (!finderProfile.age || !finderProfile.occupation) return;
    setLoading(true);

    setTimeout(() => {
      const ageNum = parseInt(finderProfile.age) || 28;
      const incNum = parseInt(finderProfile.income) || 25000;
      const occ = finderProfile.occupation.toLowerCase();

      const matched: string[] = [];

      if (incNum <= 30000 || occ.includes('farmer') || occ.includes('labor') || occ.includes('gig') || occ.includes('domestic')) {
        matched.push('• PM Jan Dhan Yojana — Open a zero-balance account for free banking & ₹2L accident cover.');
      }
      if (ageNum >= 18 && ageNum <= 40) {
        matched.push('• Atal Pension Yojana — Secure guaranteed pension of up to ₹5,000/month after age 60.');
      }
      if (occ.includes('business') || occ.includes('shop') || occ.includes('startup') || occ.includes('gig') || occ.includes('self')) {
        matched.push('• PM Mudra Yojana — Get collateral-free business loans up to ₹10 Lakhs.');
      }
      if (occ.includes('farmer') || occ.includes('agricultur') || occ.includes('kisan')) {
        matched.push('• PM Kisan Samman Nidhi — Claim direct income support of ₹6,000 annually.');
      }
      if (ageNum >= 18 && ageNum <= 70) {
        matched.push('• PMSBY Accident Insurance — ₹2 Lakh accident cover for just ₹20/year.');
      }
      if (ageNum >= 20 && ageNum <= 50) {
        matched.push('• Sukanya Samriddhi Yojana — High-yield tax-free savings at 8.2% for your daughter.');
      }

      if (matched.length === 0) {
        matched.push('• PMSBY Accident Insurance — Accidental cover for ₹20/year (universal eligibility).');
        matched.push('• PM Jan Dhan Yojana — Zero-balance basic banking account.');
      }

      setAiSchemes(`✅ Based on your profile, you may be eligible for:\n\n${matched.join('\n\n')}`);
      setLoading(false);
    }, 700);
  }

  const modalData = modalScheme ? schemesDetails[modalScheme] : null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Government Schemes</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Find schemes you're eligible for · ₹1000s in free benefits waiting for you</p>
        </div>
        <DemoBadge />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left — scheme list */}
        <div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setSelected(c)} style={{
                padding: '6px 16px', borderRadius: 99,
                background: selected === c ? 'rgba(16,185,129,0.12)' : 'var(--surface-2)',
                border: selected === c ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
                color: selected === c ? '#10b981' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
              }}>
                {c}
              </button>
            ))}
          </div>

          {/* Scheme cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((scheme, i) => (
              <motion.div key={scheme.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>{scheme.name}</div>
                      <span className={`badge ${tagColors[scheme.tag] || 'badge-blue'}`}>{scheme.tag}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>{scheme.benefit}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle size={12} color="#10b981" />
                      <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Eligibility: {scheme.eligibility}</span>
                    </div>
                  </div>
                  <div style={{ padding: '6px 12px', borderRadius: 99, background: 'var(--surface-3)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-dim)', flexShrink: 0 }}>
                    {scheme.category}
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { setModalScheme(scheme.name); setModalTab('apply'); }}
                    style={{ flex: 1, padding: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, color: '#10b981', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    How to Apply
                  </button>
                  <button
                    onClick={() => { setModalScheme(scheme.name); setModalTab('details'); }}
                    style={{ flex: 1, padding: '8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — AI Finder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Sparkles size={16} color="#10b981" />
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600 }}>AI Scheme Finder</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <DemoBadge />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              Tell us about yourself and we'll find schemes you're eligible for right now.
            </p>
            {[
              { label: 'Your Age', key: 'age', placeholder: 'e.g. 28' },
              { label: 'Occupation', key: 'occupation', placeholder: 'e.g. Farmer, Student, Salaried' },
              { label: 'Monthly Income (₹)', key: 'income', placeholder: 'e.g. 25000' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 5 }}>{label}</div>
                <input
                  value={(finderProfile as Record<string, string>)[key]}
                  onChange={e => setFinderProfile(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <button
              onClick={findSchemes}
              disabled={!finderProfile.age || !finderProfile.occupation || loading}
              style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 9, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: !finderProfile.age || !finderProfile.occupation ? 0.6 : 1 }}
            >
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Finding...</> : '🔍 Find My Schemes'}
            </button>
            {aiSchemes && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 16, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 9, padding: '12px 14px', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
                {aiSchemes}
              </motion.div>
            )}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>💡 Did you know?</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Over <strong style={{ color: '#f59e0b' }}>50 crore Indians</strong> are eligible for PMSBY — accident insurance for just ₹20/year — but most don't know about it.
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalScheme && modalData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => setModalScheme(null)}>
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>{modalScheme}</div>
                <button onClick={() => setModalScheme(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={18} color="var(--text-dim)" />
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {(['apply', 'details'] as const).map(tab => (
                  <button key={tab} onClick={() => setModalTab(tab)}
                    style={{ padding: '7px 18px', borderRadius: 99, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: modalTab === tab ? 'rgba(16,185,129,0.12)' : 'var(--surface-2)', borderColor: modalTab === tab ? 'rgba(16,185,129,0.3)' : 'var(--border)', color: modalTab === tab ? '#10b981' : 'var(--text-muted)' }}>
                    {tab === 'apply' ? '📋 How to Apply' : '📖 Details'}
                  </button>
                ))}
              </div>

              <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '16px', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-line', color: 'var(--text)' }}>
                {modalTab === 'apply' ? modalData.apply : modalData.details}
              </div>

              {modalTab === 'apply' && (
                <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', fontSize: 12, color: '#3b82f6' }}>
                  💡 Tip: Carry original and photocopies of all documents when visiting the bank or post office.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
