
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from 'lucide-react';
import GametriqLogo from './GametriqLogo';
import AuthBackground from './AuthBackground';
import PasswordValidation from './PasswordValidation';

const passwordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
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

interface PasswordFormProps {
  emailFromUrl: string;
  isResetMode: boolean;
  isSubmitting: boolean;
  onSubmit: (data: PasswordFormValues) => Promise<void>;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
  emailFromUrl,
  isResetMode,
  isSubmitting,
  onSubmit
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      email: emailFromUrl,
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  return (
    <>
      <AuthBackground />
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <GametriqLogo size="lg" animated={true} />
          </div>
          
          <Card className="border shadow-2xl bg-gray-900/80 backdrop-blur-md text-white rounded-2xl">
            <CardHeader className="pb-2 space-y-3 pt-6 text-center">
              <CardTitle className="text-center font-bold text-2xl text-green-400">
                {isResetMode ? "RESET YOUR PASSWORD" : "SET UP YOUR PASSWORD"}
              </CardTitle>
              <p className="text-gray-300 text-sm">
                {isResetMode 
                  ? "Enter your new password below." 
                  : "Welcome to Gametriq! Please set up your account password to get started."
                }
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`bg-gray-800 border text-gray-100 placeholder:text-gray-500 h-12 ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="Enter your email address"
                    readOnly={!!emailFromUrl}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    {isResetMode ? "New Password" : "New Password"}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`bg-gray-800 border text-gray-100 placeholder:text-gray-500 h-12 pr-10 ${
                        errors.password ? "border-red-500" : "border-gray-700"
                      }`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                  <PasswordValidation password={password || ''} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={`bg-gray-800 border text-gray-100 placeholder:text-gray-500 h-12 pr-10 ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-700"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 py-6 rounded-full text-base font-medium transition-all transform hover:translate-y-[-2px] hover:shadow-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isResetMode ? "Setting password..." : "Setting up account...") 
                    : (isResetMode ? "Set New Password" : "Set Up Password & Continue")
                  }
                </Button>
              </form>
              
              <div className="text-center text-sm text-gray-400 mt-4">
                <p>
                  {isResetMode 
                    ? "After setting your password, you'll be able to sign in with your new credentials."
                    : "After setting up your password, you'll be redirected to your dashboard."
                  }
                </p>
                <p className="mt-2">
                  Remember your password? <a href="/" className="text-green-400 hover:text-green-300 underline">Sign in here</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PasswordForm;
