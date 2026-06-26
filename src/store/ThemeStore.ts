import { useState, useEffect, useCallback } from 'react';
import { load, save } from './storeHelpers';

export interface ThemeSettings {
  mode: 'dark' | 'light' | 'system';
  accent: string; // hex code or name
}

export const DEFAULT_THEME: ThemeSettings = {
  mode: 'dark',
  accent: '#10b981', // Green
};

export const ACCENT_COLORS = {
  green: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444'
};

export function applyTheme(theme: ThemeSettings) {
  const root = document.documentElement;
  
  let activeMode: 'light' | 'dark' = 'dark';
  if (theme.mode === 'system') {
    activeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    activeMode = theme.mode;
  }

  if (activeMode === 'light') {
    root.style.setProperty('--bg-color', '#f4f4f8');
    root.style.setProperty('--surface', '#f4f4f8');
    root.style.setProperty('--surface-1', '#ffffff');
    root.style.setProperty('--surface-2', '#ffffff');
    root.style.setProperty('--surface-3', '#f0f0f5');
    root.style.setProperty('--border', 'rgba(0,0,0,0.08)');
    root.style.setProperty('--text', '#111118');
    root.style.setProperty('--text-muted', '#4b5563');
    root.style.setProperty('--text-dim', '#9ca3af');
  } else {
    root.style.setProperty('--bg-color', '#090909');
    root.style.setProperty('--surface', '#090909');
    root.style.setProperty('--surface-1', '#090909');
    root.style.setProperty('--surface-2', '#141414');
    root.style.setProperty('--surface-3', '#1a1a1a');
    root.style.setProperty('--border', '#222222');
    root.style.setProperty('--text', '#ffffff');
    root.style.setProperty('--text-muted', '#888888');
    root.style.setProperty('--text-dim', '#555555');
  }

  // Accent color mapping
  root.style.setProperty('--primary', theme.accent);
  
  // Calculate hover and glow based on accent
  let hoverColor = theme.accent;
  let glowColor = 'rgba(0, 200, 83, 0.15)'; // Default green glow
  
  if (theme.accent === '#10b981' || theme.accent === '#00C853') {
    hoverColor = '#00E676';
    glowColor = 'rgba(0, 200, 83, 0.15)';
  } else if (theme.accent === '#3b82f6') {
    hoverColor = '#60a5fa';
    glowColor = 'rgba(59, 130, 246, 0.15)';
  } else if (theme.accent === '#8b5cf6') {
    hoverColor = '#a78bfa';
    glowColor = 'rgba(139, 92, 246, 0.15)';
  } else if (theme.accent === '#f59e0b') {
    hoverColor = '#fbbf24';
    glowColor = 'rgba(245, 158, 11, 0.15)';
  } else if (theme.accent === '#ef4444') {
    hoverColor = '#f87171';
    glowColor = 'rgba(239, 68, 68, 0.15)';
  }
  
  root.style.setProperty('--primary-hover', hoverColor);
  root.style.setProperty('--accent', hoverColor);
  root.style.setProperty('--glow', glowColor);
  root.style.setProperty('--green', theme.accent);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeSettings>(() => load('theme', DEFAULT_THEME));

  const setTheme = useCallback((updater: Partial<ThemeSettings>) => {
    setThemeState(prev => {
      const next = { ...prev, ...updater };
      save('theme', next);
      applyTheme(next);
      return next;
    });
  }, []);

  // Sync theme on mount & system changes
  useEffect(() => {
    applyTheme(theme);
    if (theme.mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme(theme);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  return { theme, setTheme };
}
