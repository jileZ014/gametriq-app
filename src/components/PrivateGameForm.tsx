
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game } from "../types";
import { format } from "date-fns";
import { useGames } from "@/hooks/useGames";

interface PrivateGameFormProps {
  userEmail: string;
}

const PrivateGameForm: React.FC<PrivateGameFormProps> = ({ userEmail }) => {
  const [opponent, setOpponent] = useState("");
  const [gameDate, setGameDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { createGame, isCreatingGame } = useGames();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponent.trim()) return;
    
    await createGame({
      opponent_name: opponent,
      game_date: new Date(gameDate),
      is_private: true
    });
    
    setOpponent("");
    setGameDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <Card className="modern-card shadow-lg border border-gray-700 bg-gray-800">
      <CardHeader className="pb-3 border-b border-gray-700 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-t-xl">
        <CardTitle className="text-xl text-white">Create New Game (Custom Game)</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="opponent" className="block text-sm font-medium text-gray-300 mb-1">Game Name / Opponent</label>
              <Input
                id="opponent"
                placeholder="Enter game name or opponent"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="gameDate" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <Input
                id="gameDate"
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isCreatingGame || !opponent.trim()}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200 ease-in-out flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Create Custom Game
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrivateGameForm;
