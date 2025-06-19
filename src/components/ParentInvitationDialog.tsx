
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Player } from "@/types";
import { PlayerLinkingService } from "@/services/PlayerLinkingService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";

interface ParentInvitationDialogProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (parentEmail: string) => void;
}

const ParentInvitationDialog: React.FC<ParentInvitationDialogProps> = ({
  player,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [parentEmail, setParentEmail] = useState(player.parentEmail || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleInviteParent = async () => {
    if (!parentEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await PlayerLinkingService.linkPlayerToParent({
        playerId: player.id,
        parentEmail: parentEmail.trim(),
        sendInvitation: true,
        coachName: currentUser?.name || "Your coach",
        teamName: currentUser?.teamName || "Basketball team"
      });

      if (result.success) {
        toast.success(result.message || "Parent invitation sent successfully!");
        onSuccess(parentEmail.trim());
        onClose();
      } else {
        toast.error(result.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting parent:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async () => {
    if (!player.parentEmail) return;

    try {
      setIsLoading(true);
      
      const result = await PlayerLinkingService.linkPlayerToParent({
        playerId: player.id,
        parentEmail: player.parentEmail,
        sendInvitation: true,
        coachName: currentUser?.name || "Your coach",
        teamName: currentUser?.teamName || "Basketball team"
      });

      if (result.success) {
        toast.success("Invitation resent successfully!");
      } else {
        toast.error(result.error || "Failed to resend invitation");
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" />
            {player.parentEmail ? "Manage Parent Access" : "Invite Parent"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {player.parentEmail 
              ? `Current parent: ${player.parentEmail}`
              : `Invite ${player.name}'s parent to view game statistics`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="parent-email" className="text-gray-300">
              Parent Email Address
            </Label>
            <Input
              id="parent-email"
              type="email"
              placeholder="parent@example.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              disabled={isLoading}
            />
          </div>
          
          {player.parentEmail && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
              <p className="text-green-300 text-sm">
                ✓ Parent already linked to this player
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          {player.parentEmail ? (
            <Button 
              onClick={handleResendInvitation}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Invitation
            </Button>
          ) : (
            <Button 
              onClick={handleInviteParent}
              disabled={isLoading || !parentEmail.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParentInvitationDialog;
