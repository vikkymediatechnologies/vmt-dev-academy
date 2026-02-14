import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const fetchAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error fetching admin status:", error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error in fetchAdminStatus:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session ? "exists" : "none");
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        await fetchAdminStatus(session.user.id);
      } else {
        clearAuthState();
      }

      setLoading(false);
    }).catch((error) => {
      console.error("Error getting session:", error);
      clearAuthState();
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, "Session:", session ? "exists" : "none");

        if (event === "SIGNED_OUT") {
          console.log("User signed out - clearing state");
          clearAuthState();
        } else if (event === "SIGNED_IN" && session?.user) {
          console.log("User signed in");
          setSession(session);
          setUser(session.user);
          await fetchAdminStatus(session.user.id);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          console.log("Token refreshed");
          setSession(session);
          setUser(session.user);
        } else if (!session) {
          console.log("No session - clearing state");
          clearAuthState();
        }

        setLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...");
      clearAuthState(); // Clear state immediately for instant UI update
      await supabase.auth.signOut();
      console.log("Sign out complete");
      // Force reload to clear any cached data
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear state and redirect even if sign out fails
      clearAuthState();
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};