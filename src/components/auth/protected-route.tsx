'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Spinner } from '../ui';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const path = window.location.pathname + window.location.search;
      router.push(`/signin?from=${encodeURIComponent(path)}`);
    }
  }, [user, loading, router]);

  if (loading && !userProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <Spinner size="lg" />
        <p className="text-brand-500 font-bold">Thinking ...</p>
      </div>
    );
  }

  if (!loading && !user) {
    return null;
  }

  return <>{children}</>;
}
