import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RefreshCw, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

import { generateFinancialResponse } from '../utils/demoAI';

const suggestions = [
  'What is SIP?',
  'How much emergency fund should I keep?',
  'How does 80C work?',
  'How to improve credit score?',
  'What insurance should a beginner buy?',
];

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Namaste! 🙏 I'm your ArthSaathi AI Coach. I can help you understand finance, plan budgets, explain investments, and answer any money question — all in simple terms.\n\nWhat would you like to learn today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text?: string) {
    const query = text || input.trim();
    if (!query || loading) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    const loadingMsg: Message = { id: 'loading', role: 'assistant', content: '', loading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    // Simulate local model response delay
    setTimeout(() => {
      const reply = generateFinancialResponse(query);
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'loading'),
        { id: Date.now().toString(), role: 'assistant', content: reply },
      ]);
      setLoading(false);
    }, 600);
  }


  return (
    <div style={{ height: 'calc(100vh - 108px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>AI Financial Coach</h1>
            <span className="badge badge-green" style={{ fontSize: 11, padding: '3px 8px', fontWeight: 600 }}>Demo AI</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Runs completely offline · Client-side rule engine</p>
        </div>
        <button
          onClick={() => setMessages([{ id: '0', role: 'assistant', content: "Namaste! 🙏 I'm your ArthSaathi AI Coach. Fresh conversation started. What would you like to know?" }])}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 9,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13,
          }}
        >
          <RefreshCw size={14} /> New Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 4 }}>
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-start' }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={15} color="white" />
                </div>
              )}
              <div style={{ maxWidth: '72%' }}>
                {msg.loading ? (
                  <div className="bubble-ai" style={{ padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.8 }}
                        style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-dim)' }}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}
                    style={{ padding: '12px 16px', fontSize: 14, lineHeight: 1.65 }}
                  >
                    {msg.content.split('\n').map((line, i) => {
                      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      });
                      return <div key={i} style={{ minHeight: 4 }}>{parts}</div>;
                    })}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--surface-3)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={15} color="var(--text-muted)" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                padding: '7px 14px', borderRadius: 99,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13,
                transition: 'all 0.15s',
              }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <label style={{
        display: 'flex', gap: 10, alignItems: 'flex-end',
        padding: '14px 16px', cursor: 'text',
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: 14, marginTop: 12,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ask anything about your finances... (Enter to send)"
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: 14, resize: 'none',
            lineHeight: 1.5, maxHeight: 120, fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: input.trim() && !loading ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--surface-3)',
            border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          <Send size={16} color={input.trim() && !loading ? 'white' : 'var(--text-dim)'} />
        </button>
      </label>
    </div>
  );
}
