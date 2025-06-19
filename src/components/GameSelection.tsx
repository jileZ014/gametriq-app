
import React from "react";
import { useGames } from "@/hooks/useGames";
import GroupedGamesList from "@/components/GroupedGamesList";
import CreateGameForm from "@/components/CreateGameForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";

interface GameSelectionProps {
  selectedGameId: string | null;
  onGameSelect: (gameId: string) => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({ 
  selectedGameId, 
  onGameSelect 
}) => {
  const { currentUser } = useAuth();
  const { games, isLoadingGames, createGame, isCreatingGame } = useGames();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  
  console.log('GameSelection: Received selectedGameId prop:', selectedGameId);
  console.log('GameSelection: selectedGameId type:', typeof selectedGameId);
  console.log('GameSelection: selectedGameId is null:', selectedGameId === null);
  
  const handleCreateGame = async (data: {
    opponent_name: string;
    game_date: Date;
    is_private: boolean;
    location?: string;
    opponent_team_name?: string;
    opponent_players?: string[];
  }) => {
    await createGame(data);
    setIsCreateDialogOpen(false);
  };

  const handleGameSelect = (gameId: string) => {
    console.log('GameSelection: handleGameSelect called with gameId:', gameId);
    console.log('GameSelection: About to call onGameSelect');
    onGameSelect(gameId);
    console.log('GameSelection: onGameSelect called');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Game Selection</h2>
        {currentUser && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Game
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Game</DialogTitle>
              </DialogHeader>
              <CreateGameForm 
                onSubmitGame={handleCreateGame}
                isSubmitting={isCreatingGame}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Debug info for GameSelection */}
      <div className="bg-red-100 dark:bg-red-900/30 rounded border p-2">
        <p className="text-xs text-red-800 dark:text-red-300">
          GAMESELECTION DEBUG: selectedGameId = "{selectedGameId}" (type: {typeof selectedGameId}, is null: {selectedGameId === null ? 'true' : 'false'})
        </p>
      </div>
      
      {isLoadingGames ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <p>Loading games...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <GroupedGamesList
          games={games}
          selectedGameId={selectedGameId || ""}
          onGameSelect={handleGameSelect}
          hasPrivateGames={games.some(game => game.isPrivate)}
        />
      )}
    </div>
  );
};

export default GameSelection;
