import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectRole = async (role: 'Parent' | 'Coach') => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Update user metadata with role
      const { error: authError } = await supabase.auth.updateUser({
        data: { role }
      });

      if (authError) throw authError;

      // Update users table with role and mark onboarding as started
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role,
          onboarding_completed: false 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success(`Role selected: ${role}`);
      
      // Redirect based on role
      if (role === 'Parent') {
        navigate('/link-player', { replace: true });
      } else {
        navigate('/coach/home', { replace: true });
      }
    } catch (error) {
      console.error('Error selecting role:', error);
      setError('Failed to save role selection. Please try again.');
      toast.error('Failed to select role');
    } finally {
      setIsLoading(false);
    }
  };

  const retryRoleSelection = () => {
    setError(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Unable to Save Role</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <Button 
              onClick={retryRoleSelection} 
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome to Gametriq!
          </CardTitle>
          <p className="text-slate-300 text-sm md:text-base">
            Please select your role to get started
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <Users className="h-12 w-12 md:h-16 md:w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Parent</h3>
                  <p className="text-slate-300 text-xs md:text-sm mb-4">
                    Track your child's basketball stats and progress
                  </p>
                  <Button 
                    onClick={() => selectRole('Parent')}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    I'm a Parent
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors cursor-pointer">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <UserCheck className="h-12 w-12 md:h-16 md:w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Coach</h3>
                  <p className="text-slate-300 text-xs md:text-sm mb-4">
                    Manage teams, track player stats, and analyze games
                  </p>
                  <Button 
                    onClick={() => selectRole('Coach')}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    I'm a Coach
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelection;