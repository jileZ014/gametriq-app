
import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/types';
import { StatRecord } from '@/services/StatsService';
import PlayerStatDisplay from './PlayerStatDisplay';
import PlayerStatRecorder from './PlayerStatRecorder';
import PlayerStatsCharts from './PlayerStatsCharts';
import StatTimeline from './StatTimeline';
import { StatLogEntryData } from './StatLogEntry';
import { POINT_VALUES, StatType } from '@/types';

interface PlayerDetailedViewProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  gameStats: StatRecord[];
  isCoach: boolean;
  onRecordStat: (playerId: string, statType: string, value: number) => void;
  isLoading: boolean;
  players: Player[];
}

const PlayerDetailedView: React.FC<PlayerDetailedViewProps> = ({
  player,
  isOpen,
  onClose,
  gameStats,
  isCoach,
  onRecordStat,
  isLoading,
  players
}) => {
  // Filter stats for this player
  const playerStats = useMemo(() => {
    return gameStats.filter(stat => stat.player_id === player.id);
  }, [gameStats, player.id]);

  // Calculate stat counts for PlayerStatDisplay
  const playerStatCounts = useMemo(() => {
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

    return statCounts;
  }, [playerStats]);

  // Calculate total points
  const totalPoints = useMemo(() => {
    return playerStats.reduce((total, stat) => {
      const statType = stat.stat_type as StatType;
      const pointValue = POINT_VALUES[statType] || 0;
      return total + (pointValue * (stat.value || 1));
    }, 0);
  }, [playerStats]);

  // Create stat logs
  const statLogs = useMemo((): StatLogEntryData[] => {
    return playerStats.map(stat => {
      let pointsChange = 0;
      const statType = stat.stat_type as StatType;
      pointsChange = POINT_VALUES[statType] * (stat.value || 1);
      
      const statDescription = `${player.name}: ${stat.stat_type.replace('_', ' ')}`;
      
      return {
        id: stat.id || `temp-${Date.now()}-${Math.random()}`,
        timestamp: new Date(stat.timestamp || new Date()),
        description: statDescription,
        pointsChange: pointsChange,
        playerName: player.name,
        statType: stat.stat_type as string,
        value: stat.value || 1
      };
    });
  }, [playerStats, player.name]);

  const hasStats = playerStats.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            {player.photoUrl && (
              <img 
                src={player.photoUrl} 
                alt={player.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            {player.name} - Detailed Statistics
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="stats" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Stats & Recording
            </TabsTrigger>
            <TabsTrigger value="charts" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Performance Charts
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Game Timeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-6 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Current Game Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <PlayerStatDisplay 
                  {...playerStatCounts}
                  totalPoints={totalPoints}
                  statLogs={statLogs}
                />
              </CardContent>
            </Card>

            {isCoach && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Record New Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <PlayerStatRecorder
                    onRecordStat={(statType: string, value: number) => 
                      onRecordStat(player.id, statType, value)
                    }
                    isLoading={isLoading}
                    isCoach={isCoach}
                    playerName={player.name}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="charts" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {hasStats ? (
                  <PlayerStatsCharts 
                    statRecords={playerStats} 
                    playerName={player.name}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-lg mb-2">No Stats Recorded Yet</p>
                    <p className="text-sm">Record some stats to see performance charts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Game Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {hasStats ? (
                  <StatTimeline 
                    stats={playerStats} 
                    players={players} 
                  />
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-lg mb-2">No Timeline Available</p>
                    <p className="text-sm">Record some stats to see the game timeline</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailedView;
