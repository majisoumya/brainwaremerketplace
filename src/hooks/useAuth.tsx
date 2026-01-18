import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_verified: boolean;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout to prevent deadlocks
        if (session?.user) {
          // For SIGNED_IN event (OAuth callback), wait longer for trigger
          const delay = event === 'SIGNED_IN' ? 1000 : 0;
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, delay);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data && !error) {
        setProfile({
          id: data.id,
          username: data.username,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          phone: data.phone,
          is_verified: data.is_verified,
          is_admin: (data as { is_admin?: boolean }).is_admin ?? false,
        });
        return;
      }
      
      // If profile doesn't exist, try to create it as fallback
      if (!data && !error && i === 0) {
        // Get user metadata from auth
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fullName = user.user_metadata?.full_name || 
                          user.user_metadata?.name || 
                          user.user_metadata?.display_name || 
                          null;
          const avatarUrl = user.user_metadata?.avatar_url || 
                           user.user_metadata?.picture || 
                           null;
          
          // Try to create profile manually
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              full_name: fullName,
              avatar_url: avatarUrl,
            });
          
          if (!insertError) {
            // Profile created, fetch it
            continue;
          } else {
            console.error("Failed to create profile:", insertError);
          }
        }
      }
      
      // If profile doesn't exist and this is a new user, wait and retry
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
      }
    }
    
    // If profile still doesn't exist, log error
    console.error("Profile not found for user:", userId);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    return { data, error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
