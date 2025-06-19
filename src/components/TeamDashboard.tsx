import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Plus, 
  TrendingUp,
  GamepadIcon,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { Team } from '@/hooks/useTeams';
import PlayerForm from './PlayerForm';
import PlayerList from './PlayerList';
import GameSelection from './GameSelection';
import GameScreen from './GameScreen';

import { useAuth } from '@/context/AuthContext';
import { Player } from '@/types';
import { toast } from 'sonner';

interface TeamDashboardProps {
  team: Team;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ team }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'games' | 'stats'>('overview');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  console.log('TeamDashboard: selectedGameId state =', selectedGameId);
  
  // Mock data for games
  const mockGames = [];
  
  const handleAddPlayer = async (playerData: any) => {
    console.log('Adding player to team:', team.id, playerData);
    
    try {
      setIsLoading(true);
      
      // Create the new player object
      const newPlayer: Player = {
        id: `player-${Date.now()}-${Math.random()}`,
        name: playerData.name,
        playerNumber: playerData.playerNumber || '',
        team_id: team.id,
        parent_user_id: playerData.parentEmail ? currentUser?.id : undefined,
        photoUrl: playerData.photoUrl,
        stats: {
          fgMade: 0,
          fgMissed: 0,
          threePtMade: 0,
          threePtMissed: 0,
          ftMade: 0,
          ftMissed: 0,
          Assists: 0,
          Rebounds: 0,
          Steals: 0,
          Blocks: 0,
          Fouls: 0
        }
      };
      
      // Add to the players list
      setPlayers(prev => [...prev, newPlayer]);
      
      // Store in localStorage for persistence during testing
      const storageKey = `gametriq_team_players_${team.id}`;
      const existingPlayers = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingPlayers.push(newPlayer);
      localStorage.setItem(storageKey, JSON.stringify(existingPlayers));
      
      toast.success(`Added ${playerData.name} to the team!`);
      
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Failed to add player');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSelect = (gameId: string) => {
    console.log('TeamDashboard: handleGameSelect called with gameId:', gameId);
    console.log('TeamDashboard: Current selectedGameId before update:', selectedGameId);
    setSelectedGameId(gameId);
    console.log('TeamDashboard: setSelectedGameId called with:', gameId);
    toast.success(`Game selected! Now you can track player stats.`);
  };

  const handleBackToGameSelection = () => {
    setSelectedGameId(null);
    toast.info('Returned to game selection');
  };

  // Load players from localStorage when component mounts
  React.useEffect(() => {
    const storageKey = `gametriq_team_players_${team.id}`;
    const storedPlayers = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setPlayers(storedPlayers);
  }, [team.id]);

  // Add useEffect to log state changes
  React.useEffect(() => {
    console.log('TeamDashboard: selectedGameId state changed to:', selectedGameId);
  }, [selectedGameId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return (
          <div className="space-y-6">
            <PlayerForm 
              onAddPlayer={handleAddPlayer}
              isCoach={currentUser?.role === 'Coach'}
              isLoading={isLoading}
              existingPlayers={players}
              teamId={team.id}
            />
            <PlayerList
              players={players}
              isCoach={currentUser?.role === 'Coach'}
              isLoading={isLoading}
              onRecordStat={() => {}}
              onUpdateParentEmail={() => {}}
              onUploadPhoto={async () => {}}
              gameStats={[]}
              playerStatLogs={{}}
            />
          </div>
        );
      
      case 'games':
        // If a game is selected, show the GameScreen
        if (selectedGameId) {
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
                  Back to Game Selection
                </Button>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Game Selected: {selectedGameId}
                  </Badge>
                </div>
              </div>
              
              {/* Check if there are players to track stats for */}
              {players.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No Players Added</h3>
                    <p className="text-gray-600 mb-4">
                      You need to add players to your team before you can track stats.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('players')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Players
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                // Show the GameScreen with players
                <GameScreen 
                  gameId={selectedGameId}
                  players={players}
                  isLiveMode={currentUser?.role === 'Coach'}
                />
              )}
            </div>
          );
        }
        
        // Otherwise show game selection
        return (
          <div className="space-y-6">
            
            {/* Debug info for the TeamDashboard */}
            <Card className="bg-yellow-900/20 border-yellow-500/30">
              <CardContent className="p-4">
                <p className="text-yellow-300 text-sm">
                  <strong>TEAM DEBUG:</strong> Selected Game ID: 
                  <span className="font-mono ml-2 bg-black/30 px-2 py-1 rounded">
                    {selectedGameId || 'NONE'}
                  </span>
                </p>
                <p className="text-yellow-300 text-xs mt-1">
                  State type: {typeof selectedGameId} | Is null: {selectedGameId === null ? 'true' : 'false'}
                </p>
              </CardContent>
            </Card>
            
            <GameSelection
              selectedGameId={selectedGameId}
              onGameSelect={handleGameSelect}
            />
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-6">
            <Card className="bg-gray-900/80 border-gray-800">
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">Team Analytics</h3>
                <p className="text-gray-400 mb-6">
                  View team performance metrics, player stats, and game analytics.
                </p>
                <p className="text-sm text-gray-500">Coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            
            {/* Team Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gray-900/80 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Players</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{players.length}</div>
                  <p className="text-xs text-gray-500">Active roster</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Games</CardTitle>
                  <GamepadIcon className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{mockGames.length}</div>
                  <p className="text-xs text-gray-500">This season</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
                  <Trophy className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">--</div>
                  <p className="text-xs text-gray-500">No games yet</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Avg Points</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">--</div>
                  <p className="text-xs text-gray-500">Per game</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gray-900/80 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <Button 
                    onClick={() => setActiveTab('players')}
                    className="bg-blue-600 hover:bg-blue-700 justify-start"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Players
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('games')}
                    variant="outline" 
                    className="border-gray-700 text-gray-300 justify-start"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card className="bg-gray-900/80 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 ${players.length > 0 ? 'bg-green-600' : 'bg-blue-600'} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                      {players.length > 0 ? '✓' : '1'}
                    </div>
                    <div>
                      <p className={`font-medium ${players.length > 0 ? 'text-green-300' : ''}`}>Add your players</p>
                      <p className="text-sm text-gray-400">
                        {players.length > 0 ? `${players.length} players added!` : 'Start by adding players to your team roster.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                    <div>
                      <p className="font-medium text-gray-400">Create your first game</p>
                      <p className="text-sm text-gray-400">Set up a game to start tracking stats.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                    <div>
                      <p className="font-medium text-gray-400">Track live stats</p>
                      <p className="text-sm text-gray-400">Record player performance during games.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Trophy },
          { id: 'players', label: 'Players', icon: Users },
          { id: 'games', label: 'Games', icon: Calendar },
          { id: 'stats', label: 'Stats', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default TeamDashboard;
