'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Spinner } from '../ui';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const path = window.location.pathname + window.location.search;
      router.push(`/signin?from=${encodeURIComponent(path)}`);
    }
  }, [user, loading, router]);

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
