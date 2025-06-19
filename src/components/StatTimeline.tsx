
import React from 'react';
import { StatRecord } from '@/services/StatsService';
import { format } from 'date-fns';
import { 
  Target, X, Award, Shield, Clock, User
} from 'lucide-react';
import { Player } from '@/types';

interface StatTimelineProps {
  stats: StatRecord[];
  players: Player[];
}

const StatTimeline: React.FC<StatTimelineProps> = ({ stats, players }) => {
  // Get player by ID 
  const getPlayerName = (playerId: string): string => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };
  
  // Get icon by stat type
  const getStatIcon = (statType: string) => {
    switch (statType) {
      case 'FG_Made':
      case 'ThreePT_Made':
      case 'FT_Made':
        return <Target className="h-5 w-5 text-green-500" />;
      case 'FG_Missed':
      case 'ThreePT_Missed':
      case 'FT_Missed':
        return <X className="h-5 w-5 text-red-500" />;
      case 'Rebounds':
        return <Shield className="h-5 w-5 text-amber-500" />;
      case 'Assists':
        return <Award className="h-5 w-5 text-purple-500" />;
      case 'Steals':
        return <Shield className="h-5 w-5 text-teal-500" />;
      case 'Blocks':
        return <Shield className="h-5 w-5 text-cyan-500" />;
      case 'Fouls':
        return <X className="h-5 w-5 text-yellow-500" />;
      default:
        return <X className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get color class by stat type
  const getStatColor = (statType: string): string => {
    if (statType.includes('Made')) return 'border-green-500';
    if (statType.includes('Missed')) return 'border-red-500';
    if (statType === 'Rebounds') return 'border-amber-500';
    if (statType === 'Assists') return 'border-purple-500';
    if (statType === 'Steals') return 'border-teal-500';
    if (statType === 'Blocks') return 'border-cyan-500';
    if (statType === 'Fouls') return 'border-yellow-500';
    return 'border-gray-500';
  };
  
  // Format stat type for display
  const formatStatType = (statType: string): string => {
    return statType.replace('_', ' ');
  };
  
  // Sort stats by timestamp (newest first)
  const sortedStats = [...stats].sort((a, b) => {
    return new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime();
  });
  
  if (sortedStats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p className="text-lg">No stats recorded yet</p>
        <p className="text-sm">Stats will appear here as they are recorded</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 py-2">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Clock className="h-5 w-5" />
        Game Timeline
      </h3>
      
      <div className="border-l-2 border-gray-200 ml-3 pl-8 space-y-4 py-4">
        {sortedStats.map((stat, index) => (
          <div 
            key={stat.id || index}
            className={`relative -ml-9 transition-all duration-200 hover:translate-x-1`}
          >
            {/* Icon dot */}
            <div 
              className={`absolute top-1 -left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 ${getStatColor(stat.stat_type)}`}
            >
              {getStatIcon(stat.stat_type)}
            </div>
            
            {/* Content */}
            <div className="pl-2 pb-2">
              <div className="text-sm flex items-center gap-2 font-medium">
                <span>{formatStatType(stat.stat_type)}</span>
                
                {/* Points indicator */}
                {stat.stat_type === 'FG_Made' && <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">+2</span>}
                {stat.stat_type === 'ThreePT_Made' && <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">+3</span>}
                {stat.stat_type === 'FT_Made' && <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">+1</span>}
              </div>
              
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{getPlayerName(stat.player_id)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(stat.timestamp || ''), 'h:mm a')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatTimeline;
