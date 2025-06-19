import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireRole?: "Coach" | "Parent";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/',
  requireRole 
}) => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        console.log('🔒 ProtectedRoute: No authenticated user, redirecting');
        toast.error('Please sign in to access this page');
        navigate(redirectTo, { replace: true });
        return;
      }

      if (requireRole && currentUser.role !== requireRole) {
        console.log(`🚫 ProtectedRoute: User role ${currentUser.role} does not match required role ${requireRole}`);
        toast.error(`Access denied. This page requires ${requireRole} privileges.`);
        
        // Redirect based on user's actual role
        if (currentUser.role === 'Parent') {
          // For parents, we need to check if they have a linked player in the database
          const redirectParent = async () => {
            try {
              const { data: userData } = await supabase
                .from('users')
                .select('linked_player_id')
                .eq('id', currentUser.id)
                .single();
              
              if (userData?.linked_player_id) {
                navigate(`/players/${userData.linked_player_id}/dashboard`, { replace: true });
              } else {
                navigate('/link-player', { replace: true });
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              navigate('/link-player', { replace: true });
            }
          };
          redirectParent();
        } else if (currentUser.role === 'Coach') {
          navigate('/coach/home', { replace: true });
        } else {
          navigate('/select-role', { replace: true });
        }
        return;
      }

      console.log('✅ ProtectedRoute: User authenticated and authorized');
    }
  }, [currentUser, isLoading, redirectTo, requireRole, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!currentUser) {
    return null;
  }

  // Don't render children if user doesn't have required role
  if (requireRole && currentUser.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;