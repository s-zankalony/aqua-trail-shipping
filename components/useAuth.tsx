'use client';

import { useState, useEffect } from 'react';
import { getUserData, logout } from '@/utils/actions';
import type { UserDataNoPassword } from '@/utils/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<UserDataNoPassword | null>(null);
  const [loading, setLoading] = useState(true);
  const [authVersion, setAuthVersion] = useState(0);
  const router = useRouter();

  async function checkAuth() {
    try {
      const token = Cookies.get('token');
      if (token) {
        const userData = await getUserData();

        if (userData) {
          setUser({
            ...userData,
            phone: userData.phone ?? undefined,
            city: userData.city ?? undefined,
            country: userData.country ?? undefined,
            image: userData.image ?? undefined,
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, [authVersion]);

  const handleLogout = async () => {
    try {
      await logout();
      // Remove client-side cookie
      Cookies.remove('token');
      setUser(null);
      setAuthVersion((v) => v + 1);
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const revalidate = async () => {
    setAuthVersion((v) => v + 1);
    await checkAuth();
  };

  return { user, loading, logout: handleLogout, revalidate };
}
