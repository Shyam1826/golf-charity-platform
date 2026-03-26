import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  role: string;
  charity_id: string;
  charity_percentage: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// ✅ SAFE PARSE FUNCTION
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored || stored === "undefined") return null;
    return JSON.parse(stored);
  } catch (err) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));