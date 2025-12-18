import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user: User, token: string) => {
        localStorage.setItem('authToken', token);
        const admin = user?.role === 'admin';
        set({ user, isAuthenticated: true, isAdmin: admin });
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth-storage');
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      setUser: (user: User) => {
        const admin = user?.role === 'admin';
        set({ user, isAuthenticated: true, isAdmin: admin });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
