import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import { User as UserProfile } from '@/generated/prisma/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      userProfile: null,
      loading: true,

      setUser(user: User | null) {
        set({ user });
      },

      setSession(session: Session | null) {
        set({ session });
      },

      setUserProfile(userProfile: UserProfile | null) {
        set({ userProfile });
      },

      setLoading(loading: boolean) {
        set({ loading });
      },

      reset() {
        set({ user: null, session: null, userProfile: null, loading: false });
      },
    }),
    {
      name: 'irs-auth',
      partialize: (state) => ({ userProfile: state.userProfile }),
    }
  )
);
