
import { supabase } from '@/integrations/supabase/client';
import { Player, Game } from '@/types';

export interface QuickGameDefaults {
  teamName: string;
  opponent: string;
  gamePeriod: string;
  timeRemaining: string;
  court: string;
  playerCount: number;
}

export const QUICK_GAME_DEFAULTS: QuickGameDefaults = {
  teamName: "AZ Flight 12U",
  opponent: "Guest",
  gamePeriod: "Q1",
  timeRemaining: "8:00",
  court: "Standard indoor",
  playerCount: 10
};

export class QuickGameService {
  static async createQuickGame(
    userId: string, 
    customTeamName?: string, 
    customOpponent?: string
  ): Promise<{ game: Game; players: Player[] }> {
    console.log("QuickGameService: Starting createQuickGame with userId:", userId);
    
    if (!userId) {
      throw new Error("User ID is required to create a quick game");
    }
    
    const teamName = customTeamName || QUICK_GAME_DEFAULTS.teamName;
    const opponent = customOpponent || QUICK_GAME_DEFAULTS.opponent;
    
    console.log("QuickGameService: Creating game for team:", teamName, "vs", opponent);
    
    try {
      // Check current auth state
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("QuickGameService: Current session:", session?.user?.id || 'none', sessionError || 'no error');
      
      // Always create mock game and players for testing due to auth/RLS issues
      console.log("QuickGameService: Creating mock game for testing purposes");
      
      const mockGame: Game = {
        id: `mock-game-${Date.now()}`,
        opponent: opponent,
        date: new Date().toISOString(),
        isPrivate: true,
        createdBy: userId,
        team_id: userId,
        location: QUICK_GAME_DEFAULTS.court,
        is_active: true
      };
      
      const mockPlayers: Player[] = Array.from({ length: QUICK_GAME_DEFAULTS.playerCount }, (_, i) => ({
        id: `mock-player-${i + 1}`,
        name: `Player ${i + 1}`,
        playerNumber: `${i + 1}`,
        team_id: userId,
        parent_user_id: userId,
        photoUrl: undefined,
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
      
      // Store in localStorage for persistence during testing
      localStorage.setItem('gametriq_mock_game', JSON.stringify(mockGame));
      localStorage.setItem('gametriq_mock_players', JSON.stringify(mockPlayers));
      
      console.log("QuickGameService: Successfully created mock game and players:", { game: mockGame, players: mockPlayers });
      return { game: mockGame, players: mockPlayers };
      
    } catch (error) {
      console.error("QuickGameService: Failed to create quick game:", error);
      throw error;
    }
  }
}
