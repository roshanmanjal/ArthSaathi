import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockLessons } from '../data/mock';
import { BookOpen, Trophy, Zap, CheckCircle, Clock, ChevronRight, X, Loader2 } from 'lucide-react';

const quizQuestions = [
  {
    q: 'What does SIP stand for?',
    options: ['Systematic Investment Plan', 'Simple Interest Plan', 'Savings Investment Program', 'Standard Income Plan'],
    answer: 0,
  },
  {
    q: 'What is the ideal emergency fund size?',
    options: ['1 month expenses', '3 months expenses', '6 months expenses', '12 months expenses'],
    answer: 2,
  },
  {
    q: 'PMSBY provides accidental insurance of how much for ₹20/year?',
    options: ['₹50,000', '₹1 lakh', '₹2 lakh', '₹5 lakh'],
    answer: 2,
  },
];

export default function Learn() {
  const [lessons, setLessons] = useState(mockLessons);
  const [activeLesson, setActiveLesson] = useState<typeof mockLessons[0] | null>(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const xpTotal = lessons.filter(l => l.done).reduce((s, l) => s + l.xp, 0);
  const totalXP = lessons.reduce((s, l) => s + l.xp, 0);
  const completed = lessons.filter(l => l.done).length;

  async function openLesson(lesson: typeof mockLessons[0]) {
    setActiveLesson(lesson);
    setLessonContent('');
    setLoadingLesson(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: 'You are a friendly financial educator for Indians. Explain concepts simply, like explaining to a 22-year-old. Use ₹ and Indian examples. Include a practical tip at the end.',
          messages: [{ role: 'user', content: `Teach me: "${lesson.title}" in ${lesson.duration}. Make it engaging, practical, and Indian-context focused. Include 3-4 key points and 1 actionable step.` }],
        }),
      });
      const data = await res.json();
      setLessonContent(data.content?.[0]?.text || '');
    } catch {
      setLessonContent('Could not load lesson content. Please check your connection and try again.');
    } finally {
      setLoadingLesson(false);
    }
  }

  function completeLesson() {
    if (!activeLesson) return;
    setLessons(prev => prev.map(l => l.id === activeLesson.id ? { ...l, done: true } : l));
    setActiveLesson(null);
  }

  function answerQuiz(idx: number) {
    setSelectedAnswer(idx);
    setTimeout(() => {
      if (idx === quizQuestions[quizIdx].answer) setQuizScore(s => s + 1);
      if (quizIdx < quizQuestions.length - 1) {
        setQuizIdx(q => q + 1);
        setSelectedAnswer(null);
      } else {
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

      {/* Progress stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'XP Earned', value: `${xpTotal}`, suffix: ' XP', color: '#f59e0b' },
          { label: 'Lessons Done', value: `${completed}/${lessons.length}`, color: '#10b981' },
          { label: 'Current Level', value: 'Level 3', color: '#8b5cf6' },
          { label: 'Day Streak', value: '7 🔥', color: '#ef4444' },
        ].map(({ label, value, suffix = '', color }) => (
          <div key={label} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6 }}>{label}</div>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color }}>{value}{suffix}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Lessons */}
        <div>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Lessons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card"
                style={{
                  padding: '16px 18px', cursor: 'pointer',
                  opacity: lesson.done ? 0.7 : 1,
                }}
                onClick={() => !lesson.done && openLesson(lesson)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: lesson.done ? 'rgba(16,185,129,0.1)' : 'var(--surface-3)',
                    border: lesson.done ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {lesson.done ? <CheckCircle size={18} color="#10b981" /> : <BookOpen size={18} color="var(--text-dim)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{lesson.title}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-dim)' }}>
                        <Clock size={10} /> {lesson.duration}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#f59e0b' }}>
                        <Zap size={10} /> +{lesson.xp} XP
                      </span>
                      <span style={{
                        fontSize: 10, padding: '1px 7px', borderRadius: 99,
                        background: 'var(--surface-3)', color: 'var(--text-dim)',
                      }}>{lesson.category}</span>
                    </div>
                  </div>
                  {lesson.done
                    ? <span className="badge badge-green" style={{ fontSize: 10 }}>Done ✓</span>
                    : <ChevronRight size={16} color="var(--text-dim)" />
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Quiz card */}
          <div className="card" style={{ padding: 20, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Trophy size={16} color="#f59e0b" />
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>Daily Quiz</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
              Test your knowledge and earn bonus XP!
            </p>
            <button
              onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizScore(0); setQuizDone(false); setSelectedAnswer(null); }}
              style={{
                width: '100%', padding: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none', borderRadius: 9,
                color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >Start Quiz 🎯</button>
          </div>

          {/* Badges */}
          <div className="card" style={{ padding: 18 }}>
            <div className="font-display" style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Your Badges</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { emoji: '🎯', name: 'First Goal', earned: true },
                { emoji: '🛡️', name: 'Scam Free', earned: true },
                { emoji: '📊', name: 'Budgeter', earned: true },
                { emoji: '🔥', name: '7 Day Streak', earned: true },
                { emoji: '📚', name: 'Scholar', earned: false },
                { emoji: '💎', name: 'Expert', earned: false },
              ].map(b => (
                <div key={b.name} style={{
                  padding: '8px', borderRadius: 9, textAlign: 'center',
                  background: b.earned ? 'rgba(245,158,11,0.08)' : 'var(--surface-3)',
                  border: b.earned ? '1px solid rgba(245,158,11,0.2)' : '1px solid var(--border)',
                  opacity: b.earned ? 1 : 0.4,
                }}>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 200,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="card"
              style={{ width: 580, maxHeight: '80vh', overflow: 'auto', padding: 28 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>{activeLesson.title}</div>
                  <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 3 }}>+{activeLesson.xp} XP on completion</div>
                </div>
                <button onClick={() => setActiveLesson(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} color="var(--text-muted)" />
                </button>
              </div>

              {loadingLesson ? (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
                  <div>Loading lesson...</div>
                </div>
              ) : (
                <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text)', marginBottom: 20 }}>
                  {lessonContent}
                </div>
              )}

              {!loadingLesson && lessonContent && (
                <button
                  onClick={completeLesson}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none', borderRadius: 10,
                    color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  }}
                >✅ Mark Complete (+{activeLesson.xp} XP)</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz modal */}
      <AnimatePresence>
        {quizActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 200,
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="card"
              style={{ width: 480, padding: 28 }}
            >
              {quizDone ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{quizScore === quizQuestions.length ? '🏆' : quizScore >= 2 ? '⭐' : '📚'}</div>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                    {quizScore} / {quizQuestions.length} correct!
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                    You earned <strong style={{ color: '#f59e0b' }}>{quizScore * 20} XP</strong>
                  </div>
                  <button
                    onClick={() => setQuizActive(false)}
                    style={{
                      padding: '12px 28px', borderRadius: 10,
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    }}
                  >Done</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>
                      Question {quizIdx + 1} of {quizQuestions.length}
                    </div>
                    <button onClick={() => setQuizActive(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={18} color="var(--text-muted)" />
                    </button>
                  </div>

                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, lineHeight: 1.4 }}>
                    {quizQuestions[quizIdx].q}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {quizQuestions[quizIdx].options.map((opt, i) => {
                      const isCorrect = selectedAnswer !== null && i === quizQuestions[quizIdx].answer;
                      const isWrong = selectedAnswer === i && i !== quizQuestions[quizIdx].answer;
                      return (
                        <button
                          key={i}
                          onClick={() => selectedAnswer === null && answerQuiz(i)}
                          style={{
                            padding: '12px 16px', borderRadius: 10, textAlign: 'left',
                            background: isCorrect ? 'rgba(16,185,129,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : 'var(--surface-3)',
                            border: isCorrect ? '1px solid rgba(16,185,129,0.3)' : isWrong ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border)',
                            color: isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'var(--text)',
                            fontSize: 14, cursor: selectedAnswer === null ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                          }}
                        >{opt}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}