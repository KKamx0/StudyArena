"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { Profile } from "@/types/profile";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const PROFILE_LOAD_TIMEOUT_MS = 4000;

function getFriendlyAuthError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("duplicate") || lowerMessage.includes("unique")) {
    return "That username is already taken. Try another one.";
  }

  if (lowerMessage.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (lowerMessage.includes("email")) {
    return "Please enter a valid email address.";
  }

  if (lowerMessage.includes("password")) {
    return "Please enter a stronger password.";
  }

  return message;
}

function timeoutAfter(milliseconds: number) {
  return new Promise<never>((_resolve, reject) => {
    window.setTimeout(() => {
      reject(new Error("Profile request timed out."));
    }, milliseconds);
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const supabase = getSupabaseClient();

    try {
      const profileRequest = supabase
        .from("profiles")
        .select("id, username, coins, level, xp, created_at")
        .eq("id", userId)
        .maybeSingle();

      const { data, error } = await Promise.race([
        profileRequest,
        timeoutAfter(PROFILE_LOAD_TIMEOUT_MS),
      ]);

      if (error) {
        console.error("Could not load profile:", error.message);
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Could not load profile:", error);
      setProfile(null);
    }
  }

  async function refreshProfile() {
    try {
      if (!user) {
        setProfile(null);
        return;
      }

      await loadProfile(user.id);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    let subscription: { unsubscribe: () => void } | null = null;

    async function loadSession(supabase: ReturnType<typeof getSupabaseClient>) {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          console.error("Could not load auth session:", error.message);
          setUser(null);
          setProfile(null);
          return;
        }

        const sessionUser = data.session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          void loadProfile(sessionUser.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Could not load auth session:", error);
        setUser(null);
        setProfile(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    try {
      const supabase = getSupabaseClient();
      void loadSession(supabase);

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        try {
          const sessionUser = session?.user ?? null;
          setUser(sessionUser);

          if (sessionUser) {
            void loadProfile(sessionUser.id);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Could not handle auth state change:", error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      });

      subscription = data.subscription;
    } catch (error) {
      console.error("Could not initialize auth:", error);
      window.queueMicrotask(() => {
        if (!active) return;

        setUser(null);
        setProfile(null);
        setLoading(false);
      });
    }

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string, username: string) {
    const cleanUsername = username.trim();
    const supabase = getSupabaseClient();

    try {
      if (!cleanUsername) {
        throw new Error("Please choose a username.");
      }

      const { data: existingProfile, error: usernameError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (usernameError) {
        throw new Error(getFriendlyAuthError(usernameError.message));
      }

      if (existingProfile) {
        throw new Error("That username is already taken. Try another one.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(getFriendlyAuthError(error.message));
      }

      if (!data.user) {
        throw new Error("Signup did not return a user. Please try again.");
      }

      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          username: cleanUsername,
          coins: 0,
          level: 1,
          xp: 0,
        })
        .select("id, username, coins, level, xp, created_at")
        .single();

      if (profileError) {
        console.error("Could not create profile:", profileError.message);
        throw new Error(getFriendlyAuthError(profileError.message));
      }

      setUser(data.user);
      setProfile(newProfile);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(getFriendlyAuthError(error.message));
      }

      setUser(data.user);
      setProfile(null);

      if (data.user) {
        void loadProfile(data.user.id);
      }
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(getFriendlyAuthError(error.message));
      }

      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
