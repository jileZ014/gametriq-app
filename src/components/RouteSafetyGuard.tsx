import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

interface RouteSafetyGuardProps {
  children: React.ReactNode;
}

const RouteSafetyGuard: React.FC<RouteSafetyGuardProps> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!isLoading && currentUser) {
      validateRoute();
    }
  }, [location.pathname, currentUser, isLoading]);

  const validateRoute = async () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Validate player dashboard route
      if (location.pathname.startsWith('/players/') && location.pathname.includes('/dashboard')) {
        const playerId = params.playerId;
        
        if (!playerId) {
          setValidationError('Invalid player ID');
          return;
        }

        // Check if player exists
        const { data: player, error: playerError } = await supabase
          .from('players')
          .select('id, name, parent_user_id')
          .eq('id', playerId)
          .single();

        if (playerError || !player) {
          setValidationError('Player not found or access denied');
          return;
        }

        // For parents, ensure they have access to this player
        if (currentUser.role === 'Parent') {
          const { data: userData } = await supabase
            .from('users')
            .select('linked_player_id')
            .eq('id', currentUser.id)
            .single();

          if (userData?.linked_player_id !== playerId) {
            setValidationError('You do not have access to this player');
            return;
          }
        }
      }

      // Validate link-player route
      if (location.pathname === '/link-player' && currentUser.role === 'Parent') {
        // Check if user already has a linked player
        const { data: userData } = await supabase
          .from('users')
          .select('linked_player_id')
          .eq('id', currentUser.id)
          .single();

        if (userData?.linked_player_id) {
          // User already has a linked player, redirect to their dashboard
          navigate(`/players/${userData.linked_player_id}/dashboard`, { replace: true });
          return;
        }
      }

      // Validate coach routes
      if (location.pathname === '/coach/home' && currentUser.role !== 'Coach') {
        setValidationError('Coach access required');
        return;
      }

      // Validate role selection - shouldn't be here if role is already set
      if (location.pathname === '/select-role' && currentUser.role) {
        // User already has a role, redirect appropriately
        if (currentUser.role === 'Parent') {
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
        } else if (currentUser.role === 'Coach') {
          navigate('/coach/home', { replace: true });
        }
        return;
      }

    } catch (error) {
      console.error('Route validation error:', error);
      setValidationError('Unable to validate route access');
    } finally {
      setIsValidating(false);
    }
  };

  const handleReturnHome = () => {
    if (currentUser?.role === 'Parent') {
      navigate('/link-player', { replace: true });
    } else if (currentUser?.role === 'Coach') {
      navigate('/coach/home', { replace: true });
    } else {
      navigate('/select-role', { replace: true });
    }
  };

  const handleRetry = () => {
    setValidationError(null);
    validateRoute();
  };

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Validating access...</p>
        </div>
      </div>
    );
  }

  // Show error if validation failed
  if (validationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Access Error</h2>
            <p className="text-slate-300 mb-6">{validationError}</p>
            <div className="space-y-3">
              <Button 
                onClick={handleRetry} 
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Try Again
              </Button>
              <Button 
                onClick={handleReturnHome} 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Return to Safe Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteSafetyGuard;