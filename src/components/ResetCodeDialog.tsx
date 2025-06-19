
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { PasswordResetService } from '@/services/PasswordResetService';
import { handleError } from '@/utils/errorHandling';

interface ResetCodeDialogProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ResetCodeDialog: React.FC<ResetCodeDialogProps> = ({ email, isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetCode, setResetCode] = useState<string | null>(null);

  const handleGenerateCode = () => {
    const code = PasswordResetService.generateResetCode(email);
    setResetCode(code);
    toast.success("Reset code generated! Use it to reset your password.");
  };

  const handleResetPassword = async () => {
    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const result = await PasswordResetService.resetPassword(
        email, 
        code,
        password
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success("Password reset successful! You can now log in.");
      onSuccess();
    } catch (error) {
      handleError(error, { 
        context: "Resetting password",
        showToast: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/80 backdrop-blur-md text-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-green-400">Reset Password</DialogTitle>
          <DialogDescription className="text-gray-300">
            Generate a reset code to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 my-4">
          {!resetCode ? (
            <div className="text-center">
              <p className="mb-5 text-gray-300">
                Generate a reset code to reset the password for <span className="font-medium text-green-400">{email}</span>
              </p>
              <Button 
                onClick={handleGenerateCode}
                className="w-full py-6 rounded-full text-base font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              >
                Generate Reset Code
              </Button>
            </div>
          ) : (
            <>
              <div className="p-4 bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-300 mb-2">Your reset code is:</p>
                <p className="text-2xl font-mono font-bold text-green-400 tracking-wider">{resetCode}</p>
                <p className="text-xs text-gray-400 mt-2">This code is valid for 15 minutes</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Enter Code</label>
                  <Input 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-100"
                    placeholder="Enter your reset code"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300">New Password</label>
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-100"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <Input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-100"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-gray-300 border-gray-700 hover:bg-gray-800"
          >
            Cancel
          </Button>
          
          {resetCode && (
            <Button 
              onClick={handleResetPassword}
              disabled={isSubmitting || !code || !password || !confirmPassword}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetCodeDialog;
