
import React from "react";
import { format, isThisWeek, startOfWeek, endOfWeek, isBefore } from "date-fns";
import { Game } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GroupedGamesListProps {
  games: Game[];
  selectedGameId: string;
  onGameSelect: (gameId: string) => void;
  hasPrivateGames?: boolean;
}

const GroupedGamesList: React.FC<GroupedGamesListProps> = ({ 
  games, 
  selectedGameId, 
  onGameSelect,
  hasPrivateGames = false
}) => {
  
  console.log('GroupedGamesList render: selectedGameId prop =', selectedGameId, typeof selectedGameId);
  console.log('GroupedGamesList render: selectedGameId length =', selectedGameId.length);
  console.log('GroupedGamesList render: games =', games.length);

  // Group games by timeframe and whether they're private
  const officialGames = games.filter(game => !game.isPrivate);
  const privateGames = games.filter(game => game.isPrivate);
  
  // If no games are available, show a message
  if (games.length === 0) {
    return (
      <div className="rounded-xl bg-white shadow-md border border-gray-200 p-5 dark:bg-slate-800 dark:border-gray-700">
        <p className="text-center py-4 text-gray-500">No games available. Please add a game to start tracking stats.</p>
      </div>
    );
  }

  const handleGameSelect = (gameId: string) => {
    console.log('GroupedGamesList: handleGameSelect called with gameId:', gameId);
    console.log('GroupedGamesList: Current selectedGameId prop:', selectedGameId);
    console.log('GroupedGamesList: About to call onGameSelect with:', gameId);
    onGameSelect(gameId);
    console.log('GroupedGamesList: onGameSelect called');
  };
  
  return (
    <div className="space-y-4 rounded-xl bg-white shadow-md border border-gray-200 p-5 dark:bg-slate-800 dark:border-gray-700">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Select a Game</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Choose a game to track stats</p>
        
        {/* Debug info in the component */}
        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded border">
          <p className="text-xs text-red-800 dark:text-red-300">
            GROUPED DEBUG: selectedGameId = "{selectedGameId}" (type: {typeof selectedGameId}, length: {selectedGameId.length})
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {/* Official Games Buttons */}
          <div className="w-full">
            <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
              Official Games
            </Badge>
            <div className="flex flex-wrap gap-2">
              {officialGames.map(game => {
                // Fix the comparison - handle empty string as no selection
                const isSelected = selectedGameId && selectedGameId.length > 0 && selectedGameId === game.id;
                console.log(`GroupedGamesList: Game ${game.id} - isSelected: ${isSelected} (selectedGameId: "${selectedGameId}", game.id: "${game.id}")`);
                
                return (
                  <Button
                    key={game.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleGameSelect(game.id)}
                    className={`transition-all cursor-pointer min-w-[120px] ${
                      isSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-800 ring-2 ring-blue-400"
                        : "border-blue-300 text-blue-700 hover:bg-blue-50 bg-white border-2"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-medium">
                        {format(new Date(game.date), "MMM d")} vs {game.opponent}
                      </span>
                      {isSelected && (
                        <span className="text-xs opacity-80 font-bold">✓ SELECTED</span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Private Practice Sessions */}
          {privateGames.length > 0 && (
            <div className="w-full pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
              <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                Private Practice Sessions
              </Badge>
              <div className="flex flex-wrap gap-2">
                {privateGames.map(game => {
                  // Fix the comparison - handle empty string as no selection
                  const isSelected = selectedGameId && selectedGameId.length > 0 && selectedGameId === game.id;
                  console.log(`GroupedGamesList: Private Game ${game.id} - isSelected: ${isSelected}`);
                  
                  return (
                    <Button
                      key={game.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleGameSelect(game.id)}
                      className={`transition-all cursor-pointer min-w-[120px] ${
                        isSelected
                          ? "bg-green-600 text-white hover:bg-green-700 border-2 border-green-800 ring-2 ring-green-400"
                          : "border-green-300 text-green-700 hover:bg-green-50 bg-white border-2"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">
                          {format(new Date(game.date), "MMM d")} – {game.opponent}
                        </span>
                        {isSelected && (
                          <span className="text-xs opacity-80 font-bold">✓ SELECTED</span>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupedGamesList;
