
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandling";

export interface EmailTemplateParams {
  recipientName?: string;
  teamName?: string;
  verificationLink?: string;
  coachName?: string;
  playerName?: string;
  playerNames?: string;
  temporaryPassword?: string;
  resetLink?: string; // Added for password reset
}

export enum EmailTemplateType {
  PARENT_INVITATION = "parent_invitation",
  VERIFICATION = "email_verification",
  PASSWORD_RESET = "password_reset",
  WELCOME = "welcome"
}

export class EmailService {
  static async sendTemplatedEmail(
    to: string,
    templateType: EmailTemplateType,
    params: EmailTemplateParams = {},
    additionalParams: Record<string, any> = {}
  ) {
    console.log(`📧 EmailService: Starting ${templateType} email to: ${to}`);
    console.log(`📧 EmailService: Template params:`, params);
    console.log(`📧 EmailService: Additional params:`, additionalParams);
    
    try {
      const requestBody = { 
        to,
        templateType,
        params,
        ...additionalParams
      };
      
      console.log(`📧 EmailService: Calling edge function with body:`, requestBody);
      
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: requestBody
      });
      
      console.log(`📧 EmailService: Edge function response:`, { data, error });
      
      if (error) {
        console.error("❌ EmailService: Edge function error:", error);
        throw new Error(error.message || "Failed to send email");
      }
      
      // Check if the response indicates an error from the edge function
      if (data?.error) {
        console.error("❌ EmailService: Edge function returned error:", data.error);
        throw new Error(data.error);
      }
      
      console.log("✅ EmailService: Email sent successfully:", data);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error sending email";
      console.error("❌ EmailService: Final error:", errorMessage);
      console.error("❌ EmailService: Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  static async sendWelcomeEmail(
    parentEmail: string,
    recipientName?: string
  ) {
    console.log(`🎯 EmailService: sendWelcomeEmail called with:`, { parentEmail, recipientName });
    
    // Validate email before sending
    if (!parentEmail || !parentEmail.includes('@')) {
      console.error("❌ EmailService: Invalid email provided:", parentEmail);
      return {
        success: false,
        error: "Valid email address is required"
      };
    }

    console.log(`📧 EmailService: Sending welcome email to validated email: ${parentEmail}`);

    const result = await this.sendTemplatedEmail(
      parentEmail,
      EmailTemplateType.WELCOME,
      {
        recipientName: recipientName || parentEmail.split('@')[0]
      }
    );
    
    console.log(`🎯 EmailService: sendWelcomeEmail result:`, result);
    return result;
  }

  
  static async sendParentInvitation(
    parentEmail: string, 
    playerName: string, 
    coachName: string = "your coach",
    teamName: string = "basketball team",
    temporaryPassword?: string
  ) {
    console.log(`📧 EmailService: sendParentInvitation called for:`, { parentEmail, playerName, coachName, teamName });
    
    const subject = `You've been invited to join Gametriq!`;
    
    const result = await this.sendTemplatedEmail(
      parentEmail,
      EmailTemplateType.PARENT_INVITATION,
      {
        coachName,
        teamName,
        playerName,
        temporaryPassword
      }
    );
    
    console.log(`📧 EmailService: sendParentInvitation result:`, result);
    return result;
  }

  static async sendEmailVerification(email: string, verificationLink: string) {
    console.log(`📧 EmailService: Sending verification email to ${email} with link: ${verificationLink}`);
    
    try {
      const result = await this.sendTemplatedEmail(
        email,
        EmailTemplateType.VERIFICATION,
        {
          recipientName: email.split('@')[0],
          verificationLink
        }
      );
      
      if (!result.success) {
        console.error(`❌ EmailService: Failed to send verification email: ${result.error}`);
        return { success: false, error: result.error };
      }
      
      console.log(`✅ EmailService: Verification email sent successfully to ${email}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ EmailService: Error sending verification email: ${error}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error sending verification email'
      };
    }
  }

  static async sendPasswordReset(
    email: string,
    resetLink: string,
    recipientName?: string
  ) {
    console.log(`🔄 EmailService: Sending FULLY CUSTOM password reset email to: ${email}`);
    console.log(`🔗 EmailService: Custom reset link: ${resetLink}`);

    const result = await this.sendTemplatedEmail(
      email,
      EmailTemplateType.PASSWORD_RESET,
      {
        recipientName: recipientName || email.split('@')[0],
        resetLink: resetLink
      }
    );
    
    console.log(`🔄 EmailService: sendPasswordReset result:`, result);
    return result;
  }

  static async resendParentInvitation(
    parentEmail: string, 
    playerName: string,
    coachName: string = "your coach",
    teamName: string = "basketball team"
  ): Promise<{ success: boolean; message?: string }> {
    console.log(`🔄 EmailService: resendParentInvitation called for:`, { parentEmail, playerName, coachName, teamName });
    
    try {
      // Generate a new temporary password
      const temporaryPassword = this.generateTemporaryPassword();
      console.log(`🔑 EmailService: Generated temporary password for resend`);
      
      // Send the invitation email
      const result = await this.sendParentInvitation(
        parentEmail,
        playerName,
        coachName,
        teamName,
        temporaryPassword
      );
      
      if (!result.success) {
        throw new Error(result.error as string);
      }
      
      console.log(`✅ EmailService: Parent invitation resent successfully`);
      toast.success("Invitation email resent successfully");
      return { success: true };
    } catch (error) {
      console.error(`❌ EmailService: Error resending parent invitation:`, error);
      handleError(error, { 
        context: "Resending parent invitation",
        showToast: true
      });
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  private static generateTemporaryPassword(length = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    console.log(`🔑 EmailService: Generated temporary password of length ${length}`);
    return result;
  }
}
