
import { StatType, POINT_VALUES } from "./types";

export interface StatRecord {
  playerId: string;
  gameId: string;
  statType: StatType;
  value: number;
  timestamp?: string; // Changed from Date to string
  isPrivateGame?: boolean; // Added to track if stat is from a private game
  createdBy: string; // Required to match other interfaces
  // Note: id is not defined in this interface
}

export const stats: StatRecord[] = [
  // Sample data for testing - Player 1 (John Smith)
  {
    playerId: "550e8400-e29b-41d4-a716-446655440001",
    gameId: "G1",
    statType: "FG_Made",
    value: 5,
    timestamp: "2025-05-01T10:30:00Z",
    isPrivateGame: false,
    createdBy: "coach@example.com"
  },
  {
    playerId: "550e8400-e29b-41d4-a716-446655440001",
    gameId: "G1",
    statType: "FG_Missed",
    value: 3,
    timestamp: "2025-05-01T10:35:00Z",
    isPrivateGame: false,
    createdBy: "coach@example.com"
  },
  {
    playerId: "550e8400-e29b-41d4-a716-446655440001",
    gameId: "G1",
    statType: "ThreePT_Made",
    value: 2,
    timestamp: "2025-05-01T10:40:00Z",
    isPrivateGame: false,
    createdBy: "coach@example.com"
  },
  {
    playerId: "550e8400-e29b-41d4-a716-446655440001",
    gameId: "G1",
    statType: "Assists",
    value: 4,
    timestamp: "2025-05-01T10:45:00Z",
    isPrivateGame: false,
    createdBy: "coach@example.com"
  },
  {
    playerId: "550e8400-e29b-41d4-a716-446655440001",
    gameId: "G1",
    statType: "Rebounds",
    value: 7,
    timestamp: "2025-05-01T10:50:00Z",
    isPrivateGame: false,
    createdBy: "coach@example.com"
  }
];

export function recordStat(
  playerId: string, 
  gameId: string, 
  statType: StatType, 
  value: number, 
  timestamp: Date = new Date(),
  isPrivateGame: boolean = false,
  createdBy: string // Required parameter
) {
  console.log(`Recording stat: ${statType} with value ${value} for player ${playerId} in game ${gameId}${isPrivateGame ? ' (Private)' : ''}`);
  
  // Validate inputs
  if (!playerId || !gameId || !statType) {
    console.error("Invalid input parameters for recordStat");
    return;
  }
  
  // Ensure value is a number
  if (isNaN(value)) {
    console.error("Invalid value for recordStat:", value);
    return;
  }
  
  stats.push({
    playerId,
    gameId,
    statType,
    value,
    timestamp: timestamp.toISOString(), // Convert Date to string
    isPrivateGame,
    createdBy
  });
  
  console.log(`Stats recorded successfully. Total stats: ${stats.length}`);
}

export function getPointValueForStatType(statType: StatType): number {
  // Fix for issue #3: Ensuring missed shots don't add points
  if (statType === 'FG_Missed' || statType === 'ThreePT_Missed' || statType === 'FT_Missed') {
    return 0; // Missed shots don't contribute to points
  }
  return POINT_VALUES[statType] || 0;
}

// Calculate actual points considering positive or negative values
export function calculatePoints(statType: StatType, value: number): number {
  // Only made shots contribute to points, missed shots don't
  const pointValue = getPointValueForStatType(statType);
  return value * pointValue;
}

// Get stats filtered by visibility (official, private, or both)
export function getVisibleStats(
  userEmail: string | null = null, 
  includePrivate: boolean = true,
  includeOfficial: boolean = true
) {
  return stats.filter(stat => {
    if (!includePrivate && stat.isPrivateGame) return false;
    if (!includeOfficial && !stat.isPrivateGame) return false;
    
    // If private game, check if the user created it
    if (stat.isPrivateGame && userEmail) {
      return stat.createdBy === userEmail;
    }
    
    return true;
  });
}
