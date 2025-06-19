
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import StatLogEntry, { StatLogEntryData } from "./StatLogEntry";

interface PlayerStatLogProps {
  logs: StatLogEntryData[];
  maxEntries?: number;
}

const PlayerStatLog: React.FC<PlayerStatLogProps> = ({ logs, maxEntries = 5 }) => {
  const recentLogs = logs.slice(0, maxEntries);
  
  return (
    <div className="mt-3 bg-black/50 backdrop-blur-md rounded-md border border-gray-800 shadow-lg transition-all hover:border-blue-900/50">
      <div className="px-3 py-2 border-b border-gray-800 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
        <h4 className="text-sm font-medium text-blue-300">Recent Activity</h4>
      </div>
      <ScrollArea className="h-[150px] px-3 py-1">
        {recentLogs.length > 0 ? (
          recentLogs.map((log) => (
            <StatLogEntry key={log.id} entry={log} />
          ))
        ) : (
          <div className="py-4 text-center text-sm text-gray-400">
            No recent activity
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PlayerStatLog;
