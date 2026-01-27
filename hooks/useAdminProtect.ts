'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, getUserRole } from '@/lib/auth-utils';

/**
 * Hook to protect admin routes
 * Redirects to login if user is not authenticated as admin
 */
export function useAdminProtect() {
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/auth/admin-login');
    }
  }, [router]);

  return isAdmin();
}
