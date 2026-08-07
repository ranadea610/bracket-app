import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { usernameToEmail } from "./username";
import type { AuthUser } from "./types";

type AuthResult = { error?: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<AuthResult>;
  signIn: (username: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(id: string): Promise<{ username: string } | null> {
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", id)
    .single();
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const profile = await fetchProfile(session.user.id);
      if (!cancelled) {
        setUser(profile ? { id: session.user.id, username: profile.username } : null);
        setLoading(false);
      }
    });

    // signUp/signIn already set `user` directly once they have the profile
    // row, so this only needs to react to sign-out (including cross-tab) --
    // re-fetching the profile here on sign-in would race the profiles
    // insert that signUp does right after auth.signUp() resolves.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
        }
      },
    );

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (username: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: usernameToEmail(username),
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        return { error: "That username is already taken." };
      }
      return { error: error.message };
    }
    if (!data.user) {
      return { error: "Something went wrong. Please try again." };
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, username });

    if (profileError) {
      if (profileError.code === "23505") {
        return { error: "That username is already taken." };
      }
      return { error: profileError.message };
    }

    setUser({ id: data.user.id, username });
    return {};
  };

  const signIn = async (username: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });

    if (error || !data.user) {
      return { error: "Invalid username or password." };
    }

    const profile = await fetchProfile(data.user.id);
    setUser({ id: data.user.id, username: profile?.username ?? username });
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
