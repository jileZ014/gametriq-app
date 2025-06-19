
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { StatType } from '../types';
import { StatRecord } from '../services/StatsService';

export const useStatMutations = (gameId?: string) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

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

  // Undo the most recent stat for a player
  const undoLastStatMutation = useMutation({
    mutationFn: async ({ playerId }: { playerId: string }) => {
      if (!gameId || !currentUser) throw new Error("Missing required data");
      
      // First, find the most recent stat for this player in this game
      const { data: latestStats, error: fetchError } = await supabase
        .from('stat_records')
        .select('*')
        .eq('player_id', playerId)
        .eq('game_id', gameId)
        .order('timestamp', { ascending: false })
        .limit(1);
        
      if (fetchError) throw fetchError;
      
      // If no stats found, throw an error
      if (!latestStats || latestStats.length === 0) {
        throw new Error("No stats found to undo");
      }
      
      const latestStat = latestStats[0];
      
      // Now delete this stat record
      const { error: deleteError } = await supabase
        .from('stat_records')
        .delete()
        .eq('id', latestStat.id);
        
      if (deleteError) throw deleteError;
      
      return latestStat;
    },
    onMutate: async ({ playerId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['gameStats', gameId] });
      
      // Snapshot the previous value
      const previousStats = queryClient.getQueryData(['gameStats', gameId]);
      
      // Optimistically update by removing the most recent stat for this player
      queryClient.setQueryData(['gameStats', gameId], (old: StatRecord[] = []) => {
        // Filter stats for this player
        const playerStats = old.filter(stat => stat.player_id === playerId);
        
        if (playerStats.length === 0) {
          return old; // No stats to remove
        }
        
        // Find the most recent stat by timestamp
        let mostRecentStat: StatRecord | null = null;
        let mostRecentTimestamp = new Date(0).toISOString();
        
        for (const stat of playerStats) {
          const statTimestamp = stat.timestamp || new Date(0).toISOString();
          if (statTimestamp > mostRecentTimestamp) {
            mostRecentTimestamp = statTimestamp;
            mostRecentStat = stat;
          }
        }
        
        if (!mostRecentStat) {
          return old; // No stats to remove
        }
        
        // Remove the most recent stat
        return old.filter(stat => stat.id !== mostRecentStat!.id);
      });
      
      // Return a context object with the previous stats
      return { previousStats };
    },
    onError: (err, variables, context) => {
      console.error("Error undoing stat:", err);
      // Revert to the previous state
      if (context?.previousStats) {
        queryClient.setQueryData(['gameStats', gameId], context.previousStats);
      }
      toast.error("Failed to undo last stat");
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success(`Last stat removed successfully`);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['gameStats', gameId] });
    }
  });
  
  return {
    recordStatMutation,
    undoLastStatMutation
  };
};

export default useStatMutations;
