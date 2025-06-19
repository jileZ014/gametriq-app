
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Camera, User } from "lucide-react";
import { Player } from "../types";
import { toast } from "@/components/ui/sonner";
import { useFormValidation, playerSchema, PlayerFormValues } from "@/utils/validation";

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, "id" | "stats"> & { playerNumber?: string; photoUrl?: string }) => void;
  isCoach: boolean;
  isLoading: boolean;
  existingPlayers: Player[];
  teamId?: string;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer, isCoach, isLoading, existingPlayers, teamId = "default-team" }) => {
  const [formData, setFormData] = useState<PlayerFormValues>({
    name: "",
    playerNumber: "",
    parentEmail: ""
  });
  const [playerPhoto, setPlayerPhoto] = useState<string | undefined>(undefined);
  const { errors, validate } = useFormValidation(playerSchema);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "playerNumber") {
      const numValue = parseInt(value);
      if (value !== "" && (isNaN(numValue) || numValue < 0 || numValue > 99)) {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const validateJerseyNumber = (jerseyNumber: string): string | null => {
    if (!jerseyNumber) return null;
    
    const num = parseInt(jerseyNumber);
    if (isNaN(num) || num < 0 || num > 99) {
      return "Jersey number must be between 0 and 99";
    }
    
    const isDuplicate = existingPlayers.some(player => 
      player.playerNumber === jerseyNumber && player.playerNumber !== ""
    );
    
    if (isDuplicate) {
      return `Jersey number ${jerseyNumber} is already taken`;
    }
    
    return null;
  };

  const handleAddPlayer = () => {
    const jerseyError = validateJerseyNumber(formData.playerNumber);
    if (jerseyError) {
      toast.error(jerseyError);
      return;
    }

    if (validate(formData)) {
      onAddPlayer({
        name: formData.name,
        playerNumber: formData.playerNumber,
        parentEmail: formData.parentEmail,
        photoUrl: playerPhoto,
        team_id: teamId
      });
      
      setFormData({
        name: "",
        playerNumber: "",
        parentEmail: ""
      });
      setPlayerPhoto(undefined);
    } else {
      toast.error("Please correct the form errors");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  const jerseyError = validateJerseyNumber(formData.playerNumber);

  return (
    <Card className="modern-card shadow-lg">
      <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-t-xl">
        <CardTitle className="text-xl text-gray-800 dark:text-white">Add New Player</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3">
          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Player Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-blue-600 overflow-hidden">
                  {playerPhoto ? (
                    <img 
                      src={playerPhoto} 
                      alt="Player preview" 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handlePhotoUpload}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Camera className="mr-2 h-4 w-4" />
                {playerPhoto ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Input 
                placeholder="Player name" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-700 placeholder:text-gray-400 focus:ring-blue-600 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500`}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <Input 
                placeholder="Jersey # (0-99)" 
                name="playerNumber"
                type="number"
                min="0"
                max="99"
                value={formData.playerNumber || ""} 
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`bg-white border ${jerseyError || errors.playerNumber ? 'border-red-500' : 'border-gray-300'} text-gray-700 placeholder:text-gray-400 focus:ring-blue-600 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500`}
                aria-invalid={!!(jerseyError || errors.playerNumber)}
              />
              {(jerseyError || errors.playerNumber) && (
                <p className="mt-1 text-sm text-red-500">{jerseyError || errors.playerNumber}</p>
              )}
            </div>
          </div>
          {isCoach && (
            <div>
              <Input 
                placeholder="Parent email (optional)" 
                name="parentEmail"
                value={formData.parentEmail || ""}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`bg-white border ${errors.parentEmail ? 'border-red-500' : 'border-gray-300'} text-gray-700 placeholder:text-gray-400 focus:ring-blue-600 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500`}
                aria-invalid={!!errors.parentEmail}
              />
              {errors.parentEmail && (
                <p className="mt-1 text-sm text-red-500">{errors.parentEmail}</p>
              )}
            </div>
          )}
          <Button 
            onClick={handleAddPlayer}
            disabled={isLoading || !formData.name.trim() || !!jerseyError}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:-translate-y-1 hover:shadow-lg rounded-lg btn-glow"
          >
            <Plus className="mr-1" /> Add Player
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
