
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleError } from '@/utils/errorHandling';

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface FirstLoginOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
}

const FirstLoginOnboarding: React.FC<FirstLoginOnboardingProps> = ({ 
  isOpen, 
  onComplete 
}) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const handlePasswordChange = async (data: PasswordFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) throw error;
      
      // Move to next step
      setStep(2);
      reset();
      toast.success("Password updated successfully!");
    } catch (error) {
      handleError(error, { 
        context: "Updating password",
        showToast: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('users')
        .update({ has_logged_in: true })
        .eq('id', currentUser?.id);
        
      if (error) throw error;
      
      toast.success("Welcome to Gametriq!");
      onComplete();
    } catch (error) {
      handleError(error, { 
        context: "Completing onboarding",
        showToast: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Set Your Password" : "Welcome to Gametriq"}
          </DialogTitle>
        </DialogHeader>
        
        {step === 1 ? (
          <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
            <p className="text-sm text-gray-500">
              Please set a secure password for your account.
            </p>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">New Password</label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Set Password"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">
                  {currentUser?.role === 'Parent' 
                    ? "You can now view your player's stats and track their progress."
                    : "You can now add players, create games, and track statistics."}
                </p>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleCompleteOnboarding}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Get Started"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FirstLoginOnboarding;
