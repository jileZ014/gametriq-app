
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { StatType } from '../types';
import { StatRecord } from '../services/StatsService';

export const useGameStats = (gameId?: string) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Function to fetch stats for a specific game with graceful error handling
  const fetchGameStats = async () => {
    if (!gameId || !currentUser) return [];
    
    try {
      const { data, error } = await supabase
        .from('stat_records')
        .select('*')
        .eq('game_id', gameId);
        
      if (error) {
        console.error("Error fetching game stats:", error);
        // Don't show toast for permission errors in development
        if (!error.message.includes('permission denied')) {
          toast.error("Failed to load game statistics");
        }
        return [];
      }
      
      return (data as StatRecord[]) || [];
    } catch (error) {
      console.error("Unexpected error fetching game stats:", error);
      return [];
    }
  };
  
  // Query hook for fetching game stats
  const gameStatsQuery = useQuery({
    queryKey: ['gameStats', gameId],
    queryFn: fetchGameStats,
    enabled: !!gameId && !!currentUser,
  });
  
  // Record a new stat (with optimistic updates)
  const recordStatMutation = useMutation({
    mutationFn: async ({
      playerId,
      statType,
      value = 1,
      options = {}
    }: {
      playerId: string;
      statType: StatType;
      value?: number;
      options?: {
        quarter?: number;
        timeRemaining?: string;
        coordinatesX?: number;
        coordinatesY?: number;
        notes?: string;
      };
    }) => {
      if (!gameId || !currentUser) throw new Error("Missing required data");
      
      const newStat = {
        player_id: playerId,
        game_id: gameId,
        stat_type: statType,
        value: value,
        created_by_user_id: currentUser.id,
        quarter: options.quarter,
        time_remaining: options.timeRemaining,
        coordinates_x: options.coordinatesX,
        coordinates_y: options.coordinatesY,
        notes: options.notes
      };
      
      const { data, error } = await supabase
        .from('stat_records')
        .insert(newStat)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onMutate: async (newStat) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['gameStats', gameId] });
      
      // Snapshot the previous value
      const previousStats = queryClient.getQueryData(['gameStats', gameId]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['gameStats', gameId], (old: StatRecord[] = []) => {
        const optimisticStat: StatRecord = {
          id: `temp-${Date.now()}`, // Temporary ID
          player_id: newStat.playerId,
          game_id: gameId!,
          stat_type: newStat.statType,
          value: newStat.value || 1,
          created_by_user_id: currentUser!.id,
          timestamp: new Date().toISOString(),
          quarter: newStat.options?.quarter,
          time_remaining: newStat.options?.timeRemaining,
          coordinates_x: newStat.options?.coordinatesX,
          coordinates_y: newStat.options?.coordinatesY,
          notes: newStat.options?.notes
        };
        
        return [...old, optimisticStat];
      });
      
      // Return a context object with the previous stats
      return { previousStats };
    },
    onError: (err, newStat, context) => {
      console.error("Error recording stat:", err);
      // Revert to the previous state
      if (context?.previousStats) {
        queryClient.setQueryData(['gameStats', gameId], context.previousStats);
      }
      toast.error("Failed to record stat");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['gameStats', gameId] });
    }
  });
  
  // Getting stats for a specific player with null safety
  const getPlayerStats = (playerId: string) => {
    if (!gameStatsQuery.data || !Array.isArray(gameStatsQuery.data)) return [];
    return gameStatsQuery.data.filter(stat => stat && stat.player_id === playerId);
  };
  
  // Calculate total for a specific stat type for a player with fallback
  const getStatTotal = (playerId: string, statType: StatType): number => {
    try {
      const playerStats = getPlayerStats(playerId);
      if (!playerStats || !Array.isArray(playerStats)) return 0;
      
      return playerStats
        .filter(stat => stat && stat.stat_type === statType)
        .reduce((total, stat) => total + (stat.value || 0), 0);
    } catch (error) {
      console.error("Error calculating stat total:", error);
      return 0;
    }
  };
  
  // Calculate points for a player
  const getPointsForPlayer = (playerId: string): number => {
    const playerStats = getPlayerStats(playerId);
    return playerStats.reduce((total, stat) => {
      let points = 0;
      
      // Calculate points based on stat type
      if (stat.stat_type === 'FG_Made') points = 2 * (stat.value || 0);
      else if (stat.stat_type === 'ThreePT_Made') points = 3 * (stat.value || 0);
      else if (stat.stat_type === 'FT_Made') points = 1 * (stat.value || 0);
      
      return total + points;
    }, 0);
  };
  
  return {
    gameStats: gameStatsQuery.data || [],
    isLoadingGameStats: gameStatsQuery.isLoading,
    errorGameStats: gameStatsQuery.error,
    recordStat: recordStatMutation.mutate,
    isRecordingStat: recordStatMutation.isPending,
    getPlayerStats,
    getStatTotal,
    getPointsForPlayer
  };
};
