import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: (userData) => set({ user: userData, isAuthenticated: true }),
      signOut: () => {
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
