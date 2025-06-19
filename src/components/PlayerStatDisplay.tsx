
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatLogEntryData } from "./StatLogEntry";
import PlayerStatLog from "./PlayerStatLog";
import { Badge } from "@/components/ui/badge";

interface PlayerStatDisplayProps {
  fgMade: number;
  fgMissed: number;
  threePtMade: number;
  threePtMissed: number;
  ftMade: number;
  ftMissed: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  fouls: number;
  totalPoints: number;
  statLogs: StatLogEntryData[];
}

const PlayerStatDisplay: React.FC<PlayerStatDisplayProps> = ({
  fgMade,
  fgMissed,
  threePtMade,
  threePtMissed,
  ftMade,
  ftMissed,
  assists,
  rebounds,
  steals,
  blocks,
  fouls,
  totalPoints,
  statLogs
}) => {
  const calculatePercentage = (made: number, total: number): string => {
    if (total === 0) return "0";
    return Math.round((made / total) * 100).toString();
  };

  const formatStat = (made: number, missed: number): string => {
    const total = made + missed;
    const percentage = calculatePercentage(made, total);
    return `${made} / ${total} (${percentage}%)`;
  };
  
  return (
    <div className="space-y-5">
      <div className="stat-card overflow-hidden bg-gray-900 border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 hover:bg-blue-900/70">
              <TableHead className="text-blue-300 font-semibold">Field Goals</TableHead>
              <TableHead className="text-blue-300 font-semibold">Three Pointers</TableHead>
              <TableHead className="text-blue-300 font-semibold">Free Throws</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-800/50">
              <TableCell className="text-gray-300 font-medium">
                {formatStat(fgMade, fgMissed)}
              </TableCell>
              <TableCell className="text-gray-300 font-medium">
                {formatStat(threePtMade, threePtMissed)}
              </TableCell>
              <TableCell className="text-gray-300 font-medium">
                {formatStat(ftMade, ftMissed)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="text-center">
        <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-lg py-1.5 px-5 font-bold shadow-lg hover:shadow-xl transition-all rounded-full">
          Points: {totalPoints}
        </Badge>
      </div>
      
      <div className="stat-card overflow-hidden bg-gray-900 border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 hover:bg-blue-900/70">
              <TableHead className="text-blue-300 font-semibold text-center">AST</TableHead>
              <TableHead className="text-blue-300 font-semibold text-center">REB</TableHead>
              <TableHead className="text-blue-300 font-semibold text-center">STL</TableHead>
              <TableHead className="text-blue-300 font-semibold text-center">BLK</TableHead>
              <TableHead className="text-blue-300 font-semibold text-center">FOUL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-800/50">
              <TableCell className="text-gray-300 text-center font-bold">{assists}</TableCell>
              <TableCell className="text-gray-300 text-center font-bold">{rebounds}</TableCell>
              <TableCell className="text-gray-300 text-center font-bold">{steals}</TableCell>
              <TableCell className="text-gray-300 text-center font-bold">{blocks}</TableCell>
              <TableCell className="text-gray-300 text-center font-bold">{fouls}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayerStatDisplay;
