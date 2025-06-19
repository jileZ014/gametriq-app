
import React from 'react';
import { Player } from '@/types';
import PlayerCard from './PlayerCard';
import { StatLogEntryData } from './StatLogEntry';
import { StatRecord } from '@/services/StatsService';
import StatRecordingVisualFeedback from './StatRecordingVisualFeedback';

interface PlayerGridProps {
  players: Player[];
  isCoach: boolean;
  recordStatMutation: any;
  onRecordStat: (playerId: string, statType: string, value: number) => void;
  onUploadPhoto: (player: Player, photoUrl: string) => Promise<void>;
  effectiveGameStats: StatRecord[];
  createStatLogs: (playerId: string) => StatLogEntryData[];
  gameId: string;
  onUndoLastStat: (playerId: string) => void;
  onPlayerSelect: (player: Player, event: React.MouseEvent) => void;
  latestStat: any;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  isCoach,
  recordStatMutation,
  onRecordStat,
  onUploadPhoto,
  effectiveGameStats,
  createStatLogs,
  gameId,
  onUndoLastStat,
  onPlayerSelect,
  latestStat
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <div 
            key={player.id} 
            onClick={(e) => onPlayerSelect(player, e)}
            className="cursor-pointer"
          >
            <PlayerCard
              player={player}
              isCoach={isCoach}
              isLoading={recordStatMutation.isPending}
              onRecordStat={onRecordStat}
              onUploadPhoto={onUploadPhoto}
              gameStats={effectiveGameStats}
              statLogs={createStatLogs(player.id)}
              gameId={gameId}
              isGameMode={true}
              onUndoLastStat={onUndoLastStat}
              players={players}
            />
          </div>
        ))}
      </div>
      
      {players.map((player) => (
        <StatRecordingVisualFeedback 
          key={`feedback-${player.id}`}
          latestStat={latestStat} 
          playerId={player.id}
          playerName={player.name}
        />
      ))}
    </div>
  );
};

export default PlayerGrid;
