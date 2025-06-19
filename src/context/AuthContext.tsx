
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { createUserFromAuth, isValidRole } from '../Users';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  handlePostLoginRedirect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    // Check for existing Supabase session
    const checkSupabaseSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('AuthProvider: Found Supabase session for user:', session.user.email);
          
          // Get role from user metadata or default to Parent
          const userRole = session.user.user_metadata?.role || 'Parent';
          const validatedRole = isValidRole(userRole) ? userRole : 'Parent';
          
          const user = createUserFromAuth(session.user, validatedRole);
          setCurrentUser(user);
          localStorage.setItem('gametriq_current_user', JSON.stringify(user));
          console.log('AuthProvider: Set current user from Supabase session:', user.email);
        } else {
          console.log('AuthProvider: No Supabase session found');
          
          // Check for stored user as fallback
          const storedUser = localStorage.getItem('gametriq_current_user');
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              // Only use stored user if we can verify it's valid
              if (user.id && user.email && isValidRole(user.role)) {
                console.log('AuthProvider: Found valid stored user:', user.email);
                setCurrentUser(user);
              } else {
                console.log('AuthProvider: Stored user is invalid, clearing');
                localStorage.removeItem('gametriq_current_user');
              }
            } catch (error) {
              console.error('Error parsing stored user:', error);
              localStorage.removeItem('gametriq_current_user');
            }
          }
        }
      } catch (error) {
        console.error('Error checking Supabase session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupabaseSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          const userRole = session.user.user_metadata?.role || 'Parent';
          const validatedRole = isValidRole(userRole) ? userRole : 'Parent';
          
          const user = createUserFromAuth(session.user, validatedRole);
          setCurrentUser(user);
          localStorage.setItem('gametriq_current_user', JSON.stringify(user));
          console.log('AuthProvider: Auth state changed - set user:', user.email);
        } else {
          setCurrentUser(null);
          localStorage.removeItem('gametriq_current_user');
          console.log('AuthProvider: Auth state changed - cleared user');
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handlePostLoginRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Get user data from our users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, linked_player_id, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        // Fallback to role selection if we can't get user data
        navigate('/select-role', { replace: true });
        return;
      }

      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Post-login user data:', {
          role: userData.role,
          linked_player_id: userData.linked_player_id,
          onboarding_completed: userData.onboarding_completed,
          user_id: user.id
        });
      }

      // Check if user has selected a role
      if (!userData.role) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ No role found, redirecting to role selection');
        }
        navigate('/select-role', { replace: true });
        return;
      }

      // Handle Parent flow
      if (userData.role === 'Parent') {
        // Check if they have a linked player
        if (userData.linked_player_id) {
          navigate(`/players/${userData.linked_player_id}/dashboard`, { replace: true });
        } else {
          navigate('/link-player', { replace: true });
        }
        return;
      }

      // Handle Coach flow
      if (userData.role === 'Coach') {
        // Check if they have any teams or games
        const { data: teams } = await supabase
          .from('teams')
          .select('id')
          .eq('coach_user_id', user.id)
          .limit(1);

        if (teams && teams.length > 0) {
          navigate('/coach/home', { replace: true });
        } else {
          // New coach, redirect to coach home where they can create teams
          navigate('/coach/home', { replace: true });
        }
        return;
      }

      // Default fallback
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error in post-login redirect:', error);
      navigate('/select-role', { replace: true });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext: Login attempt for:', email);
    
    try {
      // Only use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log('AuthContext: Supabase login failed:', error.message);
        return false;
      }

      if (data.user) {
        console.log('AuthContext: Supabase login successful for:', email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Logging out...');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local state
      setCurrentUser(null);
      localStorage.removeItem('gametriq_current_user');
      
      console.log('AuthContext: Logout completed');
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
      // Fallback: clear user state even if signOut fails
      setCurrentUser(null);
      localStorage.removeItem('gametriq_current_user');
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading,
    handlePostLoginRedirect
  };

  console.log('AuthProvider: Rendering with user:', currentUser?.email || 'none', 'loading:', isLoading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
