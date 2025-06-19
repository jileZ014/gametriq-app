
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoginForm from './LoginForm';
import ParentDashboard from './ParentDashboard';
import CoachDashboard from './CoachDashboard';
import MultiTeamDashboard from './MultiTeamDashboard';
import FirstLoginOnboarding from './FirstLoginOnboarding';
import { handleError } from '@/utils/errorHandling';

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  const handleOnboardingComplete = async () => {
    try {
      // Update user metadata to mark onboarding as complete
      const { error } = await supabase.auth.updateUser({
        data: { 
          has_completed_onboarding: true 
        }
      });
      
      if (error) {
        console.error('Error updating onboarding status:', error);
      }
      
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setShowOnboarding(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 HomePage: Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          console.log('✅ HomePage: User authenticated, checking profile...');
          // Check if this is first login by looking at user metadata
          const isFirstLogin = !session.user.user_metadata?.has_completed_onboarding;
          
          if (isFirstLogin && event === 'SIGNED_IN') {
            console.log('🎯 HomePage: First login detected, showing onboarding');
            setShowOnboarding(true);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 HomePage: Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🚪 HomePage: Logging out user:', user.email);
      await supabase.auth.signOut();
      console.log('✅ HomePage: Logout successful');
      setUser(null);
      setSession(null);
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error('❌ HomePage: Logout error:', error);
      handleError(error, { 
        context: "Logging out",
        showToast: true 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (showOnboarding && user) {
    return (
      <FirstLoginOnboarding
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Determine which dashboard to show based on user role or teams
  const renderDashboard = () => {
    // For now, we'll show the MultiTeamDashboard as the default
    // This can be enhanced later with proper role detection
    return <MultiTeamDashboard />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {renderDashboard()}
    </div>
  );
};

export default HomePage;
