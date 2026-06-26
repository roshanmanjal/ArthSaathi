import { useState, useCallback } from 'react';
import { load, save } from './storeHelpers';

export interface AppNotification {
  id: number;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [];

export function useNotifications() {
  const [notifications, setNotificationsState] = useState<AppNotification[]>(() =>
    load('notifications', DEFAULT_NOTIFICATIONS)
  );

  const setNotifications = useCallback((updater: AppNotification[] | ((prev: AppNotification[]) => AppNotification[])) => {
    setNotificationsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save('notifications', next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const dismiss = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [setNotifications]);

  const markRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, setNotifications, markAllRead, dismiss, markRead, unreadCount };
}
