
// Verified by Agent Zero on June 14, 2025
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner';
import { handleError } from '@/utils/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import GametriqLogo from './GametriqLogo';
import AuthBackground from './AuthBackground';
import { AlertCircle, Mail, Lock, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { handlePostLoginRedirect } = useAuth();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/app');
      }
    };
    checkAuthState();
  }, [navigate]);

  const handleLogin = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('🔐 LoginForm: Attempting login for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        console.error('❌ LoginForm: Login failed:', error);
        throw error;
      }
      
      console.log('✅ LoginForm: Login successful');
      toast.success('Login successful!');
      
      // Redirect to app
      navigate('/app');
      
    } catch (error: any) {
      console.error('❌ LoginForm: Login error:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        handleError(error, { 
          context: "Logging in",
          showToast: true
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('🔐 LoginForm: Attempting signup for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        console.error('❌ LoginForm: Signup failed:', error);
        throw error;
      }
      
      console.log('✅ LoginForm: Signup successful');
      toast.success('Account created successfully! Please check your email to verify your account.');
      
      // Switch back to login mode
      setIsSignUp(false);
      reset();
      
    } catch (error: any) {
      console.error('❌ LoginForm: Signup error:', error);
      
      if (error.message?.includes('already registered')) {
        toast.error('An account with this email already exists. Please try logging in instead.');
        setIsSignUp(false);
      } else {
        handleError(error, { 
          context: "Creating account",
          showToast: true
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('🔄 LoginForm: Sending password reset for:', data.email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/password-setup`
      });
      
      if (error) {
        console.error('❌ LoginForm: Password reset failed:', error);
        throw error;
      }
      
      console.log('✅ LoginForm: Password reset sent');
      toast.success('Password reset email sent! Check your inbox.');
      setResetEmailSent(true);
      setShowForgotPassword(false);
      
    } catch (error: any) {
      console.error('❌ LoginForm: Password reset error:', error);
      handleError(error, { 
        context: "Sending password reset",
        showToast: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: LoginFormValues) => {
    if (showForgotPassword) {
      handleForgotPassword(data);
    } else if (isSignUp) {
      handleSignUp(data);
    } else {
      handleLogin(data);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ LoginForm: User signed in:', session.user.email);
          navigate('/app');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (resetEmailSent) {
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
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-center font-bold text-2xl text-green-400">
                  CHECK YOUR EMAIL
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  We've sent you a password reset link.
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4 text-center">
                  <p className="text-gray-400 text-sm">
                    Click the link in your email to reset your password.
                  </p>
                  
                  <Button 
                    onClick={() => {
                      setResetEmailSent(false);
                      setShowForgotPassword(false);
                    }}
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white"
                  >
                    Back to Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

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
                {showForgotPassword ? 'RESET PASSWORD' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN TO GAMETRIQ'}
              </CardTitle>
              <p className="text-gray-300 text-sm">
                {showForgotPassword 
                  ? 'Enter your email to receive a password reset link.' 
                  : isSignUp 
                    ? 'Create your Gametriq account to get started.'
                    : 'Enter your email and password to access your account.'
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
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                {!showForgotPassword && (
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className={`bg-gray-800 border text-gray-100 placeholder:text-gray-500 h-12 pr-12 ${
                          errors.password ? "border-red-500" : "border-gray-700"
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 py-6 rounded-full text-base font-medium transition-all transform hover:translate-y-[-2px] hover:shadow-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {showForgotPassword ? 'Sending...' : isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {showForgotPassword ? (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Reset Link
                        </>
                      ) : isSignUp ? (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Create Account
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </>
                  )}
                </Button>
              </form>
              
              <div className="text-center text-sm text-gray-400 mt-6 space-y-3">
                {!showForgotPassword && !isSignUp && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    Forgot your password?
                  </button>
                )}
                
                {!showForgotPassword && (
                  <div className="border-t border-gray-700 pt-4">
                    <p className="mb-2">
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        reset();
                      }}
                      className="text-green-400 hover:text-green-300 underline font-medium"
                    >
                      {isSignUp ? 'Sign In' : 'Create Account'}
                    </button>
                  </div>
                )}
                
                {showForgotPassword && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-gray-400 hover:text-white underline"
                  >
                    Back to Sign In
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
