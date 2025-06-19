
import { BaseService } from './BaseService';
import { Game } from '@/types';
import { withErrorHandling } from '@/utils/errorHandling';

export class GameService extends BaseService {
  static async getAllGames(): Promise<Game[]> {
    return withErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('games')
        .select('*')
        .order('game_date', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match our Game type
      const transformedGames: Game[] = data.map(game => ({
        id: game.id,
        opponent: game.opponent_name,
        date: game.game_date,
        isPrivate: game.is_private,
        createdBy: game.created_by_user_id,
        location: game.location,
        is_active: game.is_active,
        team_id: game.team_id
      }));
      
      return transformedGames;
    }, { message: 'Failed to retrieve games' });
  }
  
  static async getPlayerGames(playerId: string): Promise<Game[]> {
    return withErrorHandling(async () => {
      // Get games associated with this player through game_players join table
      const { data, error } = await this.supabase
        .from('game_players')
        .select('game_id')
        .eq('player_id', playerId);
        
      if (error) throw error;
      
      // If no games found, return empty array
      if (!data || data.length === 0) {
        return [];
      }
      
      // Extract game IDs
      const gameIds = data.map(record => record.game_id);
      
      // Get full game details
      const { data: gamesData, error: gamesError } = await this.supabase
        .from('games')
        .select('*')
        .in('id', gameIds)
        .order('game_date', { ascending: false });
        
      if (gamesError) throw gamesError;
      
      // Transform data to match our Game type
      const transformedGames: Game[] = (gamesData || []).map(game => ({
        id: game.id,
        opponent: game.opponent_name,
        date: game.game_date,
        isPrivate: game.is_private,
        createdBy: game.created_by_user_id,
        location: game.location,
        is_active: game.is_active,
        team_id: game.team_id
      }));
      
      return transformedGames;
    }, { message: 'Failed to retrieve player games' });
  }
  
  static async getGameById(gameId: string): Promise<Game | null> {
    return withErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();
        
      if (error) {
        // If not found, return null instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      // Transform data to match our Game type
      const game: Game = {
        id: data.id,
        opponent: data.opponent_name,
        date: data.game_date,
        isPrivate: data.is_private,
        createdBy: data.created_by_user_id,
        location: data.location,
        is_active: data.is_active,
        team_id: data.team_id
      };
      
      return game;
    }, { message: 'Failed to retrieve game' });
  }
}
