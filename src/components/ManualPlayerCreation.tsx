
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, User, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Player } from '@/types';

interface ManualPlayerCreationProps {
  onPlayerCreated: (player: Player) => void;
  userEmail: string;
}

const ManualPlayerCreation: React.FC<ManualPlayerCreationProps> = ({ onPlayerCreated, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerPhoto, setPlayerPhoto] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPlayerPhoto(imageUrl);
        toast.success('Photo selected successfully!');
      }
    };
    
    input.click();
  };

  const handleCreatePlayer = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    try {
      setIsLoading(true);
      
      const newPlayer: Player = {
        id: `manual-player-${Date.now()}-${Math.random()}`,
        name: playerName.trim(),
        playerNumber: playerNumber.trim() || undefined,
        team_id: `manual-team-${userEmail}`,
        parent_user_id: userEmail,
        photoUrl: playerPhoto,
        parentEmail: userEmail,
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
      };

      const storageKey = `gametriq_manual_players_${userEmail}`;
      const existingPlayers = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingPlayers.push(newPlayer);
      localStorage.setItem(storageKey, JSON.stringify(existingPlayers));

      onPlayerCreated(newPlayer);
      toast.success(`Player "${playerName}" created successfully!`);
      
      // Reset form
      setPlayerName('');
      setPlayerNumber('');
      setPlayerPhoto(undefined);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating player:', error);
      toast.error('Failed to create player');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setPlayerName('');
      setPlayerNumber('');
      setPlayerPhoto(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Player
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Player</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a player to track their stats manually.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Photo Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
              Player Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-white text-xl font-bold bg-green-600 overflow-hidden border-2 border-gray-600">
                  {playerPhoto ? (
                    <img 
                      src={playerPhoto} 
                      alt="Player preview" 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <User className="h-10 w-10" />
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handlePhotoUpload}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Camera className="mr-2 h-4 w-4" />
                {playerPhoto ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>
          </div>

          {/* Player Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="player-name">
              Player Name *
            </label>
            <Input
              id="player-name"
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-green-500"
            />
          </div>

          {/* Jersey Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="player-number">
              Jersey Number (Optional)
            </label>
            <Input
              id="player-number"
              placeholder="Enter jersey number"
              value={playerNumber}
              onChange={(e) => setPlayerNumber(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => handleDialogClose(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePlayer}
            disabled={isLoading || !playerName.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Player'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualPlayerCreation;
