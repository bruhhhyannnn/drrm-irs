import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  userType?: number;
  photoURL?: string | null;
}

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
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setLoading: (loading) => set({ loading }),
      reset: () => set({ user: null, session: null, userProfile: null, loading: false }),
    }),
    {
      name: 'irs-auth',
      partialize: (state) => ({ userProfile: state.userProfile }),
    }
  )
);
