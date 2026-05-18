import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile().then((r) => r.data.data!),
    enabled: isAuthenticated && !user,
    retry: false,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  // Listen for global auth:logout event (from axios interceptor)
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  return { user, isAuthenticated, isLoading };
}
