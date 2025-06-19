
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Player, Game } from '@/types';
import { toast } from 'sonner';
import ManualPlayerCreation from './ManualPlayerCreation';
import ManualGameCreation from './ManualGameCreation';
import GameScreen from './GameScreen';
import PlayerDeleteDialog from './PlayerDeleteDialog';
import PlayerEditDialog from './PlayerEditDialog';

const ParentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [linkedPlayers, setLinkedPlayers] = useState<Player[]>([]);
  const [manualPlayers, setManualPlayers] = useState<Player[]>([]);
  const [manualGames, setManualGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load manual players and games from localStorage
  useEffect(() => {
    if (!currentUser?.email) return;

    const loadManualData = () => {
      try {
        // Load manual players
        const playersKey = `gametriq_manual_players_${currentUser.email}`;
        const storedPlayers = JSON.parse(localStorage.getItem(playersKey) || '[]');
        setManualPlayers(storedPlayers);

        // Load manual games (both private and linked)
        const gamesKey = `gametriq_manual_games_${currentUser.email}`;
        const linkedGamesKey = `gametriq_linked_games_${currentUser.email}`;
        
        const manualGamesData = JSON.parse(localStorage.getItem(gamesKey) || '[]');
        const linkedGamesData = JSON.parse(localStorage.getItem(linkedGamesKey) || '[]');
        
        setManualGames([...manualGamesData, ...linkedGamesData]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading manual data:', error);
        setIsLoading(false);
      }
    };

    loadManualData();
  }, [currentUser?.email]);

  const handlePlayerCreated = (player: Player) => {
    setManualPlayers(prev => [...prev, player]);
    toast.success(`Player "${player.name}" created successfully!`);
  };

  const handlePlayerDeleted = (playerId: string) => {
    setManualPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handlePlayerUpdated = (updatedPlayer: Player) => {
    setManualPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    toast.success(`Player "${updatedPlayer.name}" updated successfully!`);
  };

  const handleGameCreated = (game: Game) => {
    setManualGames(prev => [...prev, game]);
    toast.success(`Game "${game.opponent}" created successfully!`);
  };

  const handleViewStats = (gameId: string) => {
    console.log('Viewing stats for game:', gameId);
    setSelectedGameId(gameId);
    toast.success('Loading game stats...');
  };

  const handleAddSession = () => {
    // For now, this will just show the manual game creation dialog
    toast.info('Click "Create Game" to add a new practice session');
  };

  const handleBackToGameSelection = () => {
    setSelectedGameId(null);
    toast.info('Returned to dashboard');
  };

  const allPlayers = [...linkedPlayers, ...manualPlayers];

  // If a game is selected, show the GameScreen with player grid view (not individual player view)
  if (selectedGameId) {
    const selectedGame = manualGames.find(game => game.id === selectedGameId);
    
    if (!selectedGame) {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">Game Not Found</h3>
              <p className="text-gray-600 mb-4">The selected game could not be found.</p>
              <Button onClick={handleBackToGameSelection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Back button and game info */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBackToGameSelection}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Game: {selectedGame.opponent}
          </Badge>
        </div>
        
        {/* Check if there are players to track stats for */}
        {allPlayers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Players Added</h3>
              <p className="text-gray-600 mb-4">
                You need to add players before you can track stats.
              </p>
              <Button 
                onClick={handleBackToGameSelection}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Players
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Show the GameScreen with players - parent gets read-only view, but starts with player grid
          <GameScreen 
            gameId={selectedGameId}
            players={allPlayers}
            isLiveMode={false} // Parents get basic stat view, not live mode
          />
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p>Loading your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Welcome to your Gametriq Dashboard</h1>
        <p className="text-lg text-gray-300">Track progress and practice sessions for your player</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Players */}
        <div className="space-y-6">
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Players
              </CardTitle>
              <ManualPlayerCreation 
                onPlayerCreated={handlePlayerCreated}
                userEmail={currentUser?.email || ''}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {allPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 mb-4">No players added yet</p>
                  <p className="text-sm text-gray-500">Create a player to start tracking stats</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allPlayers.map((player) => (
                    <div 
                      key={player.id}
                      className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                          {player.photoUrl ? (
                            <img 
                              src={player.photoUrl} 
                              alt={player.name} 
                              className="w-full h-full object-cover rounded-full" 
                            />
                          ) : (
                            player.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{player.name}</h3>
                          <div className="flex items-center gap-2">
                            {player.playerNumber && (
                              <span className="text-sm text-gray-300">#{player.playerNumber}</span>
                            )}
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-blue-100 text-blue-800"
                            >
                              Manual
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-gray-400">
                          <TrendingUp className="h-4 w-4" />
                          <span className="ml-1 text-sm">0</span>
                        </div>
                        <PlayerEditDialog
                          player={player}
                          onPlayerUpdated={handlePlayerUpdated}
                          userEmail={currentUser?.email || ''}
                        />
                        <PlayerDeleteDialog
                          player={player}
                          onPlayerDeleted={handlePlayerDeleted}
                          userEmail={currentUser?.email || ''}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Games */}
        <div className="space-y-6">
          {/* Team Games Section */}
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Team Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">No team games available</p>
              </div>
            </CardContent>
          </Card>

          {/* Manual Games Section */}
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl text-white">Practice Sessions & Manual Games</CardTitle>
              <div className="flex gap-2">
                <ManualGameCreation 
                  onGameCreated={handleGameCreated}
                  userEmail={currentUser?.email || ''}
                />
                <Button 
                  onClick={handleAddSession}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {manualGames.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 mb-4">No manual games created yet</p>
                  <p className="text-sm text-gray-500">Create a game to start tracking practice stats</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {manualGames.map((game) => (
                    <div 
                      key={game.id}
                      className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {new Date(game.date).getDate()}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{game.opponent}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300">
                              {new Date(game.date).toLocaleDateString()}
                            </span>
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-blue-100 text-blue-800"
                            >
                              Manual Game
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewStats(game.id)}
                        variant="outline"
                        size="sm"
                        className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                      >
                        View Stats
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
