
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { StatRecord } from '@/services/StatsService';
import { Player } from '@/types';

interface GameTimelineProps {
  gameStats: StatRecord[];
  players: Player[];
}

const GameTimeline: React.FC<GameTimelineProps> = ({ gameStats, players }) => {
  // Get recent stats for timeline (last 10 stats across all players)
  const recentStats = gameStats
    .sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime())
    .slice(0, 10);

  const getPlayerName = (playerId: string): string => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  const formatStatType = (statType: string): string => {
    return statType.replace('_', ' ');
  };

  const getStatIcon = (statType: string) => {
    if (statType.includes('Made')) return '✓';
    if (statType.includes('Missed')) return '✗';
    if (statType === 'Rebounds') return '🏀';
    if (statType === 'Assists') return '🤝';
    if (statType === 'Steals') return '🔥';
    if (statType === 'Blocks') return '🛡️';
    if (statType === 'Fouls') return '⚠️';
    return '📊';
  };

  const getStatColor = (statType: string): string => {
    if (statType.includes('Made')) return 'bg-green-500';
    if (statType.includes('Missed')) return 'bg-red-500';
    if (statType === 'Rebounds') return 'bg-amber-500';
    if (statType === 'Assists') return 'bg-purple-500';
    if (statType === 'Steals') return 'bg-teal-500';
    if (statType === 'Blocks') return 'bg-cyan-500';
    if (statType === 'Fouls') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (recentStats.length === 0) {
    return (
      <Card className="bg-gray-900/80 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Game Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No activity yet</p>
            <p className="text-sm">Stats will appear here as they are recorded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/80 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Game Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="border-l-2 border-gray-600 ml-3 pl-6 space-y-3">
            {recentStats.map((stat, index) => (
              <div key={stat.id || index} className="relative -ml-8">
                {/* Timeline dot */}
                <div className={`absolute -left-1 top-1 w-3 h-3 rounded-full border-2 border-gray-700 ${getStatColor(stat.stat_type)}`}></div>
                
                {/* Timeline content */}
                <div className="pl-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {getStatIcon(stat.stat_type)} {getPlayerName(stat.player_id)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatStatType(stat.stat_type)}
                      </span>
                      {/* Points indicator */}
                      {stat.stat_type === 'FG_Made' && <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">+2</span>}
                      {stat.stat_type === 'ThreePT_Made' && <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">+3</span>}
                      {stat.stat_type === 'FT_Made' && <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">+1</span>}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(stat.timestamp || '').toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameTimeline;
