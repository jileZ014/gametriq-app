
import React, { useMemo } from 'react';
import { Player, Game, StatRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface PlayerProgressProps {
  player: Player;
  games: Game[];
  statsByGame: Record<string, StatRecord[]>;
}

const PlayerProgress: React.FC<PlayerProgressProps> = ({
  player,
  games,
  statsByGame
}) => {
  const progressData = useMemo(() => {
    const sortedGames = [...games].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const data = sortedGames.map(game => {
      const gameStats = (statsByGame[game.id] || [])
        .filter(stat => stat.player_id === player.id);
      
      // Calculate totals for this game
      let points = 0;
      let rebounds = 0;
      let assists = 0;
      let steals = 0;
      let blocks = 0;
      
      gameStats.forEach(stat => {
        const value = stat.value || 1;
        
        switch (stat.stat_type) {
          case 'FG_Made':
            points += 2 * value;
            break;
          case 'ThreePT_Made':
            points += 3 * value;
            break;
          case 'FT_Made':
            points += value;
            break;
          case 'Rebounds':
            rebounds += value;
            break;
          case 'Assists':
            assists += value;
            break;
          case 'Steals':
            steals += value;
            break;
          case 'Blocks':
            blocks += value;
            break;
        }
      });
      
      return {
        gameId: game.id,
        date: new Date(game.date),
        opponent: game.opponent,
        formattedDate: format(new Date(game.date), 'MMM d'),
        points,
        rebounds,
        assists,
        steals,
        blocks
      };
    });
    
    return data;
  }, [games, statsByGame, player.id]);
  
  const calculateImprovements = () => {
    if (progressData.length < 2) return null;
    
    const firstGame = progressData[0];
    const lastGame = progressData[progressData.length - 1];
    
    // Calculate percentage improvements
    const pointsImprovement = firstGame.points > 0 
      ? ((lastGame.points - firstGame.points) / firstGame.points) * 100 
      : (lastGame.points > 0 ? 100 : 0);
    
    const reboundsImprovement = firstGame.rebounds > 0 
      ? ((lastGame.rebounds - firstGame.rebounds) / firstGame.rebounds) * 100 
      : (lastGame.rebounds > 0 ? 100 : 0);
    
    const assistsImprovement = firstGame.assists > 0 
      ? ((lastGame.assists - firstGame.assists) / firstGame.assists) * 100 
      : (lastGame.assists > 0 ? 100 : 0);
    
    return {
      points: {
        value: pointsImprovement,
        positive: pointsImprovement >= 0,
        first: firstGame.points,
        last: lastGame.points
      },
      rebounds: {
        value: reboundsImprovement,
        positive: reboundsImprovement >= 0,
        first: firstGame.rebounds,
        last: lastGame.rebounds
      },
      assists: {
        value: assistsImprovement,
        positive: assistsImprovement >= 0,
        first: firstGame.assists,
        last: lastGame.assists
      }
    };
  };
  
  const improvements = useMemo(() => calculateImprovements(), [progressData]);
  
  if (progressData.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No game data available for progress tracking</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Scoring Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'points' ? 'Points' : name]}
                  labelFormatter={(label) => `Game: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  name="Points" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {improvements && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Points</span>
                  <span className={`text-sm font-medium ${
                    improvements.points.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {improvements.points.value.toFixed(1)}% 
                    {improvements.points.positive ? '↑' : '↓'}
                  </span>
                </div>
                <Progress 
                  value={improvements.points.positive ? 
                    Math.min(100, improvements.points.value) : 0} 
                  className="h-2"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>First: {improvements.points.first}</span>
                  <span>Latest: {improvements.points.last}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Rebounds</span>
                  <span className={`text-sm font-medium ${
                    improvements.rebounds.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {improvements.rebounds.value.toFixed(1)}% 
                    {improvements.rebounds.positive ? '↑' : '↓'}
                  </span>
                </div>
                <Progress 
                  value={improvements.rebounds.positive ? 
                    Math.min(100, improvements.rebounds.value) : 0} 
                  className="h-2"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>First: {improvements.rebounds.first}</span>
                  <span>Latest: {improvements.rebounds.last}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Assists</span>
                  <span className={`text-sm font-medium ${
                    improvements.assists.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {improvements.assists.value.toFixed(1)}% 
                    {improvements.assists.positive ? '↑' : '↓'}
                  </span>
                </div>
                <Progress 
                  value={improvements.assists.positive ? 
                    Math.min(100, improvements.assists.value) : 0} 
                  className="h-2"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>First: {improvements.assists.first}</span>
                  <span>Latest: {improvements.assists.last}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Game-by-Game Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Opponent</th>
                  <th className="px-4 py-2 text-center">PTS</th>
                  <th className="px-4 py-2 text-center">REB</th>
                  <th className="px-4 py-2 text-center">AST</th>
                  <th className="px-4 py-2 text-center">STL</th>
                  <th className="px-4 py-2 text-center">BLK</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map(game => (
                  <tr key={game.gameId} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-2">{game.formattedDate}</td>
                    <td className="px-4 py-2">{game.opponent}</td>
                    <td className="px-4 py-2 text-center font-medium">{game.points}</td>
                    <td className="px-4 py-2 text-center">{game.rebounds}</td>
                    <td className="px-4 py-2 text-center">{game.assists}</td>
                    <td className="px-4 py-2 text-center">{game.steals}</td>
                    <td className="px-4 py-2 text-center">{game.blocks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProgress;
