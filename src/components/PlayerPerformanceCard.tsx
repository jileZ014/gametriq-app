
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Target, Shield } from 'lucide-react';

interface PlayerPerformanceCardProps {
  player: {
    name: string;
    number: string;
    position: string;
    photo?: string;
  };
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
  };
  gameInfo?: {
    opponent: string;
    date: string;
  };
}

const PlayerPerformanceCard: React.FC<PlayerPerformanceCardProps> = ({
  player,
  stats,
  gameInfo
}) => {
  // Calculate performance badges
  const getPerformanceBadges = () => {
    const badges = [];
    
    if (stats.points >= 10) {
      badges.push({
        text: "🔥 Hot Game",
        className: "bg-red-500/20 text-red-400 border-red-500/30"
      });
    }
    
    if (stats.assists >= 5) {
      badges.push({
        text: "🎯 Assist Leader", 
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30"
      });
    }
    
    if ((stats.steals + stats.blocks) >= 3) {
      badges.push({
        text: "🛡️ Defensive Anchor",
        className: "bg-green-500/20 text-green-400 border-green-500/30"
      });
    }
    
    return badges;
  };

  const performanceBadges = getPerformanceBadges();
  const hasActiveBadge = performanceBadges.length > 0;

  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700 ${
      hasActiveBadge ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''
    }`}>
      <CardContent className="p-6">
        {/* Header with player info */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16 border-4 border-white/20">
            <AvatarImage src={player.photo} alt={player.name} />
            <AvatarFallback className="bg-gray-700 text-white text-xl">
              {player.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{player.name}</h2>
            <p className="text-gray-300">#{player.number} • {player.position}</p>
            {gameInfo && (
              <p className="text-sm text-gray-400">vs {gameInfo.opponent} • {gameInfo.date}</p>
            )}
          </div>
          
          {/* Performance badges */}
          <div className="flex flex-col space-y-1">
            {performanceBadges.map((badge, index) => (
              <Badge 
                key={index}
                className={`${badge.className} border text-xs font-medium px-2 py-1`}
              >
                {badge.text}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats highlights in 3-section layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Points */}
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-300">Points</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.points}</div>
          </div>

          {/* Rebounds */}
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-300">Rebounds</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.rebounds}</div>
          </div>

          {/* Assists */}
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-gray-300">Assists</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.assists}</div>
          </div>
        </div>

        {/* Additional stats row */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
            <span className="text-xs text-gray-400 block">Steals</span>
            <span className="text-xl font-semibold text-white">{stats.steals}</span>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
            <span className="text-xs text-gray-400 block">Blocks</span>
            <span className="text-xl font-semibold text-white">{stats.blocks}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerPerformanceCard;
