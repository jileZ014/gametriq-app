
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player, Game, StatRecord, StatType } from '@/types';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeasonSummaryProps {
  players: Player[];
  games: Game[];
  statsByGame: Record<string, StatRecord[]>;
}

const SeasonSummary: React.FC<SeasonSummaryProps> = ({
  players,
  games,
  statsByGame
}) => {
  // Calculate season stats for all players
  const playerStats = useMemo(() => {
    return players.map(player => {
      // Get all stats for this player across all games
      const allStats = Object.values(statsByGame)
        .flat()
        .filter(stat => stat.player_id === player.id);
      
      // Calculate totals
      const totals = {
        points: 0,
        fgMade: 0,
        fgAttempts: 0,
        threePtMade: 0,
        threePtAttempts: 0,
        ftMade: 0,
        ftAttempts: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        fouls: 0,
        gamesPlayed: 0
      };
      
      // Calculate which games the player has stats in
      const playerGames = new Set<string>();
      
      allStats.forEach(stat => {
        const value = stat.value || 1;
        playerGames.add(stat.game_id);
        
        switch (stat.stat_type) {
          case 'FG_Made':
            totals.points += 2 * value;
            totals.fgMade += value;
            totals.fgAttempts += value;
            break;
          case 'FG_Missed':
            totals.fgAttempts += value;
            break;
          case 'ThreePT_Made':
            totals.points += 3 * value;
            totals.threePtMade += value;
            totals.threePtAttempts += value;
            break;
          case 'ThreePT_Missed':
            totals.threePtAttempts += value;
            break;
          case 'FT_Made':
            totals.points += value;
            totals.ftMade += value;
            totals.ftAttempts += value;
            break;
          case 'FT_Missed':
            totals.ftAttempts += value;
            break;
          case 'Rebounds':
            totals.rebounds += value;
            break;
          case 'Assists':
            totals.assists += value;
            break;
          case 'Steals':
            totals.steals += value;
            break;
          case 'Blocks':
            totals.blocks += value;
            break;
          case 'Fouls':
            totals.fouls += value;
            break;
        }
      });
      
      totals.gamesPlayed = playerGames.size;
      
      // Calculate percentages and averages
      const fgPercentage = totals.fgAttempts > 0 ? (totals.fgMade / totals.fgAttempts) * 100 : 0;
      const threePtPercentage = totals.threePtAttempts > 0 ? (totals.threePtMade / totals.threePtAttempts) * 100 : 0;
      const ftPercentage = totals.ftAttempts > 0 ? (totals.ftMade / totals.ftAttempts) * 100 : 0;
      
      const ppg = totals.gamesPlayed > 0 ? totals.points / totals.gamesPlayed : 0;
      const rpg = totals.gamesPlayed > 0 ? totals.rebounds / totals.gamesPlayed : 0;
      const apg = totals.gamesPlayed > 0 ? totals.assists / totals.gamesPlayed : 0;
      const spg = totals.gamesPlayed > 0 ? totals.steals / totals.gamesPlayed : 0;
      const bpg = totals.gamesPlayed > 0 ? totals.blocks / totals.gamesPlayed : 0;
      
      return {
        player,
        totals,
        fgPercentage,
        threePtPercentage,
        ftPercentage,
        ppg,
        rpg,
        apg,
        spg,
        bpg
      };
    }).sort((a, b) => b.totals.points - a.totals.points); // Sort by points (descending)
  }, [players, statsByGame]);
  
  // Team totals
  const teamTotals = useMemo(() => {
    return {
      gamesPlayed: games.length,
      totalPoints: playerStats.reduce((sum, p) => sum + p.totals.points, 0),
      avgPointsPerGame: games.length > 0 ? 
        playerStats.reduce((sum, p) => sum + p.totals.points, 0) / games.length : 0
    };
  }, [games, playerStats]);
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <CardTitle className="text-xl text-white">Season Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="team">
          <TabsList className="mb-4">
            <TabsTrigger value="team">Team Stats</TabsTrigger>
            <TabsTrigger value="players">Player Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm text-gray-500">Games Played</h3>
                  <p className="text-3xl font-bold">{teamTotals.gamesPlayed}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm text-gray-500">Total Points</h3>
                  <p className="text-3xl font-bold">{teamTotals.totalPoints}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm text-gray-500">Avg Points Per Game</h3>
                  <p className="text-3xl font-bold">{teamTotals.avgPointsPerGame.toFixed(1)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Team Leaders</h3>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Points</h4>
                  <div className="space-y-2">
                    {playerStats.slice(0, 3).map((ps, index) => (
                      <div key={ps.player.id} className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{ps.player.name}</span>
                        <span className="text-sm">{ps.totals.points} pts</span>
                        <span className="text-xs text-gray-500">
                          ({ps.ppg.toFixed(1)} ppg)
                        </span>
                        <Progress 
                          value={(ps.totals.points / (playerStats[0].totals.points || 1)) * 100} 
                          className="h-2 flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Rebounds</h4>
                  <div className="space-y-2">
                    {[...playerStats].sort((a, b) => b.totals.rebounds - a.totals.rebounds).slice(0, 3).map((ps, index) => (
                      <div key={ps.player.id} className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{ps.player.name}</span>
                        <span className="text-sm">{ps.totals.rebounds} reb</span>
                        <span className="text-xs text-gray-500">
                          ({ps.rpg.toFixed(1)} rpg)
                        </span>
                        <Progress 
                          value={(ps.totals.rebounds / ([...playerStats].sort((a, b) => b.totals.rebounds - a.totals.rebounds)[0].totals.rebounds || 1)) * 100} 
                          className="h-2 flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Assists</h4>
                  <div className="space-y-2">
                    {[...playerStats].sort((a, b) => b.totals.assists - a.totals.assists).slice(0, 3).map((ps, index) => (
                      <div key={ps.player.id} className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{ps.player.name}</span>
                        <span className="text-sm">{ps.totals.assists} ast</span>
                        <span className="text-xs text-gray-500">
                          ({ps.apg.toFixed(1)} apg)
                        </span>
                        <Progress 
                          value={(ps.totals.assists / ([...playerStats].sort((a, b) => b.totals.assists - a.totals.assists)[0].totals.assists || 1)) * 100} 
                          className="h-2 flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="players">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Player</th>
                    <th className="px-4 py-2 text-center">GP</th>
                    <th className="px-4 py-2 text-center">PPG</th>
                    <th className="px-4 py-2 text-center">RPG</th>
                    <th className="px-4 py-2 text-center">APG</th>
                    <th className="px-4 py-2 text-center">FG%</th>
                    <th className="px-4 py-2 text-center">3PT%</th>
                    <th className="px-4 py-2 text-center">FT%</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.map(ps => (
                    <tr key={ps.player.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div className="font-medium">{ps.player.name}</div>
                        {ps.player.playerNumber && (
                          <div className="text-xs text-gray-500">#{ps.player.playerNumber}</div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">{ps.totals.gamesPlayed}</td>
                      <td className="px-4 py-2 text-center font-medium">{ps.ppg.toFixed(1)}</td>
                      <td className="px-4 py-2 text-center">{ps.rpg.toFixed(1)}</td>
                      <td className="px-4 py-2 text-center">{ps.apg.toFixed(1)}</td>
                      <td className="px-4 py-2 text-center">
                        {ps.fgPercentage.toFixed(1)}%
                      </td>
                      <td className="px-4 py-2 text-center">
                        {ps.threePtPercentage.toFixed(1)}%
                      </td>
                      <td className="px-4 py-2 text-center">
                        {ps.ftPercentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeasonSummary;
