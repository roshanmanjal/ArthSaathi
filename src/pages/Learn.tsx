import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lessonsData } from '../data/lessonsData';
import { BookOpen, Trophy, Zap, CheckCircle, Clock, ChevronRight, X, Loader2 } from 'lucide-react';
import { useLearning } from '../store/useAppStore';

const quizQuestions = [
  { q: 'What does SIP stand for?', options: ['Systematic Investment Plan', 'Simple Interest Plan', 'Savings Investment Program', 'Standard Income Plan'], answer: 0 },
  { q: 'What is the ideal emergency fund size?', options: ['1 month expenses', '3 months expenses', '6 months expenses', '12 months expenses'], answer: 2 },
  { q: 'PMSBY provides accidental insurance of how much for ₹20/year?', options: ['₹50,000', '₹1 lakh', '₹2 lakh', '₹5 lakh'], answer: 2 },
  { q: 'Which 80C option has the shortest lock-in period?', options: ['PPF (15 years)', 'ELSS Mutual Fund (3 years)', 'NSC (5 years)', 'NPS (till age 60)'], answer: 1 },
  { q: 'To RECEIVE money on a UPI app, you must:', options: ['Enter your UPI PIN', 'Scan a QR code', 'Do nothing (PIN is only to send)', 'Share your bank password'], answer: 2 },
];

const lessonsContentDb: Record<number, string> = {
  1: `**What is a Systematic Investment Plan (SIP)?** 📈

A SIP is a method of investing a fixed sum of money regularly in a mutual fund scheme. It operates similarly to a recurring deposit, but the money is invested in the equity or debt markets.

**Key Learning Points:**
1. **Rupee Cost Averaging**: You buy more mutual fund units when the market price (NAV) is low, and fewer units when the market is high. You don't need to check stock prices daily.
2. **Power of Compounding**: Compounding works like snowballing. The interest you earn also earns interest. The earlier you start, the larger your final wealth will be.
3. **Disciplined Saving**: Setting up an automated auto-debit on salary day forces you save before you spend.

**Summary:**
SIP is the best wealth building tool for retail investors. Start small, stay consistent, and let compounding do the work.

**Action Step:** Set up a monthly SIP of ₹500 in a Nifty 50 Index Fund using any mutual fund app.`,

  2: `**Emergency Fund 101: Your Financial Shield** 🛡️

An emergency fund is a stash of money set aside to cover life's unexpected events, such as job loss, medical emergencies, or major repairs.

**Key Learning Points:**
1. **Target Size**: Aim for 3 to 6 months of your mandatory living expenses (rent, bills, groceries).
2. **Strict Liquidity**: Park it in a separate savings account with a sweep-in facility or a liquid mutual fund. It should be withdrawable in less than 24 hours.
3. **No Risk**: Never invest your emergency fund in stocks or long-term lock-in products. It must not fluctuate in value.

**Summary:**
Without an emergency fund, you'll be forced to take high-interest credit card debt or break your investments when emergencies strike.

**Action Step:** Calculate 6 months of your monthly expenses and start a separate savings bucket for it today.`,

  3: `**How to Read and Improve Your Credit Score** 💳

Your credit score (like CIBIL) is a 3-digit number between 300 and 900 that represents your creditworthiness to lenders. A score above 750 is excellent.

**Key Learning Points:**
1. **Repayment History**: Accounts for 35% of your score. Pay all EMIs and credit card bills on time. A single day's delay can hurt your score.
2. **Credit Utilization Ratio (CUR)**: Keep your total credit card spending below 30% of your maximum limit.
3. **Credit Inquiries**: Don't apply for multiple credit cards or loans simultaneously. It signals desperation to banks.

**Summary:**
A high credit score helps you negotiate lower interest rates on home/car loans, saving you lakhs.

**Action Step:** Download a free credit tracking app (like GPay or OneScore) and check your CIBIL report for errors.`,

  4: `**Term Insurance vs. ULIP: The Golden Rule** 🛡️

The number one rule of insurance is: **Never mix investment and insurance.** Avoid ULIPs (Unit Linked Insurance Plans) and buy term plans instead.

**Key Learning Points:**
1. **Term Insurance**: Pure risk cover. If you pass away during the policy term, your family receives the sum assured. If you survive, you get nothing. Hence, it is very cheap (e.g. ₹1 Cr cover for ~₹10,000/year).
2. **ULIPs / Endowment Plans**: Promise both life insurance and maturity returns. However, they have high agent commissions, lock-ins, and underperform simple indices.
3. **Separate Them**: Buy a cheap term plan for protection, and invest the remaining cash in mutual funds for returns.

**Summary:**
Buy term insurance to protect your family, and invest in index funds to grow your money. Keep them strictly separate.

**Action Step:** Estimate 10x of your annual income and research a pure term plan from Max Life or HDFC Life.`,

  5: `**Tax Saving Under Section 80C** 📋

Section 80C of the Income Tax Act allows taxpayers to claim deductions up to ₹1.5 Lakhs from their taxable income in the Old Tax Regime.

**Key Learning Points:**
1. **ELSS (Equity Linked Savings Scheme)**: Mutual funds with a 3-year lock-in (shortest among all 80C options) and equity-linked returns.
2. **PPF (Public Provident Fund)**: Sovereign-backed, currently pays 7.1% interest. Fully tax-free returns but has a 15-year lock-in.
3. **EPF / NPS**: Employee Provident Fund is automatic. NPS offers an additional ₹50,000 deduction under Sec 80CCD(1B).

**Summary:**
Utilize 80C early in the financial year to prevent last-minute cash crunches. ELSS is ideal for wealth growth, PPF for safe retirement.

**Action Step:** Calculate how much of your ₹1.5L limit is already covered by your EPF salary deductions.`,

  6: `**UPI & Digital Banking Scams to Avoid** 🔐

UPI has revolutionized payments, but scammers use psychological tricks to steal money. Stay vigilant.

**Key Learning Points:**
1. **The Golden Rule**: You **NEVER** need to enter your UPI PIN or scan a QR code to **receive** money. PIN is only for sending money.
2. **KYC Fraud**: Ignore messages saying your SIM card or bank account will be blocked. Banks never ask for critical info via SMS links.
3. **Remote Control Apps**: Never download apps like AnyDesk or TeamViewer on a caller's request. They can see your OTP screen.

**Summary:**
Stay calm. Scammers create artificial urgency to force errors. Terminate suspicious calls immediately.

**Action Step:** Turn on biometrics for your UPI apps and never share OTPs with anyone.`
};

