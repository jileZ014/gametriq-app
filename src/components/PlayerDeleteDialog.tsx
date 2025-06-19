
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Player } from '@/types';

interface PlayerDeleteDialogProps {
  player: Player;
  onPlayerDeleted: (playerId: string) => void;
  userEmail: string;
}

const PlayerDeleteDialog: React.FC<PlayerDeleteDialogProps> = ({ player, onPlayerDeleted, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePlayer = async () => {
    try {
      setIsDeleting(true);
      
      // Remove player from localStorage
      const storageKey = `gametriq_manual_players_${userEmail}`;
      const existingPlayers = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedPlayers = existingPlayers.filter((p: Player) => p.id !== player.id);
      localStorage.setItem(storageKey, JSON.stringify(updatedPlayers));

      onPlayerDeleted(player.id);
      toast.success(`Player "${player.name}" deleted successfully!`);
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Failed to delete player');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Player
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete "{player.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePlayer}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Player'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDeleteDialog;
