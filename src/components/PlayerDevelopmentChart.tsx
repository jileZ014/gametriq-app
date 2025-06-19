
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { format } from 'date-fns';
import { Player, Game, StatRecord } from '@/types';

interface PlayerDevelopmentChartProps {
  player: Player;
  games: Game[];
  statsByGame: Record<string, StatRecord[]>;
}

const PlayerDevelopmentChart: React.FC<PlayerDevelopmentChartProps> = ({
  player,
  games,
  statsByGame
}) => {
  // Calculate stats per game for trend analysis
  const gameStats = useMemo(() => {
    return games.map(game => {
      const gameDate = new Date(game.date);
      const stats = statsByGame[game.id] || [];
      const playerStats = stats.filter(stat => stat.player_id === player.id);
      
      // Initialize stats
      let points = 0;
      let rebounds = 0;
      let assists = 0;
      let steals = 0;
      let blocks = 0;
      let fgMade = 0;
      let fgAttempts = 0;
      let threePtMade = 0;
      let threePtAttempts = 0;
      let ftMade = 0;
      let ftAttempts = 0;
      
      // Calculate totals
      playerStats.forEach(stat => {
        const value = stat.value || 1;
        
        switch (stat.stat_type) {
          case 'FG_Made':
            points += 2 * value;
            fgMade += value;
            fgAttempts += value;
            break;
          case 'FG_Missed':
            fgAttempts += value;
            break;
          case 'ThreePT_Made':
            points += 3 * value;
            threePtMade += value;
            threePtAttempts += value;
            break;
          case 'ThreePT_Missed':
            threePtAttempts += value;
            break;
          case 'FT_Made':
            points += value;
            ftMade += value;
            ftAttempts += value;
            break;
          case 'FT_Missed':
            ftAttempts += value;
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
      
      // Calculate percentages
      const fgPercentage = fgAttempts > 0 ? Math.round((fgMade / fgAttempts) * 100) : 0;
      const threePtPercentage = threePtAttempts > 0 ? Math.round((threePtMade / threePtAttempts) * 100) : 0;
      const ftPercentage = ftAttempts > 0 ? Math.round((ftMade / ftAttempts) * 100) : 0;
      
      // For radar chart - normalized stats (0-100 scale)
      const maxPoints = 30; // Benchmark for 100%
      const maxRebounds = 15;
      const maxAssists = 10;
      const maxSteals = 5;
      const maxBlocks = 5;
      
      const normalizedPoints = Math.min(100, Math.round((points / maxPoints) * 100));
      const normalizedRebounds = Math.min(100, Math.round((rebounds / maxRebounds) * 100));
      const normalizedAssists = Math.min(100, Math.round((assists / maxAssists) * 100));
      const normalizedSteals = Math.min(100, Math.round((steals / maxSteals) * 100));
      const normalizedBlocks = Math.min(100, Math.round((blocks / maxBlocks) * 100));
      
      return {
        gameId: game.id,
        opponent: game.opponent,
        date: gameDate,
        dateFormatted: format(gameDate, 'MMM d'),
        points,
        rebounds,
        assists,
        steals,
        blocks,
        fgMade,
        fgAttempts,
        fgPercentage,
        threePtMade,
        threePtAttempts,
        threePtPercentage,
        ftMade,
        ftAttempts,
        ftPercentage,
        // Normalized stats for radar
        normalizedPoints,
        normalizedRebounds,
        normalizedAssists,
        normalizedSteals,
        normalizedBlocks
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date
  }, [games, statsByGame, player.id]);
  
  // Create radar data for the chart
  const radarData = useMemo(() => {
    if (gameStats.length === 0) return [];
    
    const latestGameStats = gameStats[gameStats.length - 1];
    return [
      { name: 'Points', value: latestGameStats.normalizedPoints },
      { name: 'Rebounds', value: latestGameStats.normalizedRebounds },
      { name: 'Assists', value: latestGameStats.normalizedAssists },
      { name: 'Steals', value: latestGameStats.normalizedSteals },
      { name: 'Blocks', value: latestGameStats.normalizedBlocks },
    ];
  }, [gameStats]);
  
  // No data check
  if (gameStats.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No game data available for player development tracking</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Points Per Game</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gameStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateFormatted" />
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
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Shooting Percentages</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gameStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateFormatted" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name === 'fgPercentage' ? 'FG%' : name === 'threePtPercentage' ? '3PT%' : 'FT%']}
                labelFormatter={(label) => `Game: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="fgPercentage" 
                name="FG%" 
                stroke="#82ca9d" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="threePtPercentage" 
                name="3PT%" 
                stroke="#8884d8" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="ftPercentage" 
                name="FT%" 
                stroke="#ffc658" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Stats Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gameStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateFormatted" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rebounds" name="Rebounds" fill="#82ca9d" />
              <Bar dataKey="assists" name="Assists" fill="#8884d8" />
              <Bar dataKey="steals" name="Steals" fill="#ffc658" />
              <Bar dataKey="blocks" name="Blocks" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Radar (Latest Game)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar 
                name="Stats" 
                dataKey="value" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlayerDevelopmentChart;
