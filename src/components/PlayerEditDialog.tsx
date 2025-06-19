
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, User, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Player } from '@/types';

interface PlayerEditDialogProps {
  player: Player;
  onPlayerUpdated: (updatedPlayer: Player) => void;
  userEmail: string;
}

const PlayerEditDialog: React.FC<PlayerEditDialogProps> = ({ player, onPlayerUpdated, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [playerName, setPlayerName] = useState(player.name);
  const [playerNumber, setPlayerNumber] = useState(player.playerNumber || '');
  const [playerPhoto, setPlayerPhoto] = useState<string | undefined>(player.photoUrl);
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

  const handleUpdatePlayer = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    try {
      setIsLoading(true);
      
      const updatedPlayer: Player = {
        ...player,
        name: playerName.trim(),
        playerNumber: playerNumber.trim() || undefined,
        photoUrl: playerPhoto
      };

      // Update in localStorage
      const storageKey = `gametriq_manual_players_${userEmail}`;
      const existingPlayers = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedPlayers = existingPlayers.map((p: Player) => 
        p.id === player.id ? updatedPlayer : p
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedPlayers));

      onPlayerUpdated(updatedPlayer);
      toast.success(`Player "${playerName}" updated successfully!`);
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error('Failed to update player');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setPlayerName(player.name);
      setPlayerNumber(player.playerNumber || '');
      setPlayerPhoto(player.photoUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Player</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update player information.
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
            <label className="text-sm font-medium text-gray-300" htmlFor="edit-player-name">
              Player Name *
            </label>
            <Input
              id="edit-player-name"
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-green-500"
            />
          </div>

          {/* Jersey Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="edit-player-number">
              Jersey Number (Optional)
            </label>
            <Input
              id="edit-player-number"
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
            onClick={handleUpdatePlayer}
            disabled={isLoading || !playerName.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Player'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerEditDialog;
