
import { Game } from "./types";
import { format } from "date-fns";

export const games: Game[] = [
  { id: "G1", opponent: "Team Rise", date: "2025-05-01", team_id: "default-team" },
  { id: "G2", opponent: "AZ Hoopers", date: "2025-05-03", team_id: "default-team" },
  { id: "G3", opponent: "Flight Blue", date: "2025-05-05", team_id: "default-team" },
];

// Helper function to format date correctly accounting for timezone
export const formatDateForStorage = (dateString: string): string => {
  // Parse the input date string and ensure it's formatted consistently
  // This prevents timezone issues where the stored date appears different from the selected date
  const date = new Date(dateString);
  // Format as YYYY-MM-DD
  return format(date, "yyyy-MM-dd");
};

// Function to add a new game (official or private)
export const addGame = (game: Game) => {
  // Ensure date is properly formatted to avoid timezone issues
  const formattedGame = {
    ...game,
    date: formatDateForStorage(game.date)
  };
  
  games.push(formattedGame);
  
  // Log game creation
  console.log(`Game created: ${formattedGame.id} - ${formattedGame.opponent} on ${formattedGame.date} ${formattedGame.isPrivate ? '(Private)' : '(Official)'} by ${formattedGame.createdBy || 'Unknown'}`);
  
  return formattedGame;
};

// Function to get games visible to a specific user
export const getVisibleGames = (userEmail: string, isCoach: boolean): Game[] => {
  // Coaches see all official games
  if (isCoach) {
    return games;
  }
  
  // Parents see all official games AND their own private games
  return games.filter(game => 
    !game.isPrivate || (game.isPrivate && game.createdBy === userEmail)
  );
};
