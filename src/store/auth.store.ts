import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  permissions: {
    canRaiseIssue: boolean;
    canViewPrivate: boolean;
  };

  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  permissions: {
    canRaiseIssue: false,
    canViewPrivate: false,
  },

  setAuthenticated: (value) =>
    set({ isAuthenticated: value }),
}));