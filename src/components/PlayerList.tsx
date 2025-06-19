
import React from "react";
import { Player } from "../types";
import PlayerCard from "./PlayerCard";
import { StatLogEntryData } from "./StatLogEntry";
import { Clipboard, Users, ArrowUpDown } from "lucide-react";
import { StatRecord } from "../services/StatsService";
import { Button } from "@/components/ui/button";
import { usePlayerSorting } from "@/hooks/usePlayerSorting";

interface PlayerListProps {
  players: Player[];
  isCoach: boolean;
  isLoading: boolean;
  onRecordStat: (playerId: string, statType: string, value: number) => void;
  onUpdateParentEmail: (player: Player, email: string) => void;
  onUploadPhoto: (player: Player, photoUrl: string) => Promise<void>;
  gameStats: StatRecord[];
  playerStatLogs: Record<string, StatLogEntryData[]>;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  isCoach,
  isLoading,
  onRecordStat,
  onUpdateParentEmail,
  onUploadPhoto,
  gameStats,
  playerStatLogs
}) => {
  const { sortedPlayers, sortByJersey, setSortByJersey } = usePlayerSorting(players);

  if (players.length === 0) {
    return (
      <div className={`text-center py-12 text-gray-500 bg-white/90 backdrop-blur-sm rounded-xl border ${isCoach ? "border-blue-100" : "border-green-100"} shadow-lg`}>
        <div className="flex justify-center mb-4">
          {isCoach ? (
            <Clipboard className="h-12 w-12 text-blue-400 opacity-70" />
          ) : (
            <Users className="h-12 w-12 text-green-400 opacity-70" />
          )}
        </div>
        <p className="text-lg font-medium">No players available.</p>
        <p className="text-sm mt-2">
          {isCoach 
            ? "Add a player to start tracking stats." 
            : "Contact your coach to add you as a parent."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Jersey Number Sort Toggle */}
      {players.some(p => p.playerNumber && p.playerNumber !== "") && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortByJersey(!sortByJersey)}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortByJersey ? "Sort by Name" : "Sort by Jersey #"}
          </Button>
        </div>
      )}

      <div className={`grid gap-6 md:grid-cols-1 lg:grid-cols-2 animate-fade-in ${isCoach ? "coach-cards" : "parent-cards"}`}>
        {sortedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isCoach={isCoach}
            isLoading={isLoading}
            onRecordStat={onRecordStat}
            onUpdateParentEmail={onUpdateParentEmail}
            onUploadPhoto={onUploadPhoto}
            gameStats={gameStats}
            statLogs={playerStatLogs[player.id] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