export default function Learn() {
  const { progress, completeLesson, addXP, level, getBadges } = useLearning();

  const [activeLesson, setActiveLesson] = useState<typeof lessonsData[0] | null>(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Compute lesson completion state from store
  const lessons = lessonsData.map(l => ({
    ...l,
    done: progress.completedIds.includes(l.id)
  }));

  const xpTotal = progress.xp;
  const completed = progress.completedIds.length;

  function openLesson(lesson: typeof lessonsData[0]) {
    setActiveLesson(lesson);
    setLessonContent('');
    setLoadingLesson(true);
    
    // Simulate local content fetching delay
    setTimeout(() => {
      setLessonContent(lessonsContentDb[lesson.id] || 'Lesson content is not available.');
      setLoadingLesson(false);
    }, 400);
  }

  function handleCompleteLesson() {
    if (!activeLesson) return;
    completeLesson(activeLesson.id, activeLesson.xp);
    setActiveLesson(null);
  }

  function answerQuiz(idx: number) {
    setSelectedAnswer(idx);
    
    const isCorrect = idx === quizQuestions[quizIdx].answer;
    const currentScore = isCorrect ? quizScore + 1 : quizScore;
    if (isCorrect) setQuizScore(currentScore);

    setTimeout(() => {
      if (quizIdx < quizQuestions.length - 1) {
        setQuizIdx(q => q + 1);
        setSelectedAnswer(null);
      } else {
        // Award XP on quiz completion
        const earnedXP = currentScore * 20;
        addXP(earnedXP);
        setQuizDone(true);
      }
    }, 800);
  }


  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Financial Learning</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Build financial knowledge · Earn XP · Unlock badges</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'XP Earned', value: `${xpTotal} XP`, color: '#f59e0b' },
          { label: 'Lessons Done', value: `${completed}/${lessons.length}`, color: '#10b981' },
          { label: 'Current Level', value: `Level ${level}`, color: '#8b5cf6' },
          { label: 'Day Streak', value: `${progress.streak} 🔥`, color: '#ef4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6 }}>{label}</div>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        <div>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Lessons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lessons.map((lesson, i) => (
              <motion.div key={lesson.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card"
                style={{ padding: '16px 18px', cursor: lesson.done ? 'default' : 'pointer', opacity: lesson.done ? 0.7 : 1 }}
                onClick={() => !lesson.done && openLesson(lesson)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: lesson.done ? 'rgba(16,185,129,0.1)' : 'var(--surface-3)', border: lesson.done ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {lesson.done ? <CheckCircle size={18} color="#10b981" /> : <BookOpen size={18} color="var(--text-dim)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{lesson.title}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-dim)' }}><Clock size={10} /> {lesson.duration}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#f59e0b' }}><Zap size={10} /> +{lesson.xp} XP</span>
                      <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: 'var(--surface-3)', color: 'var(--text-dim)' }}>{lesson.category}</span>
                    </div>
                  </div>
                  {lesson.done ? <span className="badge badge-green" style={{ fontSize: 10 }}>Done ✓</span> : <ChevronRight size={16} color="var(--text-dim)" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 20, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Trophy size={16} color="#f59e0b" />
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>Daily Quiz</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>Test your knowledge and earn bonus XP!</p>
            <button onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizScore(0); setQuizDone(false); setSelectedAnswer(null); }}
              style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: 9, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Start Quiz 🎯
            </button>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Your Badges</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {getBadges().map(b => (
                <div key={b.name} style={{ padding: '8px', borderRadius: 9, textAlign: 'center', background: b.earned ? 'rgba(245,158,11,0.08)' : 'var(--surface-3)', border: b.earned ? '1px solid rgba(245,158,11,0.2)' : '1px solid var(--border)', opacity: b.earned ? 1 : 0.4 }}>
                  <div style={{ fontSize: 22, marginBottom: 3 }}>{b.emoji}</div>
                  <div style={{ fontSize: 10, color: b.earned ? '#f59e0b' : 'var(--text-dim)', fontWeight: 500 }}>{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson modal */}
      <AnimatePresence>
        {activeLesson && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="card" style={{ width: 580, maxHeight: '80vh', overflow: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>{activeLesson.title}</div>
                  <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 3 }}>+{activeLesson.xp} XP on completion</div>
                </div>
                <button onClick={() => setActiveLesson(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--text-muted)" /></button>
              </div>
              {loadingLesson ? (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block' }} />
                  <div>Loading lesson...</div>
                </div>
              ) : (
                <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text)', marginBottom: 20 }}>{lessonContent}</div>
              )}
              {!loadingLesson && lessonContent && (
                <button onClick={handleCompleteLesson} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  ✅ Mark Complete (+{activeLesson.xp} XP)
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz modal */}
      <AnimatePresence>
        {quizActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card" style={{ width: 480, padding: 28 }}>
              {quizDone ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{quizScore === quizQuestions.length ? '🏆' : quizScore >= 2 ? '⭐' : '📚'}</div>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{quizScore} / {quizQuestions.length} correct!</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>You earned <strong style={{ color: '#f59e0b' }}>{quizScore * 20} XP</strong></div>
                  <button onClick={() => setQuizActive(false)} style={{ padding: '12px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Done</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>Question {quizIdx + 1} of {quizQuestions.length}</div>
                    <button onClick={() => setQuizActive(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="var(--text-muted)" /></button>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, lineHeight: 1.4 }}>{quizQuestions[quizIdx].q}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {quizQuestions[quizIdx].options.map((opt, i) => {
                      const isCorrect = selectedAnswer !== null && i === quizQuestions[quizIdx].answer;
                      const isWrong = selectedAnswer === i && i !== quizQuestions[quizIdx].answer;
                      return (
                        <button key={i} onClick={() => selectedAnswer === null && answerQuiz(i)}
                          style={{ padding: '12px 16px', borderRadius: 10, textAlign: 'left', background: isCorrect ? 'rgba(16,185,129,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : 'var(--surface-3)', border: isCorrect ? '1px solid rgba(16,185,129,0.3)' : isWrong ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border)', color: isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'var(--text)', fontSize: 14, cursor: selectedAnswer === null ? 'pointer' : 'default', transition: 'all 0.2s' }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
