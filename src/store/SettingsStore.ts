import { useState, useCallback } from 'react';
import { load, save } from './storeHelpers';
import { DEFAULT_PROFILE } from './UserStore';
import { DEFAULT_GOALS } from './GoalStore';
import { DEFAULT_LESSON_PROGRESS } from './LearningStore';
import { DEFAULT_NOTIFICATIONS } from './NotificationStore';
import { DEFAULT_THEME } from './ThemeStore';

export interface NotificationPrefs {
  scamAlerts: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  learningReminders: boolean;
  weeklyReport: boolean;
  billReminders: boolean;
}

export interface AppSettings {
  apiKey: string;
  demoMode: boolean;
}

export const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
  scamAlerts: true,
  budgetAlerts: true,
  goalReminders: true,
  learningReminders: true,
  weeklyReport: true,
  billReminders: true,
};

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  demoMode: true,
};

export function useNotifPrefs() {
  const [prefs, setPrefsState] = useState<NotificationPrefs>(() => load('notifPrefs', DEFAULT_NOTIF_PREFS));

  const setPrefs = useCallback((updater: Partial<NotificationPrefs>) => {
    setPrefsState(prev => {
      const next = { ...prev, ...updater };
      save('notifPrefs', next);
      return next;
    });
  }, []);

  return { prefs, setPrefs };
}

export function useAppSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => load('appSettings', DEFAULT_SETTINGS));

  const setSettings = useCallback((updater: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...updater };
      save('appSettings', next);
      return next;
    });
  }, []);

  const hasApiKey = settings.apiKey.length > 10;
  const isValidKey = settings.apiKey.startsWith('sk-ant-');

  return { settings, setSettings, hasApiKey, isValidKey };
}

export function resetAllDemoData() {
  const keys = ['profile', 'notifPrefs', 'notifications', 'goals', 'lessonProgress', 'theme', 'appSettings'];
  keys.forEach(k => localStorage.removeItem(`as_${k}`));
  window.location.reload();
}

export function exportUserData() {
  const data = {
    exportedAt: new Date().toISOString(),
    profile: load('profile', DEFAULT_PROFILE),
    goals: load('goals', DEFAULT_GOALS),
    lessonProgress: load('lessonProgress', DEFAULT_LESSON_PROGRESS),
    notifPrefs: load('notifPrefs', DEFAULT_NOTIF_PREFS),
    notifications: load('notifications', DEFAULT_NOTIFICATIONS),
    theme: load('theme', DEFAULT_THEME),
    appSettings: load('appSettings', DEFAULT_SETTINGS),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `arthsaathi-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
