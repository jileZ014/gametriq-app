
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { StatRecord } from '@/services/StatsService';

export const useRealtimeGameStats = (gameId?: string) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Function to fetch stats for a specific game
  const fetchGameStats = async () => {
    if (!gameId || !currentUser) return [];
    
    const { data, error } = await supabase
      .from('stat_records')
      .select('*')
      .eq('game_id', gameId);
      
    if (error) {
      console.error("Error fetching game stats:", error);
      toast.error("Failed to load game statistics");
      return [];
    }
    
    return data as StatRecord[];
  };
  
  // Query hook for fetching game stats
  const gameStatsQuery = useQuery({
    queryKey: ['gameStats', gameId],
    queryFn: fetchGameStats,
    enabled: !!gameId && !!currentUser,
  });
  
  // Set up Supabase Realtime subscription for live updates
  useEffect(() => {
    if (!gameId || !currentUser) return;
    
    // Enable realtime for the stat_records table
    // We'll use channel-based subscriptions directly instead of the graphql approach
    const channel = supabase
      .channel('game-stats-' + gameId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'stat_records',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          console.log('Received realtime update:', payload);
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            // Add the new stat to the query cache
            queryClient.setQueryData(['gameStats', gameId], (old: StatRecord[] = []) => {
              return [...old, payload.new as StatRecord];
            });
            toast.success('New stat recorded!');
          }
          else if (payload.eventType === 'UPDATE') {
            // Update the existing stat in the query cache
            queryClient.setQueryData(['gameStats', gameId], (old: StatRecord[] = []) => {
              return old.map(stat => 
                stat.id === payload.new.id ? (payload.new as StatRecord) : stat
              );
            });
          }
          else if (payload.eventType === 'DELETE') {
            // Remove the deleted stat from the query cache
            queryClient.setQueryData(['gameStats', gameId], (old: StatRecord[] = []) => {
              return old.filter(stat => stat.id !== payload.old.id);
            });
            toast.info('Stat removed');
          }
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, currentUser, queryClient]);
  
  // Getting stats for a specific player
  const getPlayerStats = (playerId: string) => {
    if (!gameStatsQuery.data) return [];
    return gameStatsQuery.data.filter(stat => stat.player_id === playerId);
  };
  
  // Calculate total for a specific stat type for a player
  const getStatTotal = (playerId: string, statType: string): number => {
    const playerStats = getPlayerStats(playerId);
    return playerStats
      .filter(stat => stat.stat_type === statType)
      .reduce((total, stat) => total + (stat.value || 0), 0);
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
    getPlayerStats,
    getStatTotal,
    getPointsForPlayer
  };
};

export default useRealtimeGameStats;
