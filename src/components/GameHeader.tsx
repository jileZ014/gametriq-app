
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface GameHeaderProps {
  gameInfo: {
    teamName: string;
    opponent: string;
    date: string;
    location: string;
    gameType: string;
  };
  isLiveMode: boolean;
  totalScore: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameInfo, isLiveMode, totalScore }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-800">
      <CardContent className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              {gameInfo.teamName} vs {gameInfo.opponent}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-blue-200">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{gameInfo.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{gameInfo.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{gameInfo.gameType}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {isLiveMode ? "Live Game" : "Game View"}
            </Badge>
            <div className="text-right">
              <div className="text-sm text-blue-200">Total Score</div>
              <div className="text-3xl font-bold text-white">{totalScore}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHeader;
