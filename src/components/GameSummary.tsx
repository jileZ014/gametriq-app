
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Player, Game } from "@/types";
import { StatRecord } from "@/services/StatsService";

interface GameSummaryProps {
  gameStats: StatRecord[];
  gameObject: Game;
  players: Player[];
}

const GameSummary: React.FC<GameSummaryProps> = ({ gameStats, gameObject, players }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <CardTitle className="text-white">Game Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Points</div>
            <div className="text-2xl font-bold">
              {gameStats.filter(s => ['FG_Made', 'ThreePT_Made', 'FT_Made'].includes(s.stat_type))
                .reduce((total, stat) => {
                  const points = stat.stat_type === 'FG_Made' ? 2 : 
                               stat.stat_type === 'ThreePT_Made' ? 3 : 1;
                  return total + (points * (stat.value || 1));
                }, 0)}
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400">Field Goals</div>
            <div className="text-2xl font-bold">
              {gameStats.filter(s => s.stat_type === 'FG_Made').reduce((t, s) => t + (s.value || 1), 0)}/
              {gameStats.filter(s => ['FG_Made', 'FG_Missed'].includes(s.stat_type)).reduce((t, s) => t + (s.value || 1), 0)}
            </div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
            <div className="text-sm text-indigo-600 dark:text-indigo-400">3-Pointers</div>
            <div className="text-2xl font-bold">
              {gameStats.filter(s => s.stat_type === 'ThreePT_Made').reduce((t, s) => t + (s.value || 1), 0)}/
              {gameStats.filter(s => ['ThreePT_Made', 'ThreePT_Missed'].includes(s.stat_type)).reduce((t, s) => t + (s.value || 1), 0)}
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
            <div className="text-sm text-amber-600 dark:text-amber-400">Rebounds</div>
            <div className="text-2xl font-bold">
              {gameStats.filter(s => s.stat_type === 'Rebounds').reduce((t, s) => t + (s.value || 1), 0)}
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400">Assists</div>
            <div className="text-2xl font-bold">
              {gameStats.filter(s => s.stat_type === 'Assists').reduce((t, s) => t + (s.value || 1), 0)}
            </div>
          </div>
          
          <div className="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg">
            <div className="text-sm text-cyan-600 dark:text-cyan-400">Steals</div>
            <div className="text-2xl font-bold">
              {gameStats.filter(s => s.stat_type === 'Steals').reduce((t, s) => t + (s.value || 1), 0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSummary;
