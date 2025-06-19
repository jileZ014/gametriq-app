
export interface PlayerStats {
  fgMade: number;
  fgMissed: number;
  threePtMade: number;
  threePtMissed: number;
  ftMade: number;
  ftMissed: number;
  Assists?: number;
  Rebounds?: number;
  Steals?: number;
  Blocks?: number;
  Fouls?: number;
}

export interface Player {
  id: string; // UUID in Supabase
  name: string;
  stats: PlayerStats;
  parentEmail?: string;
  photoUrl?: string;
  coachEmail?: string;
  playerNumber?: string;
  team_id: string; // Reference to team UUID (now required)
  parent_user_id?: string; // Reference to parent user UUID
}

export interface User {
  id: string; // UUID in Supabase
  email: string;
  role: "Coach" | "Parent";
  teamLogoUrl?: string;
  hasLoggedIn?: boolean;
  verifiedEmail?: boolean;
  temporaryPassword?: string;
  teamName?: string;
  name?: string;
  password?: string; // Add password field for authentication testing
}

// Point values for different stat types
export const POINT_VALUES = {
  FG_Made: 2,
  ThreePT_Made: 3,
  FT_Made: 1,
  // All other stats are worth 0 points for scoring
  FG_Missed: 0,
  ThreePT_Missed: 0,
  FT_Missed: 0,
  Assists: 0,
  Rebounds: 0,
  Steals: 0,
  Blocks: 0,
  Fouls: 0
} as const;

export type StatType = keyof typeof POINT_VALUES;

// Add GameStatus enum
export enum GameStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  COMPLETED = 'completed'
}

// Add opponent team interface
export interface OpponentTeam {
  team_name: string;
  players: OpponentPlayer[];
}

export interface OpponentPlayer {
  id: string;
  name: string;
  jersey_number?: string;
}

// Update Game interface to include new fields
export interface Game {
  id: string; // UUID in Supabase
  opponent: string;
  date: string;
  isPrivate?: boolean;
  createdBy?: string;
  team_id: string; // Reference to team UUID (now required)
  location?: string;
  is_active?: boolean;
  status?: GameStatus; // Add status field
  opponent_team?: OpponentTeam; // Add opponent team data
  // New enhanced fields
  game_start_time?: string;
  game_type?: 'League' | 'Friendly' | 'Tournament' | 'Scrimmage';
  game_duration_minutes?: number;
  quarter_length_minutes?: number;
  is_home_game?: boolean;
  opponent_team_level?: '10U' | '11U' | '12U' | '13U' | '14U' | '15U' | '16U' | '17U';
  game_notes?: string;
}

// Add PlayerView enum for the live game navigation
export enum PlayerView {
  STATS = 'stats',
  TIMELINE = 'timeline',
  ROSTER = 'roster'
}

// New Team interface to match database structure
export interface Team {
  id: string; // UUID in Supabase
  team_name: string;
  coach_user_id: string; // Reference to coach user UUID
  logo_url?: string;
  season?: string; // New field for season/league organization
  description?: string; // New field for team description
  created_at?: string;
}

// Important: This interface should match the StatRecord in StatsService.ts
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
  created_by_user_id: string; // Make required to match StatsService
  created_at?: string;
  isPrivateGame?: boolean; // Used for filtering
}
