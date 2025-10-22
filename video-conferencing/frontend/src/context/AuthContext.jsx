import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => {
      // Initialize from localStorage (safely check for window)
      const storedUser =
        typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const initialUser = storedUser ? JSON.parse(storedUser) : null;

      return {
        user: initialUser,
        isAuthenticated: !!initialUser,
        isLoading: false,
        error: null,

        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            set({ user: data, isAuthenticated: true, isLoading: false });
            // persist middleware will handle storage, but keep this for compatibility
            localStorage.setItem('user', JSON.stringify(data));
            return data;
          } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
          }
        },

        signup: async (name, email, password) => {
          set({ isLoading: true, error: null });
          try {
            const { data } = await axiosInstance.post('/auth/signup', { name, email, password });
            set({ user: data, isAuthenticated: true, isLoading: false });
            localStorage.setItem('user', JSON.stringify(data));
            return data;
          } catch (error) {
            const message = error.response?.data?.message || 'Signup failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
          }
        },

        logout: () => {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem('user');
        },

        clearError: () => set({ error: null }),
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
