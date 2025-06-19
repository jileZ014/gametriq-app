
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { OpponentTeam } from '@/types';

interface OpponentRosterProps {
  opponentTeam: OpponentTeam;
  className?: string;
}

const OpponentRoster: React.FC<OpponentRosterProps> = ({ 
  opponentTeam, 
  className = "" 
}) => {
  return (
    <Card className={`bg-red-50 border-red-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Users className="h-5 w-5" />
          {opponentTeam.team_name}
          <Badge variant="secondary" className="ml-auto">
            {opponentTeam.players.length} players
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {opponentTeam.players.map((player) => (
            <div 
              key={player.id}
              className="flex items-center gap-2 p-2 bg-white rounded-md border border-red-100"
            >
              {player.jersey_number && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-1 py-0 min-w-[24px] justify-center border-red-300 text-red-700"
                >
                  {player.jersey_number}
                </Badge>
              )}
              <span className="text-sm text-gray-700 truncate">
                {player.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpponentRoster;
