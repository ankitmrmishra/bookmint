import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session } from "next-auth";

// User type matching Auth.js session user
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  username?: string | null;
  createdAt?: Date | null;
  emailVerified: Date | null;
}

type AuthState = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthActions = {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
  hydrateAuth: (session: Session | null) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      session: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setSession: (session) =>
        set({
          session,
          user: session?.user as User | null,
          isAuthenticated: !!session,
          isLoading: false,
        }),

      setUser: (user) =>
        set((state) => ({
          user,
          session:
            user && state.session ? { ...state.session, user } : state.session,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      clearAuth: () =>
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      hydrateAuth: (session) =>
        set({
          session,
          user: session?.user as User | null,
          isAuthenticated: !!session,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
