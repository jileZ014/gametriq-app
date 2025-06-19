
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player, Game, StatRecord } from '@/types';
import PlayerDevelopmentChart from './PlayerDevelopmentChart';
import SeasonSummary from './SeasonSummary';
import PlayerProgress from './PlayerProgress';
import ShotChart from './ShotChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlayerAnalyticsPageProps {
  players: Player[];
  games: Game[];
  statsByGame: Record<string, StatRecord[]>;
}

const PlayerAnalyticsPage: React.FC<PlayerAnalyticsPageProps> = ({
  players,
  games,
  statsByGame
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    players.length > 0 ? players[0].id : ''
  );

  const selectedPlayer = useMemo(() => {
    return players.find(p => p.id === selectedPlayerId);
  }, [players, selectedPlayerId]);

  // Get all stat records for the selected player
  const playerStatRecords = useMemo(() => {
    if (!selectedPlayer) return [];
    
    const allStats: StatRecord[] = [];
    Object.values(statsByGame).forEach(gameStats => {
      const playerStats = gameStats.filter(stat => stat.player_id === selectedPlayer.id);
      allStats.push(...playerStats);
    });
    return allStats;
  }, [selectedPlayer, statsByGame]);

  if (players.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg text-gray-500">No players available for analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Player Development Analytics</CardTitle>
            <Select 
              value={selectedPlayerId}
              onValueChange={setSelectedPlayerId}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select a player" />
              </SelectTrigger>
              <SelectContent>
                {players.map(player => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedPlayer ? (
            <Tabs defaultValue="development">
              <TabsList>
                <TabsTrigger value="development">Development Charts</TabsTrigger>
                <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
                <TabsTrigger value="shotchart">Shot Chart</TabsTrigger>
                <TabsTrigger value="season">Season Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="development" className="pt-6">
                <PlayerDevelopmentChart 
                  player={selectedPlayer}
                  games={games}
                  statsByGame={statsByGame}
                />
              </TabsContent>
              
              <TabsContent value="progress" className="pt-6">
                <PlayerProgress
                  player={selectedPlayer}
                  games={games}
                  statsByGame={statsByGame}
                />
              </TabsContent>
              
              <TabsContent value="shotchart" className="pt-6">
                <ShotChart
                  playerName={selectedPlayer.name}
                  statRecords={playerStatRecords}
                />
              </TabsContent>
              
              <TabsContent value="season" className="pt-6">
                <SeasonSummary 
                  players={players}
                  games={games}
                  statsByGame={statsByGame}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-4">
              <p>Select a player to view analytics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerAnalyticsPage;
