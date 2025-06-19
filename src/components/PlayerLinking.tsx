import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  player_number?: string;
  team_id: string;
  teams?: {
    team_name: string;
  };
}

const PlayerLinking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const navigate = useNavigate();

  const searchPlayers = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    try {
      const { data, error } = await supabase
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
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchError('Failed to search players. Please try again.');
      toast.error('Failed to search players');
    } finally {
      setIsSearching(false);
    }
  };

  const linkToPlayer = async (playerId: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // First verify the player still exists and is accessible
      const { data: playerData, error: playerCheck } = await supabase
        .from('players')
        .select('id, name')
        .eq('id', playerId)
        .single();

      if (playerCheck || !playerData) {
        toast.error('Selected player is no longer available');
        // Refresh the search results
        if (searchTerm) {
          searchPlayers();
        }
        return;
      }

      // Update user with linked player and mark onboarding complete
      const { error } = await supabase
        .from('users')
        .update({ 
          linked_player_id: playerId,
          onboarding_completed: true 
        })
        .eq('id', user.id);

      if (error) throw error;

      // Also update the player with parent_user_id
      await supabase
        .from('players')
        .update({ parent_user_id: user.id })
        .eq('id', playerId);

      toast.success('Player linked successfully!');
      navigate(`/players/${playerId}/dashboard`);
    } catch (error) {
      console.error('Error linking player:', error);
      toast.error('Failed to link player. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewPlayer = () => {
    navigate('/create-player');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Link to Your Player
            </CardTitle>
            <p className="text-slate-300">
              Search for your child's player profile or create a new one
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Section */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for player by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPlayers()}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button 
                  onClick={searchPlayers}
                  disabled={isSearching || !searchTerm.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Error */}
              {searchError && (
                <Card className="bg-red-900/20 border-red-700">
                  <CardContent className="p-4 text-center">
                    <p className="text-red-200 mb-3">{searchError}</p>
                    <Button 
                      onClick={searchPlayers} 
                      variant="outline" 
                      className="border-red-600 text-red-200 hover:bg-red-900/20"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* No Results */}
              {searchTerm && !isSearching && players.length === 0 && !searchError && (
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-6 text-center">
                    <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No players found</h3>
                    <p className="text-slate-300 mb-4">
                      No players match "{searchTerm}". Try a different search term or create a new player.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Search Results */}
              {players.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Search Results:</h3>
                  {players.map((player) => (
                    <Card key={player.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <User className="h-8 w-8 text-blue-400" />
                            <div>
                              <h4 className="text-white font-medium">{player.name}</h4>
                              <p className="text-slate-300 text-sm">
                                {player.teams?.team_name}
                                {player.player_number && ` • #${player.player_number}`}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => linkToPlayer(player.id)}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                          >
                            Link Player
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Create New Player Option */}
            <div className="border-t border-slate-600 pt-6">
              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No player linked yet?
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Tap below to get started by creating a new player profile
                  </p>
                  <Button 
                    onClick={createNewPlayer}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create New Player
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerLinking;