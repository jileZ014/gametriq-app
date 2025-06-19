
import { BaseService } from './BaseService';
import { Player, PlayerStats } from '@/types';
import { withErrorHandling } from '@/utils/errorHandling';

export class PlayerService extends BaseService {
  static async getAllPlayers(): Promise<Player[]> {
    return withErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('players')
        .select('*');
        
      if (error) throw error;
      
      // Transform data to match our Player type
      const transformedPlayers: Player[] = data.map(player => ({
        id: player.id,
        name: player.name,
        playerNumber: player.player_number,
        photoUrl: player.photo_url,
        team_id: player.team_id,
        parent_user_id: player.parent_user_id,
        stats: {
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
        }
      }));
      
      return transformedPlayers;
    }, { message: 'Failed to retrieve players' });
  }
  
  static async getPlayer(playerId: string): Promise<Player | null> {
    return this.getPlayerById(playerId);
  }

  static async getPlayerById(playerId: string): Promise<Player | null> {
    return withErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
        
      if (error) {
        // If not found, return null instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      // Transform data to match our Player type
      const player: Player = {
        id: data.id,
        name: data.name,
        playerNumber: data.player_number,
        photoUrl: data.photo_url,
        team_id: data.team_id,
        parent_user_id: data.parent_user_id,
        stats: {
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
        }
      };
      
      return player;
    }, { message: 'Failed to retrieve player' });
  }
}
