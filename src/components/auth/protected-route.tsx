'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Spinner } from '../ui';
import { FORBIDDEN_USER_TYPES } from '@/types';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const path = window.location.pathname + window.location.search;
      router.push(`/signin?from=${encodeURIComponent(path)}`);
    }
  }, [user, loading, router, userProfile]);

  if (userProfile?.user_type.name && FORBIDDEN_USER_TYPES.includes(userProfile.user_type.name)) {
    router.push(
      `/signin?error=unauthorized&message=${encodeURIComponent('Your account does not have access to this resource.')}`
    );
  }

  if (!user && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!loading && !user) return null;

  return <>{children}</>;
}
