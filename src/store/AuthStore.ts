import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MockDB } from '../utils/mockDB';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string; // first letter
  provider: 'google' | 'email';
  joinedAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (userData: AuthUser) => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      signIn: (userData) => set({ user: userData, isAuthenticated: true }),
      signOut: () => {
        const currentUser = get().user;
        if (currentUser?.email) {
          try {
            MockDB.saveSessionSnapshots(currentUser.email);
          } catch (e) {
            console.error('[AuthStore] Failed to save session on logout', e);
          }
        }
        
        // Clear all app data on sign out
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('as_')) {
            localStorage.removeItem(key);
          }
        });
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'as_authUser',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
