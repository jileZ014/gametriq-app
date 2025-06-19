
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Game } from '@/types';
import { format } from 'date-fns';

interface ManualGameCreationProps {
  onGameCreated: (game: Game) => void;
  userEmail: string;
}

const ManualGameCreation: React.FC<ManualGameCreationProps> = ({ onGameCreated, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gameName, setGameName] = useState('');
  const [gameDate, setGameDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [coachEmail, setCoachEmail] = useState('');
  const [linkToCoach, setLinkToCoach] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      toast.error('Please enter a game name');
      return;
    }

    if (linkToCoach && !coachEmail.trim()) {
      toast.error('Please enter coach email to link the game');
      return;
    }

    try {
      setIsLoading(true);
      
      const newGame: Game = {
        id: `manual-game-${Date.now()}-${Math.random()}`,
        opponent: gameName.trim(),
        date: gameDate,
        isPrivate: !linkToCoach,
        createdBy: userEmail,
        team_id: linkToCoach ? `linked-team-${coachEmail}` : `manual-team-${userEmail}`,
        location: 'Manual Entry',
        is_active: false
      };

      const storageKey = linkToCoach 
        ? `gametriq_linked_games_${userEmail}`
        : `gametriq_manual_games_${userEmail}`;
      
      const existingGames = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingGames.push(newGame);
      localStorage.setItem(storageKey, JSON.stringify(existingGames));

      // If linking to coach, also store a reference for the coach
      if (linkToCoach) {
        const coachStorageKey = `gametriq_parent_linked_games_${coachEmail}`;
        const coachGames = JSON.parse(localStorage.getItem(coachStorageKey) || '[]');
        coachGames.push({
          ...newGame,
          linkedByParent: userEmail,
          needsApproval: true
        });
        localStorage.setItem(coachStorageKey, JSON.stringify(coachGames));
      }

      onGameCreated(newGame);
      
      const message = linkToCoach 
        ? `Game "${gameName}" created and linked to coach ${coachEmail}!`
        : `Private game "${gameName}" created successfully!`;
      
      toast.success(message);
      
      setGameName('');
      setCoachEmail('');
      setLinkToCoach(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Game
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a game to track stats manually. You can keep it private or link it to a coach.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="game-name">
              Game/Practice Name
            </label>
            <Input
              id="game-name"
              placeholder="e.g., 'Home Practice', 'Scrimmage vs Eagles'"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="game-date">
              Date
            </label>
            <Input
              id="game-date"
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Link to Coach Account
                </label>
                <p className="text-xs text-gray-400">
                  Allow a coach to see this game and its stats
                </p>
              </div>
              <Switch
                checked={linkToCoach}
                onCheckedChange={setLinkToCoach}
              />
            </div>
            
            {linkToCoach && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="coach-email">
                  Coach Email
                </label>
                <Input
                  id="coach-email"
                  placeholder="Enter coach's email address"
                  value={coachEmail}
                  onChange={(e) => setCoachEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">
                  The coach will be able to view and approve stats from this game
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGame}
            disabled={isLoading || !gameName.trim() || (linkToCoach && !coachEmail.trim())}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Creating...' : 'Create Game'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualGameCreation;
