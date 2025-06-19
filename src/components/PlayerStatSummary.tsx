
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeFilterOption } from "./StatTimeFilter";

interface PlayerStatSummaryProps {
  timeFilter: TimeFilterOption;
  visiblePlayers: any[];
  getPointsForPlayer: (playerId: string) => number;
  getStatTotalFor: (playerId: string, statType: string) => number;
}

const PlayerStatSummary: React.FC<PlayerStatSummaryProps> = ({
  timeFilter,
  visiblePlayers,
  getPointsForPlayer,
  getStatTotalFor
}) => {
  // Skip summary if no time filter is selected
  if (timeFilter === "all" || visiblePlayers.length === 0) {
    return null;
  }

  const getTimeRangeText = () => {
    switch (timeFilter) {
      case "1week": return "Last 7 Days";
      case "2weeks": return "Last 14 Days";
      case "1month": return "Last 30 Days";
      default: return "Selected Period";
    }
  };
  
  const calculateAverages = () => {
    // Initialize aggregates
    let totalGames = 0;
    let totalPoints = 0;
    let totalFGMade = 0;
    let totalFGAttempted = 0;
    let total3PTMade = 0;
    let total3PTAttempted = 0;
    let totalFTMade = 0;
    let totalFTAttempted = 0;
    let totalAssists = 0;
    let totalRebounds = 0;
    let totalSteals = 0;
    let totalBlocks = 0;
    let totalFouls = 0;
    
    // Count player stats
    visiblePlayers.forEach(player => {
      totalPoints += getPointsForPlayer(player.id);
      totalFGMade += getStatTotalFor(player.id, "FG_Made");
      totalFGAttempted += getStatTotalFor(player.id, "FG_Made") + 
                         getStatTotalFor(player.id, "FG_Missed");
      total3PTMade += getStatTotalFor(player.id, "ThreePT_Made");
      total3PTAttempted += getStatTotalFor(player.id, "ThreePT_Made") + 
                          getStatTotalFor(player.id, "ThreePT_Missed");
      totalFTMade += getStatTotalFor(player.id, "FT_Made");
      totalFTAttempted += getStatTotalFor(player.id, "FT_Made") + 
                         getStatTotalFor(player.id, "FT_Missed");
      totalAssists += getStatTotalFor(player.id, "Assists");
      totalRebounds += getStatTotalFor(player.id, "Rebounds");
      totalSteals += getStatTotalFor(player.id, "Steals");
      totalBlocks += getStatTotalFor(player.id, "Blocks");
      totalFouls += getStatTotalFor(player.id, "Fouls");
      
      // Assume 1 game for simplicity, in a real app this would be calculated from game data
      totalGames++;
    });
    
    // Calculate averages and percentages
    const pointsPerGame = totalGames > 0 ? (totalPoints / totalGames).toFixed(1) : "0";
    const fgPercentage = totalFGAttempted > 0 ? Math.round((totalFGMade / totalFGAttempted) * 100) : 0;
    const threePointPercentage = total3PTAttempted > 0 ? Math.round((total3PTMade / total3PTAttempted) * 100) : 0;
    const ftPercentage = totalFTAttempted > 0 ? Math.round((totalFTMade / totalFTAttempted) * 100) : 0;
    
    return {
      pointsPerGame,
      fgPercentage,
      threePointPercentage,
      ftPercentage,
      assistsPerGame: totalGames > 0 ? (totalAssists / totalGames).toFixed(1) : "0",
      reboundsPerGame: totalGames > 0 ? (totalRebounds / totalGames).toFixed(1) : "0",
      stealsPerGame: totalGames > 0 ? (totalSteals / totalGames).toFixed(1) : "0",
      blocksPerGame: totalGames > 0 ? (totalBlocks / totalGames).toFixed(1) : "0",
      foulsPerGame: totalGames > 0 ? (totalFouls / totalGames).toFixed(1) : "0",
    };
  };
  
  const stats = calculateAverages();

  return (
    <Card className="modern-card mb-6 shadow-lg animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-t-xl border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">Team Summary - {getTimeRangeText()}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white dark:bg-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatBadge label="PPG" value={stats.pointsPerGame} />
          <StatBadge label="FG%" value={`${stats.fgPercentage}%`} />
          <StatBadge label="3P%" value={`${stats.threePointPercentage}%`} />
          <StatBadge label="FT%" value={`${stats.ftPercentage}%`} />
          <StatBadge label="AST" value={stats.assistsPerGame} />
          <StatBadge label="REB" value={stats.reboundsPerGame} />
          <StatBadge label="STL" value={stats.stealsPerGame} />
          <StatBadge label="BLK" value={stats.blocksPerGame} />
          <StatBadge label="FOUL" value={stats.foulsPerGame} />
        </div>
      </CardContent>
    </Card>
  );
};

const StatBadge = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/40 shadow-sm hover:shadow-md transition-all">
    <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">{label}</span>
    <span className="text-xl font-bold text-gray-800 dark:text-white">{value}</span>
  </div>
);

export default PlayerStatSummary;
