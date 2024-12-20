import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, setAuth, clearAuth, setLoading } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        // TODO: 调用登录 API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        setAuth(data.accessToken);
        setUser(data.user);

        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setUser, setLoading]
  );

  const logout = useCallback(async () => {
    try {
      // TODO: 调用登出 API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      clearAuth();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [clearAuth, router]);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: 验证当前 token 是否有效
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Auth check failed');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      clearAuth();
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  }, [setUser, clearAuth, router, setLoading]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}
