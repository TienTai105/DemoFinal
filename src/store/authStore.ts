import { create } from 'zustand';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user: User, token: string) => {
    localStorage.setItem('authToken', token);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
}));
