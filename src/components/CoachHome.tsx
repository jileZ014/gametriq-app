import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Calendar, Trophy, Plus, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Team {
  id: string;
  team_name: string;
  season?: string;
  description?: string;
  player_count: number;
}

interface Game {
  id: string;
  opponent_name: string;
  game_date: string;
  location?: string;
  team_name: string;
}

const CoachHome: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      loadCoachData();
    }
  }, [currentUser]);

  const loadCoachData = async () => {
    setError(null);
    try {
      // Load teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          team_name,
          season,
          description,
          players (count)
        `)
        .eq('coach_user_id', currentUser?.id);

      if (teamsError) throw teamsError;

      const teamsWithCounts = teamsData?.map(team => ({
        ...team,
        player_count: team.players?.[0]?.count || 0
      })) || [];

      setTeams(teamsWithCounts);

      // Load recent games
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select(`
          id,
          opponent_name,
          game_date,
          location,
          teams (
            team_name
          )
        `)
        .eq('created_by_user_id', currentUser?.id)
        .order('game_date', { ascending: false })
        .limit(5);

      if (gamesError) throw gamesError;

      const gamesWithTeamNames = gamesData?.map(game => ({
        ...game,
        team_name: game.teams?.team_name || 'Unknown Team'
      })) || [];

      setRecentGames(gamesWithTeamNames);

      // Mark onboarding as complete for coaches
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', currentUser?.id);

    } catch (error) {
      console.error('Error loading coach data:', error);
      setError('Failed to load dashboard data. Please check your connection and try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = () => {
    navigate('/dashboard'); // Go to main dashboard to create team
  };

  const manageTeam = (teamId: string) => {
    navigate('/dashboard'); // Go to main dashboard and select team
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Unable to Load Dashboard</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <Button 
              onClick={loadCoachData} 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, Coach {currentUser?.name || currentUser?.email}!
          </h1>
          <p className="text-slate-300">
            Manage your teams, track player progress, and analyze game performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-slate-300">Teams</p>
                  <p className="text-2xl font-bold text-white">{teams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-slate-300">Recent Games</p>
                  <p className="text-2xl font-bold text-white">{recentGames.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-slate-300">Total Players</p>
                  <p className="text-2xl font-bold text-white">
                    {teams.reduce((sum, team) => sum + team.player_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Your Teams</CardTitle>
            <Button onClick={createTeam} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </CardHeader>
          <CardContent>
            {teams.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <Users className="h-12 w-12 md:h-16 md:w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No teams found</h3>
                <p className="text-slate-300 mb-4 text-sm md:text-base max-w-md mx-auto">
                  Tap here to create your first team and start tracking player stats and managing games.
                </p>
                <Button onClick={createTeam} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Team
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <Card key={team.id} className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium truncate">{team.team_name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => manageTeam(team.id)}
                          className="text-blue-400 hover:text-blue-300 flex-shrink-0"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      {team.season && (
                        <p className="text-slate-300 text-sm mb-2">{team.season}</p>
                      )}
                      <p className="text-slate-400 text-sm mb-3">
                        {team.player_count} player{team.player_count !== 1 ? 's' : ''}
                      </p>
                      <Button
                        onClick={() => manageTeam(team.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Manage Team
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Games */}
        {recentGames.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGames.map((game) => (
                  <div key={game.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-700/30 rounded-lg gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {game.team_name} vs {game.opponent_name}
                      </p>
                      <p className="text-slate-300 text-sm">
                        {new Date(game.game_date).toLocaleDateString()}
                        {game.location && ` • ${game.location}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/dashboard')}
                      className="text-blue-400 hover:text-blue-300 w-full sm:w-auto"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoachHome;