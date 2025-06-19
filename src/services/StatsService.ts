
import { BaseService } from './BaseService';
import { StatType } from '@/types';
import { withErrorHandling } from '@/utils/errorHandling';

// Export the StatRecord interface so it can be used in other files
export interface StatRecord {
  id?: string;
  player_id: string;
  game_id: string;
  stat_type: StatType;
  value: number;
  timestamp?: string; // Changed from Date to string to match Supabase
  quarter?: number;
  time_remaining?: string;
  coordinates_x?: number;
  coordinates_y?: number;
  notes?: string;
  created_by_user_id: string; // Required field
  created_at?: string;
  isPrivateGame?: boolean; // Used for filtering
}

export class StatsService extends BaseService {
  static async getGameStats(gameId: string): Promise<StatRecord[]> {
    return withErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('stat_records')
        .select('*')
        .eq('game_id', gameId);
        
      if (error) throw error;
      
      // Transform data to match our StatRecord type
      const transformedStats: StatRecord[] = data.map(stat => ({
        id: stat.id,
        player_id: stat.player_id,
        game_id: stat.game_id,
        stat_type: stat.stat_type as StatType,
        value: stat.value || 1,
        timestamp: stat.timestamp || stat.created_at,
        quarter: stat.quarter,
        time_remaining: stat.time_remaining,
        coordinates_x: stat.coordinates_x,
        coordinates_y: stat.coordinates_y,
        notes: stat.notes,
        created_by_user_id: stat.created_by_user_id,
        created_at: stat.created_at
      }));
      
      return transformedStats;
    }, { message: 'Failed to retrieve game stats' });
  }
  
  static async getPlayerStats(playerId: string): Promise<StatRecord[]> {
    return withErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('stat_records')
        .select('*')
        .eq('player_id', playerId);
        
      if (error) throw error;
      
      // Transform data to match our StatRecord type
      const transformedStats: StatRecord[] = data.map(stat => ({
        id: stat.id,
        player_id: stat.player_id,
        game_id: stat.game_id,
        stat_type: stat.stat_type as StatType,
        value: stat.value || 1,
        timestamp: stat.timestamp || stat.created_at,
        quarter: stat.quarter,
        time_remaining: stat.time_remaining,
        coordinates_x: stat.coordinates_x,
        coordinates_y: stat.coordinates_y,
        notes: stat.notes,
        created_by_user_id: stat.created_by_user_id,
        created_at: stat.created_at
      }));
      
      return transformedStats;
    }, { message: 'Failed to retrieve player stats' });
  }
  
  static async getPlayerGameStats(gameId: string, playerId: string): Promise<StatRecord[]> {
    return withErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('stat_records')
        .select('*')
        .eq('game_id', gameId)
        .eq('player_id', playerId);
        
      if (error) throw error;
      
      // Transform data to match our StatRecord type
      const transformedStats: StatRecord[] = data.map(stat => ({
        id: stat.id,
        player_id: stat.player_id,
        game_id: stat.game_id,
        stat_type: stat.stat_type as StatType,
        value: stat.value || 1,
        timestamp: stat.timestamp || stat.created_at,
        quarter: stat.quarter,
        time_remaining: stat.time_remaining,
        coordinates_x: stat.coordinates_x,
        coordinates_y: stat.coordinates_y,
        notes: stat.notes,
        created_by_user_id: stat.created_by_user_id,
        created_at: stat.created_at
      }));
      
      return transformedStats;
    }, { message: 'Failed to retrieve player game stats' });
  }

  static async recordStat(
    gameId: string,
    playerId: string,
    statType: string,
    value: number = 1,
    createdByUserId: string, // Required parameter
    options: {
      quarter?: number;
      timeRemaining?: string;
      coordinatesX?: number;
      coordinatesY?: number;
      notes?: string;
    } = {}
  ): Promise<StatRecord> {
    return withErrorHandling(async () => {
      const newStat = {
        player_id: playerId,
        game_id: gameId,
        stat_type: statType,
        value: value,
        created_by_user_id: createdByUserId, // Include the required field
        quarter: options.quarter,
        time_remaining: options.timeRemaining,
        coordinates_x: options.coordinatesX,
        coordinates_y: options.coordinatesY,
        notes: options.notes
      };
      
      const { data, error } = await this.supabase
        .from('stat_records')
        .insert(newStat)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform data to match our StatRecord type
      const transformedStat: StatRecord = {
        id: data.id,
        player_id: data.player_id,
        game_id: data.game_id,
        stat_type: data.stat_type as StatType,
        value: data.value || 1,
        timestamp: data.timestamp || data.created_at,
        quarter: data.quarter,
        time_remaining: data.time_remaining,
        coordinates_x: data.coordinates_x,
        coordinates_y: data.coordinates_y,
        notes: data.notes,
        created_by_user_id: data.created_by_user_id,
        created_at: data.created_at
      };
      
      return transformedStat;
    }, { message: 'Failed to record stat' });
  }

  // Add a method to undo the last stat
  static async undoLastStat(gameId: string, playerId: string): Promise<StatRecord | null> {
    return withErrorHandling(async () => {
      // Find the most recent stat for this player in this game
      const { data: latestStats, error: fetchError } = await this.supabase
        .from('stat_records')
        .select('*')
        .eq('player_id', playerId)
        .eq('game_id', gameId)
        .order('timestamp', { ascending: false })
        .limit(1);
        
      if (fetchError) throw fetchError;
      
      // If no stats found, return null
      if (!latestStats || latestStats.length === 0) {
        return null;
      }
      
      const latestStat = latestStats[0];
      
      // Now delete this stat record
      const { error: deleteError } = await this.supabase
        .from('stat_records')
        .delete()
        .eq('id', latestStat.id);
        
      if (deleteError) throw deleteError;
      
      // Transform the deleted stat to match our StatRecord type
      const transformedStat: StatRecord = {
        id: latestStat.id,
        player_id: latestStat.player_id,
        game_id: latestStat.game_id,
        stat_type: latestStat.stat_type as StatType,
        value: latestStat.value || 1,
        timestamp: latestStat.timestamp || latestStat.created_at,
        quarter: latestStat.quarter,
        time_remaining: latestStat.time_remaining,
        coordinates_x: latestStat.coordinates_x,
        coordinates_y: latestStat.coordinates_y,
        notes: latestStat.notes,
        created_by_user_id: latestStat.created_by_user_id,
        created_at: latestStat.created_at
      };
      
      return transformedStat;
    }, { message: 'Failed to undo last stat' });
  }
}
