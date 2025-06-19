
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class PasswordResetService {
  // Store reset codes with expiration timestamps in memory
  // In a production app, this would be in a database
  private static resetCodes: Record<string, { code: string, expires: number }> = {};
  
  /**
   * Generate a reset code for an email
   */
  static generateResetCode(email: string): string {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code with a 15-minute expiration
    const expires = Date.now() + 15 * 60 * 1000;
    this.resetCodes[email.toLowerCase()] = { code, expires };
    
    console.log(`🔑 Generated reset code for ${email}: ${code}`);
    return code;
  }
  
  /**
   * Validate a reset code for an email
   */
  static validateResetCode(email: string, code: string): boolean {
    const entry = this.resetCodes[email.toLowerCase()];
    
    if (!entry) {
      console.log(`❌ No reset code found for ${email}`);
      return false;
    }
    
    if (Date.now() > entry.expires) {
      console.log(`❌ Reset code for ${email} has expired`);
      delete this.resetCodes[email.toLowerCase()];
      return false;
    }
    
    if (entry.code !== code) {
      console.log(`❌ Invalid reset code for ${email}: ${code} (expected ${entry.code})`);
      return false;
    }
    
    console.log(`✅ Valid reset code for ${email}`);
    return true;
  }
  
  /**
   * Reset a password using a validated code
   */
  static async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First validate the code
      if (!this.validateResetCode(email, code)) {
        return { success: false, error: 'Invalid or expired code' };
      }
      
      // If valid, sign up the user with the new password
      // This either creates a new account or updates the password if the account exists
      const { data, error } = await supabase.auth.signUp({
        email,
        password: newPassword
      });
      
      if (error) {
        console.error('❌ Failed to update password:', error);
        
        // If account already exists, try admin password update
        if (error.message.includes('already registered')) {
          // Try admin update instead
          const { error: adminError } = await supabase.auth.admin.updateUserById(
            email, // We're using the email as the identifier
            { password: newPassword }
          );
          
          if (adminError) {
            return { success: false, error: adminError.message };
          }
        } else {
          return { success: false, error: error.message };
        }
      }
      
      // Remove the code after successful reset
      delete this.resetCodes[email.toLowerCase()];
      
      console.log('✅ Password reset successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
