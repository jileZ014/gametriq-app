
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Users, Undo, MoreVertical, BarChart3 } from "lucide-react";
import { Player } from "../types";
import PlayerStatRecorder from "./PlayerStatRecorder";
import PlayerStatLog from "./PlayerStatLog";
import PlayerStatDisplay from "./PlayerStatDisplay";
import JerseyBadge from "./JerseyBadge";
import { StatLogEntryData } from "./StatLogEntry";
import { StatRecord } from "../services/StatsService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ParentInvitationDialog from "./ParentInvitationDialog";
import PlayerDetailedView from "./PlayerDetailedView";

interface PlayerCardProps {
  player: Player;
  isCoach: boolean;
  isLoading: boolean;
  onRecordStat: (playerId: string, statType: string, value: number) => void;
  onUpdateParentEmail?: (player: Player, email: string) => void;
  onUploadPhoto: (player: Player, photoUrl: string) => Promise<void>;
  gameStats: StatRecord[];
  statLogs: StatLogEntryData[];
  gameId?: string;
  isGameMode?: boolean;
  onUndoLastStat?: (playerId: string) => void;
  players?: Player[];
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCoach,
  isLoading,
  onRecordStat,
  onUpdateParentEmail,
  onUploadPhoto,
  gameStats,
  statLogs,
  gameId,
  isGameMode = false,
  onUndoLastStat,
  players = []
}) => {
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);

  const calculatePlayerGameStats = (playerId: string) => {
    const playerStats = gameStats.filter(stat => stat.player_id === playerId);
    
    return {
      points: playerStats.filter(s => ['FG_Made', 'ThreePT_Made', 'FT_Made'].includes(s.stat_type))
        .reduce((total, stat) => {
          const points = stat.stat_type === 'FG_Made' ? 2 : 
                       stat.stat_type === 'ThreePT_Made' ? 3 : 1;
          return total + (points * (stat.value || 1));
        }, 0),
      fgMade: playerStats.filter(s => s.stat_type === 'FG_Made').reduce((t, s) => t + (s.value || 1), 0),
      fgMissed: playerStats.filter(s => s.stat_type === 'FG_Missed').reduce((t, s) => t + (s.value || 1), 0),
      threePtMade: playerStats.filter(s => s.stat_type === 'ThreePT_Made').reduce((t, s) => t + (s.value || 1), 0),
      threePtMissed: playerStats.filter(s => s.stat_type === 'ThreePT_Missed').reduce((t, s) => t + (s.value || 1), 0),
      ftMade: playerStats.filter(s => s.stat_type === 'FT_Made').reduce((t, s) => t + (s.value || 1), 0),
      ftMissed: playerStats.filter(s => s.stat_type === 'FT_Missed').reduce((t, s) => t + (s.value || 1), 0),
      rebounds: playerStats.filter(s => s.stat_type === 'Rebounds').reduce((t, s) => t + (s.value || 1), 0),
      assists: playerStats.filter(s => s.stat_type === 'Assists').reduce((t, s) => t + (s.value || 1), 0),
      steals: playerStats.filter(s => s.stat_type === 'Steals').reduce((t, s) => t + (s.value || 1), 0),
      blocks: playerStats.filter(s => s.stat_type === 'Blocks').reduce((t, s) => t + (s.value || 1), 0),
      fouls: playerStats.filter(s => s.stat_type === 'Fouls').reduce((t, s) => t + (s.value || 1), 0)
    };
  };

  const currentStats = calculatePlayerGameStats(player.id);

  const handleParentInvitationSuccess = (parentEmail: string) => {
    if (onUpdateParentEmail) {
      onUpdateParentEmail(player, parentEmail);
    }
  };

  const handlePhotoUpload = () => {
    console.log(`Photo upload clicked for player ${player.name}`);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      console.log('File input changed');
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        console.log(`File selected: ${file.name}, size: ${file.size}`);
        
        // Create a temporary URL for the image
        const imageUrl = URL.createObjectURL(file);
        console.log(`Created blob URL: ${imageUrl}`);
        
        try {
          await onUploadPhoto(player, imageUrl);
          console.log(`Photo upload successful for ${player.name}`);
        } catch (error) {
          console.error('Error uploading photo:', error);
        }
      } else {
        console.log('No file selected');
      }
    };
    
    input.click();
    console.log('File input clicked');
  };

  return (
    <>
      <Card className={`relative transition-all hover:shadow-lg min-w-[400px] ${
        isCoach 
          ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800" 
          : "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800"
      }`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                  isCoach ? "bg-blue-600" : "bg-green-600"
                }`}>
                  {player.photoUrl ? (
                    <img 
                      src={player.photoUrl} 
                      alt={player.name} 
                      className="h-full w-full object-cover rounded-full" 
                    />
                  ) : (
                    player.name.charAt(0).toUpperCase()
                  )}
                </div>
                {player.playerNumber && (
                  <JerseyBadge 
                    playerNumber={player.playerNumber}
                    playerName={player.name}
                    className="absolute -bottom-1 -right-1" 
                  />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{player.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {isGameMode && (
                    <Badge variant="secondary" className={`${
                      isCoach ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}>
                      {currentStats.points} pts
                    </Badge>
                  )}
                  {player.parentEmail && (
                    <Badge variant="outline" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      Parent linked
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {isCoach && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 z-50">
                  {gameId && (
                    <DropdownMenuItem onClick={() => setIsDetailedViewOpen(true)}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Advanced View
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setIsParentDialogOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    {player.parentEmail ? "Manage Parent" : "Invite Parent"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePhotoUpload}>
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Full Game Stats Display */}
          {isGameMode && (
            <PlayerStatDisplay
              fgMade={currentStats.fgMade}
              fgMissed={currentStats.fgMissed}
              threePtMade={currentStats.threePtMade}
              threePtMissed={currentStats.threePtMissed}
              ftMade={currentStats.ftMade}
              ftMissed={currentStats.ftMissed}
              assists={currentStats.assists}
              rebounds={currentStats.rebounds}
              steals={currentStats.steals}
              blocks={currentStats.blocks}
              fouls={currentStats.fouls}
              totalPoints={currentStats.points}
              statLogs={statLogs}
            />
          )}

          {/* Stat Recording (Coach Only in Game Mode) */}
          {isCoach && isGameMode && (
            <div className="space-y-3">
              <PlayerStatRecorder 
                onRecordStat={(statType: string, value: number) => onRecordStat(player.id, statType, value)}
                isLoading={isLoading}
                isCoach={isCoach}
                playerName={player.name}
              />
              {onUndoLastStat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUndoLastStat(player.id)}
                  className="w-full"
                >
                  <Undo className="mr-2 h-4 w-4" />
                  Undo Last Stat
                </Button>
              )}
            </div>
          )}

          {/* Stat Logs - only show if not already shown in PlayerStatDisplay */}
          {(!isGameMode && statLogs.length > 0) && (
            <PlayerStatLog logs={statLogs} />
          )}
        </CardContent>
      </Card>

      <ParentInvitationDialog
        player={player}
        isOpen={isParentDialogOpen}
        onClose={() => setIsParentDialogOpen(false)}
        onSuccess={handleParentInvitationSuccess}
      />

      <PlayerDetailedView
        player={player}
        isOpen={isDetailedViewOpen}
        onClose={() => setIsDetailedViewOpen(false)}
        gameStats={gameStats}
        isCoach={isCoach}
        onRecordStat={onRecordStat}
        isLoading={isLoading}
        players={players}
      />
    </>
  );
};

export default PlayerCard;
