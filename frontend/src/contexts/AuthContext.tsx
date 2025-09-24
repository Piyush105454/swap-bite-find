import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface UserWithMetadata extends User {
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserWithMetadata | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithMetadata | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const enrichUserWithMetadata = (currentUser: User | null): UserWithMetadata | null => {
    if (!currentUser) return null;
    return {
      ...currentUser,
      name: currentUser.user_metadata?.full_name || 'User',
      avatar:
        currentUser.user_metadata?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.user_metadata?.full_name || 'User')}&background=random`,
    };
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        setUser(enrichUserWithMetadata(session.user));
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      } else if (event === 'INITIAL_SESSION') {
        setUser(enrichUserWithMetadata(session?.user ?? null));
        setSession(session ?? null);
      }
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error) console.error('Session error:', error);
      setUser(enrichUserWithMetadata(session?.user ?? null));
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (!data.user?.email_confirmed_at) {
        toast.info('Please verify your email before logging in.');
        return;
      }

      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      window.location.href = '/';
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
    }
  };

  const signup = async (email: string, password: string, name: string, phoneNumber: string) => {
    try {
      // 1️⃣ Create user in Supabase Auth (email verification enabled)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone_number: phoneNumber,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // 2️⃣ Insert into profiles (RLS-compliant)
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id, // MUST match auth.uid()
            email,
            full_name: name,
            phone_number: phoneNumber,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          },
        ]);

        if (profileError) throw profileError;

        toast.success('Signup successful! Please check your email to verify your account.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        login,
        logout,
        signup,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthProvider;
