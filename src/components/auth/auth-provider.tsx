'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

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
      const { data } = await supabase.from('users').select('*').eq('authid', userId).maybeSingle();
      if (data) {
        setUserProfile({
          id: data.id,
          firstName: data.firstName ?? data.first_name ?? '',
          lastName: data.lastName ?? data.last_name ?? '',
          email: data.email ?? '',
          contactNumber: data.contactNumber ?? data.phone ?? '',
          userType: data.userType ?? data.usertype ?? 1,
          photoURL: data.photoURL ?? null,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  return <>{children}</>;
}
