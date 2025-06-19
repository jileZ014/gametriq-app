import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, TrendingUp, Calendar, Award, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Player {
  id: string;
  name: string;
  player_number?: string;
  team_id: string;
  teams?: {
    team_name: string;
  };
}

interface GameStats {
  total_games: number;
  total_points: number;
  avg_points: number;
  recent_games: Array<{
    game_id: string;
    opponent_name: string;
    game_date: string;
    points: number;
  }>;
}

const PlayerDashboard: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (playerId) {
      // Validate playerId format (should be UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(playerId)) {
        setError('Invalid player ID format');
        setIsLoading(false);
        return;
      }
      loadPlayerData();
    } else {
      setError('No player ID provided');
      setIsLoading(false);
    }
  }, [playerId]);

  const loadPlayerData = async () => {
    setError(null);
    try {
      // First check if current user has access to this player (for parents)
      if (currentUser?.role === 'Parent') {
        const { data: userData } = await supabase
          .from('users')
          .select('linked_player_id')
          .eq('id', currentUser.id)
          .single();

        if (userData?.linked_player_id !== playerId) {
          setError('You do not have access to view this player\'s data.');
          return;
        }
      }

      // Load player info
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select(`
          id,
          name,
          player_number,
          team_id,
          teams (
            team_name
          )
        `)
        .eq('id', playerId)
        .single();

      if (playerError) {
        if (playerError.code === 'PGRST116') {
          setError('Player not found. This player may not exist or may have been removed.');
        } else {
          throw playerError;
        }
        return;
      }
      setPlayer(playerData);

      // Load player stats
      const { data: statsData, error: statsError } = await supabase
        .from('stat_records')
        .select(`
          value,
          stat_type,
          game_id,
          games (
            opponent_name,
            game_date
          )
        `)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (statsError) throw statsError;

      // Process stats
      const gameStats = processPlayerStats(statsData || []);
      setStats(gameStats);

    } catch (error) {
      console.error('Error loading player data:', error);
      setError('Failed to load player data. Please check your connection and try again.');
      toast.error('Failed to load player data');
    } finally {
      setIsLoading(false);
    }
  };

  const processPlayerStats = (statRecords: any[]): GameStats => {
    const gameMap = new Map();
    
    statRecords.forEach(record => {
      const gameId = record.game_id;
      if (!gameMap.has(gameId)) {
        gameMap.set(gameId, {
          game_id: gameId,
          opponent_name: record.games?.opponent_name || 'Unknown',
          game_date: record.games?.game_date || '',
          points: 0
        });
      }
      
      // Calculate points based on stat type
      let points = 0;
      switch (record.stat_type) {
        case 'FG_Made':
          points = 2 * (record.value || 1);
          break;
        case 'ThreePT_Made':
          points = 3 * (record.value || 1);
          break;
        case 'FT_Made':
          points = 1 * (record.value || 1);
          break;
      }
      
      gameMap.get(gameId).points += points;
    });

    const games = Array.from(gameMap.values());
    const totalPoints = games.reduce((sum, game) => sum + game.points, 0);

    return {
      total_games: games.length,
      total_points: totalPoints,
      avg_points: games.length > 0 ? Math.round((totalPoints / games.length) * 10) / 10 : 0,
      recent_games: games.slice(0, 5)
    };
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
            <h2 className="text-xl font-semibold text-white mb-4">Unable to Load Player</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={loadPlayerData} 
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/link-player')} 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full"
              >
                Back to Player Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">No player linked</h2>
            <p className="text-slate-300 mb-6">Tap below to get started.</p>
            <Button onClick={() => navigate('/link-player')} className="bg-blue-600 hover:bg-blue-700 w-full">
              Link to Player
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
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/link-player')}
            className="text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Player Info */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <User className="h-16 w-16 text-blue-400" />
              <div>
                <CardTitle className="text-3xl font-bold text-white">{player.name}</CardTitle>
                <p className="text-slate-300">
                  {player.teams?.team_name}
                  {player.player_number && ` • #${player.player_number}`}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        {stats && stats.total_games > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                  <div>
                    <p className="text-slate-300 text-sm">Games Played</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{stats.total_games}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 md:h-8 md:w-8 text-green-400" />
                  <div>
                    <p className="text-slate-300 text-sm">Total Points</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{stats.total_points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
                  <div>
                    <p className="text-slate-300 text-sm">Avg. Points</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{stats.avg_points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-6 md:p-8 text-center">
              <TrendingUp className="h-12 w-12 md:h-16 md:w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Stats Yet</h3>
              <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto">
                No game statistics recorded yet. Stats will appear here once your player starts playing in games.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Games */}
        {stats && stats.recent_games.length > 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recent_games.map((game, index) => (
                  <div key={game.game_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-700/30 rounded-lg gap-2">
                    <div>
                      <p className="text-white font-medium">vs {game.opponent_name}</p>
                      <p className="text-slate-300 text-sm">
                        {new Date(game.game_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg md:text-xl font-bold text-green-400">{game.points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : stats && stats.total_games === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 md:p-8 text-center">
              <Calendar className="h-12 w-12 md:h-16 md:w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Games Played</h3>
              <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto">
                Games and performance will be tracked here once your player participates in team games.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;