'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib';
import { useAuthStore } from '@/store';
import { getUserByAuthId } from '@/actions';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setUserProfile, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    setLoading(true);
    try {
      const user = await getUserByAuthId(userId);
      setUserProfile(user ?? null);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  return <>{children}</>;
}
