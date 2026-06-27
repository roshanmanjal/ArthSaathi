import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, ChevronRight, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { MockDB } from '../utils/mockDB';

interface GoogleJwtPayload {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export default function Landing() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  // @ts-ignore
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const hasValidClientId = Boolean(
    clientId && 
    clientId !== 'missing-client-id.apps.googleusercontent.com' && 
    !clientId.includes('YOUR') && 
    clientId.trim() !== ''
  );

  // Auth state: 'start' | 'email-signin' | 'email-signup' | 'forgot-password'
  // If no Client ID is provided, automatically fall back to email login to prevent blocking the user
  const [authState, setAuthState] = useState<'start'|'email-signin'|'email-signup'|'forgot-password'>(hasValidClientId ? 'start' : 'email-signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsAuthLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
      const email = decoded.email;
      
      const existingUser = MockDB.getUserByEmail(email);
      if (existingUser) {
        MockDB.restoreSessionSnapshots(email);
        signIn(existingUser as any);
        if (existingUser.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        const newUser = MockDB.createUser({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          avatar: decoded.picture,
          provider: 'google',
        });
        signIn(newUser as any);
        navigate('/onboarding');
      }
    }
    setIsAuthLoading(false);
  };

  const handleGoogleError = () => {
    setAuthState('email-signin');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    const existingUser = MockDB.getUserByEmail(email);
    
    if (authState === 'email-signin') {
      if (existingUser) {
        MockDB.restoreSessionSnapshots(email);
        signIn(existingUser as any);
        if (existingUser.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        // Fallback for demo: auto-create if they try to sign in and don't exist
        const newUser = MockDB.createUser({ id: `usr_${Date.now()}`, email, provider: 'email' });
        signIn(newUser as any);
        navigate('/onboarding');
      }
    } else if (authState === 'email-signup') {
      if (existingUser) {
        alert('User already exists! Please sign in.');
      } else {
        const newUser = MockDB.createUser({ id: `usr_${Date.now()}`, email, name, provider: 'email' });
        signIn(newUser as any);
        navigate('/onboarding');
      }
    }

  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: 24, overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: 1000, minHeight: 600, background: '#0a0a0a', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
      
      {/* LEFT SIDE - Animated Branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '60px', position: 'relative', overflow: 'hidden' }}>
        {/* Animated Background Gradients */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(0, 200, 83, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(20, 255, 114, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
        
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 80 }}>
          <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} color="#000" fill="#000" />
          </div>
          <span className="font-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>ArthSathi</span>
        </div>

        <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 500 }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Your <span style={{ color: 'var(--primary)' }}>AI Financial</span> Companion
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 48 }}>
            Experience the future of personal finance. Master your budget, grow your savings, and track your goals with intelligent, automated insights.
          </motion.p>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ display: 'flex', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-dim)' }}><BarChart3 size={20} color="var(--primary)" /> Smart Analytics</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-dim)' }}><TrendingUp size={20} color="var(--primary)" /> Goal Tracking</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-dim)' }}><ShieldCheck size={20} color="var(--primary)" /> Bank Grade</div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Card */}
      <div style={{ width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid var(--border)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '100%', maxWidth: 440, padding: 40, position: 'relative', overflow: 'hidden' }}>
          
          <AnimatePresence mode="wait">
            {/* START STATE */}
            {authState === 'start' && (
              <motion.div key="start" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Sign in to continue to ArthSathi</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      shape="pill"
                      size="large"
                      width="100%"
                      theme="outline"
                      text="continue_with"
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>

                  <button onClick={() => setAuthState('email-signin')} className="btn-secondary" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <Mail size={18} /> Continue with Email
                  </button>
                </div>
              </motion.div>
            )}

            {/* EMAIL SIGN IN */}
            {authState === 'email-signin' && (
              <motion.div key="signin" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {hasValidClientId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAuthState('start')}>
                    <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back
                  </div>
                )}
                <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Sign in with Email</h2>
                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Email</label>
                    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: 15 }} placeholder="you@example.com" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Password</label>
                      <span onClick={() => setAuthState('forgot-password')} style={{ fontSize: 12, color: 'var(--primary)', cursor: 'pointer' }}>Forgot?</span>
                    </div>
                    <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: 15 }} placeholder="••••••••" />
                  </div>
                  <button type="submit" disabled={isAuthLoading} className="btn-primary" style={{ padding: '14px', marginTop: 8, opacity: isAuthLoading ? 0.7 : 1 }}>
                    {isAuthLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
                  Don't have an account? <span onClick={() => setAuthState('email-signup')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Create one</span>
                </div>
              </motion.div>
            )}

            {/* EMAIL SIGN UP */}
            {authState === 'email-signup' && (
              <motion.div key="signup" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {hasValidClientId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAuthState('start')}>
                    <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back
                  </div>
                )}
                <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Create Account</h2>
                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
                    <input type="text" required value={name} onChange={e=>setName(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: 15 }} placeholder="John Doe" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Email</label>
                    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: 15 }} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Password</label>
                    <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: 15 }} placeholder="••••••••" />
                  </div>
                  <button type="submit" disabled={isAuthLoading} className="btn-primary" style={{ padding: '14px', marginTop: 8, opacity: isAuthLoading ? 0.7 : 1 }}>
                    {isAuthLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
                  Already have an account? <span onClick={() => setAuthState('email-signin')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Sign in</span>
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {authState === 'forgot-password' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAuthState('email-signin')}>
                  <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back
                </div>
                <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Reset Password</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Enter your email and we'll send you a reset link.</p>
                <form onSubmit={e => { e.preventDefault(); alert('Reset link sent!'); setAuthState('email-signin'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Email</label>
                    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px', fontSize: 15 }} placeholder="you@example.com" />
                  </div>
                  <button type="submit" className="btn-primary" style={{ padding: '14px', marginTop: 8 }}>Send Reset Link</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      </div>
    </div>
  );
}
