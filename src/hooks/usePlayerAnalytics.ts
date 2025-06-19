
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Player, Game, StatType, PlayerStats } from '@/types';
import { PlayerService } from '@/services/PlayerService';
import { GameService } from '@/services/GameService';
import { StatsService, StatRecord } from '@/services/StatsService'; // Import StatRecord from StatsService

interface PlayerAnalytics {
  player: Player;
  games: Game[];
  statsByGame: Map<string, StatRecord[]>;
  playerStats: PlayerStats;
  loading: boolean;
  error: Error | null;
}

const defaultPlayerStats: PlayerStats = {
  fgMade: 0,
  fgMissed: 0,
  threePtMade: 0,
  threePtMissed: 0,
  ftMade: 0,
  ftMissed: 0,
  Assists: 0,
  Rebounds: 0,
  Steals: 0,
  Blocks: 0,
  Fouls: 0
};

export const usePlayerAnalytics = (playerId: string): PlayerAnalytics => {
  const [statsByGame, setStatsByGame] = useState<Map<string, StatRecord[]>>(new Map());

  const { data: playerData, isLoading: isLoadingPlayer, error: playerError } = useQuery({
    queryKey: ['player', playerId],
    queryFn: async () => {
      try {
        return await PlayerService.getPlayer(playerId);
      } catch (error) {
        console.error("Error fetching player data:", error);
        return null;
      }
    },
    retry: 1,
    enabled: !!playerId
  });

  const { data: gamesData, isLoading: isLoadingGames, error: gamesError } = useQuery({
    queryKey: ['games', playerId],
    queryFn: async () => {
      try {
        return await GameService.getPlayerGames(playerId);
      } catch (error) {
        console.error("Error fetching games data:", error);
        return [];
      }
    },
    retry: 1,
    enabled: !!playerId
  });

  const { data: statsData, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['stats', playerId],
    queryFn: async () => {
      try {
        return await StatsService.getPlayerStats(playerId);
      } catch (error) {
        console.error("Error fetching stats data:", error);
        return [];
      }
    },
    retry: 1,
    enabled: !!playerId
  });

  // Process stats data when it's available with null safety
  useMemo(() => {
    if (statsData && Array.isArray(statsData)) {
      const groupedStats = new Map<string, StatRecord[]>();
      statsData.forEach(stat => {
        if (stat && stat.game_id) {
          const gameId = stat.game_id;
          if (!groupedStats.has(gameId)) {
            groupedStats.set(gameId, []);
          }
          groupedStats.get(gameId)?.push(stat);
        }
      });
      setStatsByGame(groupedStats);
    } else {
      setStatsByGame(new Map());
    }
  }, [statsData]);

  const calculatedStats: PlayerStats = useMemo(() => {
    if (!statsData || !Array.isArray(statsData)) {
      return defaultPlayerStats;
    }

    const initialStats: PlayerStats = {
      fgMade: 0,
      fgMissed: 0,
      threePtMade: 0,
      threePtMissed: 0,
      ftMade: 0,
      ftMissed: 0,
      Assists: 0,
      Rebounds: 0,
      Steals: 0,
      Blocks: 0,
      Fouls: 0
    };

    return statsData.reduce((acc: PlayerStats, stat: StatRecord) => {
      if (!stat || !stat.stat_type || typeof stat.value !== 'number') {
        return acc;
      }
      switch (stat.stat_type) {
        case 'FG_Made':
          acc.fgMade += stat.value;
          break;
        case 'FG_Missed':
          acc.fgMissed += stat.value;
          break;
        case 'ThreePT_Made':
          acc.threePtMade += stat.value;
          break;
        case 'ThreePT_Missed':
          acc.threePtMissed += stat.value;
          break;
        case 'FT_Made':
          acc.ftMade += stat.value;
          break;
        case 'FT_Missed':
          acc.ftMissed += stat.value;
          break;
        case 'Assists':
          acc.Assists = (acc.Assists || 0) + stat.value;
          break;
        case 'Rebounds':
          acc.Rebounds = (acc.Rebounds || 0) + stat.value;
          break;
        case 'Steals':
          acc.Steals = (acc.Steals || 0) + stat.value;
          break;
        case 'Blocks':
          acc.Blocks = (acc.Blocks || 0) + stat.value;
          break;
        case 'Fouls':
          acc.Fouls = (acc.Fouls || 0) + stat.value;
          break;
        default:
          break;
      }
      return acc;
    }, initialStats);
  }, [statsData]);
  
  // Create a complete Player object with required team_id
  const defaultPlayer: Player = { 
    id: playerId || '', 
    name: playerData?.name || '', 
    stats: defaultPlayerStats,
    team_id: playerData?.team_id || 'default-team'
  };
  
  return {
    player: playerData || defaultPlayer,
    games: gamesData || [],
    statsByGame,
    playerStats: calculatedStats,
    loading: isLoadingPlayer || isLoadingGames || isLoadingStats,
    error: playerError || gamesError || statsError,
  };
};
