import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthStore, UserProfile } from './types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  loading: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user: UserProfile | null) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
        })),

      setAuth: (token: string) =>
        set((state) => ({
          accessToken: token,
          isAuthenticated: true,
        })),

      clearAuth: () =>
        set((state) => ({
          ...initialState,
        })),

      updateUser: (data: Partial<UserProfile>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      setLoading: (loading: boolean) =>
        set((state) => ({
          loading,
        })),
    }),
    {
      name: 'auth-storage',
      // 只持久化部分数据
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
