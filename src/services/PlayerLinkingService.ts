
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EmailService } from './EmailService';

interface LinkPlayerToParentParams {
  playerId: string;
  parentEmail: string;
  sendInvitation?: boolean;
  coachName?: string;
  teamName?: string;
}

interface LinkResult {
  success: boolean;
  parentUserId?: string;
  isNewUser?: boolean;
  message?: string;
  error?: string;
}

export class PlayerLinkingService {
  static async linkPlayerToParent({
    playerId,
    parentEmail,
    sendInvitation = true,
    coachName = 'Your coach',
    teamName = 'Basketball team'
  }: LinkPlayerToParentParams): Promise<LinkResult> {
    try {
      // Get the player first to ensure it exists
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('name, team_id')
        .eq('id', playerId)
        .single();

      if (playerError) {
        console.error("Error fetching player:", playerError);
        return { 
          success: false, 
          error: "Player not found"
        };
      }

      // Check if parent user already exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', parentEmail)
        .eq('role', 'Parent')
        .single();

      let parentUserId: string;
      let isNewUser = false;

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist, create a new user with a temporary password
        const tempPassword = this.generateTemporaryPassword();
        
        // Create the user in auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: parentEmail,
          password: tempPassword,
          email_confirm: true, // Auto-confirm for testing
          user_metadata: {
            role: 'Parent'
          }
        });

        if (authError) {
          console.error("Error creating user:", authError);
          return {
            success: false,
            error: authError.message
          };
        }

        parentUserId = authUser.user.id;
        isNewUser = true;
        
        if (sendInvitation) {
          // Send invitation email
          await EmailService.sendParentInvitation(
            parentEmail,
            playerData.name,
            coachName,
            teamName,
            tempPassword
          );
        }
      } else if (userError) {
        // Some other error occurred
        console.error("Error checking if parent exists:", userError);
        return {
          success: false,
          error: userError.message
        };
      } else {
        // User exists
        parentUserId = userData.id;

        // Send notification email if requested
        if (sendInvitation) {
          await EmailService.sendParentInvitation(
            parentEmail,
            playerData.name,
            coachName,
            teamName
          );
        }
      }

      // Update player with parent email
      const { error: updateError } = await supabase
        .from('players')
        .update({ parent_email: parentEmail, parent_user_id: parentUserId })
        .eq('id', playerId);

      if (updateError) {
        console.error("Error updating player with parent:", updateError);
        return {
          success: false,
          error: updateError.message
        };
      }

      // Success!
      return {
        success: true,
        parentUserId,
        isNewUser,
        message: isNewUser 
          ? `New parent account created and invitation email sent to ${parentEmail}`
          : `Player linked to existing parent account: ${parentEmail}`
      };
    } catch (error) {
      console.error("Error in linkPlayerToParent:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  static async getPlayersByParent(parentUserId: string) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('parent_user_id', parentUserId);

      if (error) {
        console.error("Error fetching parent's players:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPlayersByParent:", error);
      return [];
    }
  }

  private static generateTemporaryPassword(length = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}
