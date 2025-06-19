import React, { useMemo, useState, useEffect } from "react";
import { useGameStats } from "@/hooks/useGameStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import PlayerCard from "@/components/PlayerCard";
import { Player } from "@/types";
import { StatLogEntryData } from "./StatLogEntry";
import { POINT_VALUES, StatType } from "@/types";
import useStatMutations from "@/hooks/useStatMutations";
import PlayerStatsCharts from "./PlayerStatsCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveGameMode from "./LiveGameMode";
import StatTimeline from "./StatTimeline";

import StatRecordingVisualFeedback from "./StatRecordingVisualFeedback";
import useOfflineStatRecorder from "@/hooks/useOfflineStatRecorder";
import GametriqLogo from "./GametriqLogo";
import GameHeader from "./GameHeader";
import GameSummary from "./GameSummary";
import OfflineIndicator from "./OfflineIndicator";
import PlayerGrid from "./PlayerGrid";
import PlayerStatRecorder from "./PlayerStatRecorder";
import PlayerStatDisplay from "./PlayerStatDisplay";
import GameTimeline from "./GameTimeline";

interface GameScreenProps {
  gameId: string;
  players: Player[];
  isLiveMode?: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameId, players: initialPlayers, isLiveMode = false }) => {
  const { currentUser } = useAuth();
  const isCoach = currentUser?.role === "Coach";
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [latestStat, setLatestStat] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  
  useEffect(() => {
    setPlayers(initialPlayers);
  }, [initialPlayers]);
  
  const [localStats, setLocalStats] = useState<any[]>([]);
  const isMockGame = gameId.startsWith('mock-game-') || gameId.startsWith('manual-game-');
  
  const { 
    gameStats, 
    isLoadingGameStats, 
    getPlayerStats 
  } = useGameStats(isMockGame ? undefined : gameId);
  
  const { recordStatMutation, undoLastStatMutation } = useStatMutations(isMockGame ? undefined : gameId);
  const { 
    recordStatOffline, 
    syncOfflineStats, 
    isSyncing, 
    recordStat, 
    isOnline, 
    offlineQueueLength, 
    forceSync 
  } = useOfflineStatRecorder(isMockGame ? undefined : gameId);
  
  const effectiveGameStats = isMockGame ? localStats : gameStats;
  
  console.log('GameScreen Debug - effectiveGameStats:', effectiveGameStats);
  console.log('GameScreen Debug - selectedPlayer:', selectedPlayer);
  console.log('GameScreen Debug - isMockGame:', isMockGame);
  console.log('GameScreen Debug - localStats:', localStats);

  const gameInfo = useMemo(() => {
    if (isMockGame) {
      const userEmail = currentUser?.email;
      if (userEmail) {
        const manualGamesKey = `gametriq_manual_games_${userEmail}`;
        const linkedGamesKey = `gametriq_linked_games_${userEmail}`;
        
        const manualGames = JSON.parse(localStorage.getItem(manualGamesKey) || '[]');
        const linkedGames = JSON.parse(localStorage.getItem(linkedGamesKey) || '[]');
        
        const allGames = [...manualGames, ...linkedGames];
        const game = allGames.find(g => g.id === gameId);
        
        if (game) {
          return {
            teamName: "Your Team",
            opponent: game.opponent,
            date: new Date(game.date).toLocaleDateString(),
            location: game.location || "Manual Entry",
            gameType: game.isPrivate ? "Private Game" : "Linked Game"
          };
        }
      }
      
      return {
        teamName: "Your Team",
        opponent: "Unknown Opponent",
        date: new Date().toLocaleDateString(),
        location: "Manual Entry",
        gameType: "Manual Game"
      };
    }
    return {
      teamName: "Team",
      opponent: "Opponent",
      date: new Date().toLocaleDateString(),
      location: "Court",
      gameType: "Game"
    };
  }, [isMockGame, gameId, currentUser?.email]);

  const createStatLogs = (playerId: string): StatLogEntryData[] => {
    const playerStats = effectiveGameStats.filter(stat => stat.player_id === playerId);
    console.log('createStatLogs - playerStats for', playerId, ':', playerStats);
    
    return playerStats.map(stat => {
      let pointsChange = 0;
      const statType = stat.stat_type as StatType;
      pointsChange = POINT_VALUES[statType] * (stat.value || 1);
      
      const playerName = players.find(p => p.id === stat.player_id)?.name || "Unknown Player";
      const statDescription = `${playerName}: ${stat.stat_type.replace('_', ' ')}`;
      
      return {
        id: stat.id || `temp-${Date.now()}-${Math.random()}`,
        timestamp: new Date(stat.timestamp || new Date()),
        description: statDescription,
        pointsChange: pointsChange,
        playerName: playerName,
        statType: stat.stat_type as string,
        value: stat.value || 1
      };
    });
  };
  
  const handleRecordStat = (playerId: string, statType: string, value: number) => {
    console.log(`Recording stat: ${statType} = ${value} for player ${playerId}`);
    
    if (isMockGame) {
      const newStat = {
        id: `mock-stat-${Date.now()}-${Math.random()}`,
        player_id: playerId,
        game_id: gameId,
        stat_type: statType,
        value: value,
        timestamp: new Date().toISOString(),
        created_by_user_id: currentUser?.id || 'mock-user'
      };
      
      setLocalStats(prev => [...prev, newStat]);
      console.log(`Mock stat recorded:`, newStat);
    } else {
      recordStat({
        playerId,
        statType: statType as StatType,
        value
      });
    }
    
    const player = players.find(p => p.id === playerId);
    setLatestStat({
      player_id: playerId,
      stat_type: statType,
      value,
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => setLatestStat(null), 2000);
  };

  const handleUndoLastStat = (playerId: string) => {
    if (isMockGame) {
      const playerStats = localStats.filter(stat => stat.player_id === playerId);
      if (playerStats.length > 0) {
        const mostRecent = playerStats.reduce((latest, current) => 
          new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        );
        setLocalStats(prev => prev.filter(stat => stat.id !== mostRecent.id));
        console.log(`Undid stat for player ${playerId}:`, mostRecent);
      }
    } else {
      undoLastStatMutation.mutate({ playerId });
    }
  };

  const handlePhotoUpload = async (player: Player, photoUrl: string) => {
    console.log(`Photo upload for player ${player.name}:`, photoUrl);
    
    setPlayers(prevPlayers => 
      prevPlayers.map(p => 
        p.id === player.id ? { ...p, photoUrl } : p
      )
    );
    
    if (selectedPlayer?.id === player.id) {
      setSelectedPlayer(prev => prev ? { ...prev, photoUrl } : null);
    }
    
    if (isMockGame) {
      const userEmail = currentUser?.email;
      if (userEmail) {
        const manualGamesKey = `gametriq_manual_games_${userEmail}`;
        const linkedGamesKey = `gametriq_linked_games_${userEmail}`;
        
        const manualGames = JSON.parse(localStorage.getItem(manualGamesKey) || '[]');
        const linkedGames = JSON.parse(localStorage.getItem(linkedGamesKey) || '[]');
        
        const updatePlayerPhoto = (games: any[]) => {
          return games.map(game => {
            if (game.id === gameId && game.players) {
              return {
                ...game,
                players: game.players.map((p: any) => 
                  p.id === player.id ? { ...p, photoUrl } : p
                )
              };
            }
            return game;
          });
        };
        
        const updatedManualGames = updatePlayerPhoto(manualGames);
        const updatedLinkedGames = updatePlayerPhoto(linkedGames);
        
        localStorage.setItem(manualGamesKey, JSON.stringify(updatedManualGames));
        localStorage.setItem(linkedGamesKey, JSON.stringify(updatedLinkedGames));
        
        console.log(`Updated player photo for ${player.name} in manual game and local state`);
      }
    } else {
      console.log(`Photo upload would be saved to database for player ${player.name}`);
    }
  };

  const calculatePlayerPoints = (playerId: string): number => {
    const stats = effectiveGameStats.filter(stat => stat.player_id === playerId);
    return stats.reduce((total, stat) => {
      const statType = stat.stat_type as StatType;
      const pointValue = POINT_VALUES[statType] || 0;
      return total + (pointValue * (stat.value || 1));
    }, 0);
  };

  const handlePlayerSelect = (player: Player, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const isStatButton = target.closest('button') || target.closest('[data-stat-recorder]');
    
    if (!isStatButton) {
      console.log(`Selecting player: ${player.name}`);
      setSelectedPlayer(selectedPlayer?.id === player.id ? null : player);
    }
  };
  
  const gameObject = useMemo(() => {
    return {
      id: gameId,
      opponent: gameInfo.opponent,
      date: new Date().toISOString(),
      team_id: "default-team"
    };
  }, [gameId, gameInfo.opponent]);
  
  const calculateCurrentStats = (playerId: string) => {
    const stats = effectiveGameStats.filter(stat => stat.player_id === playerId);
    return stats.reduce((totals, stat) => {
      const statType = stat.stat_type as StatType;
      const value = stat.value || 1;
      
      switch (statType) {
        case 'FG_Made':
          return { ...totals, points: totals.points + (2 * value) };
        case 'ThreePT_Made':
          return { ...totals, points: totals.points + (3 * value) };
        case 'FT_Made':
          return { ...totals, points: totals.points + (1 * value) };
        case 'Assists':
          return { ...totals, assists: totals.assists + value };
        case 'Steals':
          return { ...totals, steals: totals.steals + value };
        case 'Blocks':
          return { ...totals, blocks: totals.blocks + value };
        case 'Rebounds':
          return { ...totals, rebounds: totals.rebounds + value };
        case 'Fouls':
          return { ...totals, fouls: totals.fouls + value };
        default:
          return totals;
      }
    }, { points: 0, assists: 0, steals: 0, blocks: 0, rebounds: 0, fouls: 0 });
  };

  // Convert game stats to individual stat counts for PlayerStatDisplay
  const calculatePlayerStatCounts = (playerId: string) => {
    const playerStats = effectiveGameStats.filter(stat => stat.player_id === playerId);
    console.log('calculatePlayerStatCounts - playerStats for', playerId, ':', playerStats);
    
    const statCounts = {
      fgMade: 0,
      fgMissed: 0,
      threePtMade: 0,
      threePtMissed: 0,
      ftMade: 0,
      ftMissed: 0,
      assists: 0,
      rebounds: 0,
      steals: 0,
      blocks: 0,
      fouls: 0
    };

    playerStats.forEach(stat => {
      const value = stat.value || 1;
      switch (stat.stat_type) {
        case 'FG_Made':
          statCounts.fgMade += value;
          break;
        case 'FG_Missed':
          statCounts.fgMissed += value;
          break;
        case 'ThreePT_Made':
          statCounts.threePtMade += value;
          break;
        case 'ThreePT_Missed':
          statCounts.threePtMissed += value;
          break;
        case 'FT_Made':
          statCounts.ftMade += value;
          break;
        case 'FT_Missed':
          statCounts.ftMissed += value;
          break;
        case 'Assists':
          statCounts.assists += value;
          break;
        case 'Rebounds':
          statCounts.rebounds += value;
          break;
        case 'Steals':
          statCounts.steals += value;
          break;
        case 'Blocks':
          statCounts.blocks += value;
          break;
        case 'Fouls':
          statCounts.fouls += value;
          break;
      }
    });

    console.log('calculatePlayerStatCounts - final statCounts:', statCounts);
    return statCounts;
  };

  const totalScore = players.reduce((total, player) => total + calculatePlayerPoints(player.id), 0);
  
  if (!isMockGame && isLoadingGameStats) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <GametriqLogo size="md" animated />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loading Game Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading player stats...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Filter stats for selected player with debug logging
  const selectedPlayerStats = useMemo(() => {
    if (!selectedPlayer) return [];
    const stats = effectiveGameStats.filter(stat => stat.player_id === selectedPlayer.id);
    console.log(`Stats for player ${selectedPlayer.name}:`, stats);
    return stats;
  }, [selectedPlayer, effectiveGameStats]);

  // Calculate stat counts for selected player
  const selectedPlayerStatCounts = useMemo(() => {
    if (!selectedPlayer) return null;
    const counts = calculatePlayerStatCounts(selectedPlayer.id);
    console.log(`Stat counts for player ${selectedPlayer.name}:`, counts);
    return counts;
  }, [selectedPlayer, effectiveGameStats]);

  // Check if player has any recorded stats
  const hasAnyStats = selectedPlayerStats.length > 0;
  console.log('hasAnyStats:', hasAnyStats);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <GametriqLogo size="md" animated />
      </div>
      
      <GameHeader 
        gameInfo={gameInfo}
        isLiveMode={isLiveMode}
        totalScore={totalScore}
      />

      <OfflineIndicator 
        isOnline={!isMockGame ? isOnline : true}
        offlineQueueLength={offlineQueueLength}
        forceSync={forceSync}
      />
      
      {selectedPlayer ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}'s Stats</h2>
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to All Players
            </button>
          </div>
          
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
              <TabsTrigger value="stats" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Stats & Recording
              </TabsTrigger>
              <TabsTrigger value="charts" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Charts
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="mt-6 space-y-6">
              <Card className="bg-gray-900/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    {selectedPlayer.photoUrl && (
                      <img 
                        src={selectedPlayer.photoUrl} 
                        alt={selectedPlayer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    {selectedPlayer.name} - Game Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlayerStatCounts ? (
                    <PlayerStatDisplay 
                      {...selectedPlayerStatCounts}
                      totalPoints={calculatePlayerPoints(selectedPlayer.id)}
                      statLogs={createStatLogs(selectedPlayer.id)}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No stats available to display</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {isCoach && (
                <Card className="bg-gray-900/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Record Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlayerStatRecorder
                      onRecordStat={(statType: string, value: number) => 
                        handleRecordStat(selectedPlayer.id, statType, value)
                      }
                      isLoading={recordStatMutation.isPending}
                      isCoach={isCoach}
                      isLiveMode={isLiveMode}
                      playerName={selectedPlayer.name}
                    />
                  </CardContent>
                </Card>
              )}

            </TabsContent>
            
            <TabsContent value="charts" className="mt-6">
              <Card className="bg-gray-900/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Charts</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasAnyStats ? (
                    <PlayerStatsCharts 
                      statRecords={selectedPlayerStats} 
                      playerName={selectedPlayer.name}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No stats recorded yet for charts</p>
                      <p className="text-sm">Record some stats to see performance charts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-6">
              <Card className="bg-gray-900/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Game Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasAnyStats ? (
                    <StatTimeline 
                      stats={selectedPlayerStats} 
                      players={players} 
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No stats recorded yet for timeline</p>
                      <p className="text-sm">Record some stats to see the game timeline</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <StatRecordingVisualFeedback 
            latestStat={latestStat} 
            playerId={selectedPlayer.id}
            playerName={selectedPlayer.name}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main content area - takes up 3/4 of the width */}
          <div className="xl:col-span-3">
            {isCoach && (
              <GameSummary 
                gameStats={effectiveGameStats}
                gameObject={gameObject}
                players={players}
              />
            )}
            
            <PlayerGrid
              players={players}
              isCoach={true}
              recordStatMutation={recordStatMutation}
              onRecordStat={handleRecordStat}
              onUploadPhoto={handlePhotoUpload}
              effectiveGameStats={effectiveGameStats}
              createStatLogs={createStatLogs}
              gameId={gameId}
              onUndoLastStat={handleUndoLastStat}
              onPlayerSelect={handlePlayerSelect}
              latestStat={latestStat}
            />
          </div>

          {/* Timeline sidebar - takes up 1/4 of the width on the right */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <GameTimeline
                gameStats={effectiveGameStats}
                players={players}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
