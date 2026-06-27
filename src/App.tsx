import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useProfile } from './store/useAppStore';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AppLayout from './components/AppLayout';

// Lazy loading all pages for performance
const Landing = React.lazy(() => import('./pages/Landing'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AICoach = React.lazy(() => import('./pages/AICoach'));
const ScamShield = React.lazy(() => import('./pages/ScamShield'));
const Budget = React.lazy(() => import('./pages/Budget'));
const Goals = React.lazy(() => import('./pages/Goals'));
const Schemes = React.lazy(() => import('./pages/Schemes'));
const Learn = React.lazy(() => import('./pages/Learn'));
const FinancialHealth = React.lazy(() => import('./pages/FinancialHealth'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Notifications = React.lazy(() => import('./pages/Notifications'));

// Global Loader
const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
    <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }}></div>
  </div>
);

// Protected Route for the Dashboard Layout
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!profile.name) return <Navigate to="/onboarding" replace />;

  return <AppLayout />;
}

// Protected Route for Onboarding Screen
function ProtectedOnboarding() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (profile.name) return <Navigate to="/dashboard" replace />;

  return <Onboarding />;
}

// Protected Route for Root (Landing)
function ProtectedRoot() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();

  if (isAuthenticated) {
    if (profile.name) return <Navigate to="/dashboard" replace />;
    return <Navigate to="/onboarding" replace />;
  }

  return <Landing />;
}

export default function App() {
  // Safe fallback if client ID is missing or placeholder
  // @ts-ignore
  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const clientId = rawClientId.includes('YOUR') ? 'missing-client-id.apps.googleusercontent.com' : (rawClientId || 'missing-client-id.apps.googleusercontent.com');

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* State 1: Logged Out (Auth Screen) */}
            <Route path="/" element={<ProtectedRoot />} />
            
            {/* State 2: Logged In, Profile Incomplete */}
            <Route path="/onboarding" element={<ProtectedOnboarding />} />

            {/* State 3: Logged In, Profile Complete */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/coach" element={<AICoach />} />
              <Route path="/scam-shield" element={<ScamShield />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/health" element={<FinancialHealth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
