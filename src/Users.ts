// This file now only contains type definitions and utilities
// Mock authentication has been removed for security

import { User } from "./types";

// Sample users and players for testing and demonstration
export const developmentUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "coach@example.com", 
    role: "Coach",
    teamLogoUrl: "https://placehold.co/200x200?text=Tigers",
    teamName: "Tigers"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "coach2@example.com",
    role: "Coach", 
    teamLogoUrl: "https://placehold.co/200x200?text=Eagles",
    teamName: "Eagles"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "parent@example.com",
    role: "Parent"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    email: "parent2@example.com",
    role: "Parent"
  }
];

// Sample players for testing stat tracking functionality
export const samplePlayers = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "John Smith",
    team_id: "default-team",
    player_number: 23,
    stats: {
      fgMade: 5,
      fgMissed: 3,
      threePtMade: 2,
      threePtMissed: 1,
      ftMade: 4,
      ftMissed: 1,
      Assists: 4,
      Rebounds: 7,
      Steals: 2,
      Blocks: 1,
      Fouls: 2
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Emma Johnson",
    team_id: "default-team",
    player_number: 12,
    stats: {
      fgMade: 3,
      fgMissed: 2,
      threePtMade: 1,
      threePtMissed: 2,
      ftMade: 2,
      ftMissed: 0,
      Assists: 6,
      Rebounds: 4,
      Steals: 3,
      Blocks: 0,
      Fouls: 1
    }
  }
];

// Helper function to validate user roles
export const isValidRole = (role: string): role is "Coach" | "Parent" => {
  return role === "Coach" || role === "Parent";
};

// Helper function to create User object from Supabase auth user
export const createUserFromAuth = (authUser: any, role: "Coach" | "Parent"): User => {
  return {
    id: authUser.id,
    email: authUser.email || '',
    role: role,
    teamLogoUrl: undefined,
    teamName: undefined
  };
};
