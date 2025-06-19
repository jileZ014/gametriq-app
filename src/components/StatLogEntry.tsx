
import React from "react";
import { formatDistanceToNow } from "date-fns";

export interface StatLogEntryData {
  id: string;
  timestamp: Date;
  description: string;
  pointsChange: number;
  playerName?: string;  // Optional fields that may be used by other components
  statType?: string;
  value?: number;
  playerId?: string;
}

interface StatLogEntryProps {
  entry: StatLogEntryData;
}

const StatLogEntry: React.FC<StatLogEntryProps> = ({ entry }) => {
  const getTimeDisplay = (timestamp: Date) => {
    const secondsAgo = (new Date().getTime() - timestamp.getTime()) / 1000;
    
    if (secondsAgo < 10) {
      return "Just now";
    }
    
    if (secondsAgo < 60) {
      return "Seconds ago";
    }
    
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };
  
  const getPointClass = () => {
    if (entry.pointsChange > 0) return "text-green-400 font-medium";
    if (entry.pointsChange < 0) return "text-red-400 font-medium";
    return "text-gray-400";
  };

  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-800/50 last:border-0 group hover:bg-blue-900/10 px-1 rounded transition-colors duration-200">
      <div className="flex items-center gap-2">
        <span className={`text-sm ${getPointClass()}`}>{entry.description}</span>
      </div>
      <span className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors">{getTimeDisplay(entry.timestamp)}</span>
    </div>
  );
};

export default StatLogEntry;
