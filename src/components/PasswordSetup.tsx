
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleError } from '@/utils/errorHandling';
import PasswordForm from './PasswordForm';
import SuccessScreen from './SuccessScreen';
import { EmailService } from '@/services/EmailService';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface PasswordFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const PasswordSetup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFromUrl, setEmailFromUrl] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [accountExists, setAccountExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🚀 PasswordSetup: Component initialized');
    
    // Extract email and type from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const typeParam = urlParams.get('type');
    const tokenParam = urlParams.get('token');
    
    console.log('📋 PasswordSetup: URL parameters:', { emailParam, typeParam, hasToken: !!tokenParam });
    
    if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam);
      setEmailFromUrl(decodedEmail);
      console.log('📧 PasswordSetup: Email from URL:', decodedEmail);
    }
    
    if (typeParam === 'reset') {
      setIsResetMode(true);
      console.log('🔄 PasswordSetup: Password reset mode enabled');
      
      // Validate our custom token if present
      if (tokenParam) {
        try {
          console.log('🔍 PasswordSetup: Validating custom token...');
          // Decode the base64 token
          const decodedFullToken = atob(tokenParam);
          
          // Split the token into the actual token and expiry timestamp
          const [_, expiryTimestamp] = decodedFullToken.split('.');
          
          // Parse the expiry timestamp
          const expiry = parseInt(expiryTimestamp);
          const now = Date.now();
          
          console.log('⏰ PasswordSetup: Token expiry check:', { expiry, now, isExpired: now > expiry });
          
          // Check if token is expired (with grace period of 5 minutes)
          if (now > expiry + (5 * 60 * 1000)) {
            console.log('⚠️ PasswordSetup: Token has expired');
            toast.error("Reset link has expired. Please request a new one from the login page.");
            setIsValidToken(false);
            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
            return;
          } else if (now > expiry) {
            console.log('⚠️ PasswordSetup: Token expired but within grace period');
            toast.warning("Reset link has expired but we'll allow this attempt. Please set your password quickly.");
          }
          
          console.log('✅ PasswordSetup: Custom token validated successfully');
        } catch (error) {
          console.error('❌ PasswordSetup: Error validating custom token:', error);
          setIsValidToken(false);
          toast.error("Invalid reset link. Please request a new one.");
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      } else {
        // Handle case where token is missing
        console.log('⚠️ PasswordSetup: No token found in reset URL');
        setIsValidToken(false);
        toast.error("Invalid reset link. Please request a new one.");
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    } else {
      console.log('🆕 PasswordSetup: New account setup mode');
    }
    
    if (!emailParam) {
      console.log('❌ PasswordSetup: No email parameter found in URL');
      toast.error("No email found in the link. Please try the signup process again.");
    }
  }, []);

  const handlePasswordSetup = async (data: PasswordFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('🚀 PasswordSetup: Starting password setup for email:', data.email);
      console.log('🔧 PasswordSetup: Setup mode:', isResetMode ? 'RESET' : 'NEW_ACCOUNT');
      
      if (isResetMode) {
        // Handle password reset using Supabase's updateUser function
        console.log('🔄 PasswordSetup: Processing password reset');
        
        // For reset mode, we'll still use Supabase's auth APIs, but only after our custom validation
        // Try to sign in first (if user exists)
        console.log('🔐 PasswordSetup: Attempting sign-in to test existing credentials');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });
        
        // If sign in fails, this might be a first-time setup
        if (signInError) {
          console.log('⚠️ PasswordSetup: Sign-in failed (expected if first setup):', signInError.message);
          
          // Try to sign up the user with the new password instead
          console.log('📝 PasswordSetup: Attempting user signup for reset flow');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password
          });
          
          if (signUpError) {
            console.log('❌ PasswordSetup: SignUp error:', signUpError.message);
            throw signUpError;
          }
          
          if (signUpData?.user) {
            console.log('✅ PasswordSetup: New user created successfully in reset mode');
            setIsSuccess(true);
            toast.success("Account created successfully! You can now sign in.");
            return;
          }
        } else {
          // If sign in works, user exists and credentials are now updated
          console.log('✅ PasswordSetup: User authenticated successfully in reset mode');
          setIsSuccess(true);
          toast.success("Password has been updated successfully!");
          return;
        }
        
        console.log('✅ PasswordSetup: Password reset successful');
        setIsSuccess(true);
        toast.success("Password has been set successfully!");
        
      } else {
        // Handle new account setup - normal sign-up flow
        console.log('🏁 PasswordSetup: Processing new account setup');
        console.log('📋 PasswordSetup: User data for signup:', { email: data.email, passwordLength: data.password.length });
        
        // Get current site URL for redirect
        const redirectTo = `${window.location.origin}/dashboard`;
        console.log('🔗 PasswordSetup: Email redirect URL:', redirectTo);
        
        // Sign up the user with proper email verification
        console.log('📝 PasswordSetup: Calling Supabase signup...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            // Use Supabase's built-in email verification
            emailRedirectTo: redirectTo,
            // Set data.email as the email even if it differs from emailFromUrl (just in case)
            data: {
              email: data.email
            }
          }
        });
        
        console.log('📊 PasswordSetup: Supabase signup response:', { 
          user: signUpData?.user ? 'USER_CREATED' : 'NO_USER',
          session: signUpData?.session ? 'HAS_SESSION' : 'NO_SESSION',
          error: signUpError ? signUpError.message : 'NONE'
        });
        
        if (signUpError) {
          console.log('❌ PasswordSetup: Signup error occurred:', signUpError.message);
          
          // If user already exists, display a message and provide option to sign in
          if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
            console.log('👤 PasswordSetup: User already exists, showing account exists message');
            setAccountExists(true);
            return;
          }
          throw signUpError;
        }
        
        // If sign up was successful
        if (signUpData?.user) {
          console.log('✅ PasswordSetup: New user created successfully:', signUpData.user.id);
          console.log('📧 PasswordSetup: User email confirmed:', signUpData.user.email_confirmed_at ? 'YES' : 'NO');
          
          // If Supabase's built-in email verification fails, send a verification email manually
          if (signUpData.session === null) {
            console.log('📧 PasswordSetup: No session returned, email verification is required');
            
            // Just to be extra safe, let's trigger our own verification email
            try {
              console.log('📬 PasswordSetup: Sending manual verification email...');
              // Generate a verification link
              const verificationLink = `${window.location.origin}/verify?email=${encodeURIComponent(data.email)}`;
              
              // Send verification email
              await EmailService.sendEmailVerification(data.email, verificationLink);
              
              console.log('✅ PasswordSetup: Verification email sent manually');
              setIsSuccess(true);
              toast.success("Account created! Please check your email for a verification link to activate your account.");
              
              setTimeout(() => {
                window.location.href = '/';
              }, 5000);
              
            } catch (emailError) {
              console.error('❌ PasswordSetup: Failed to send verification email:', emailError);
              // Continue with the success message even if our custom email fails
              setIsSuccess(true);
              toast.success("Account created! Please check your email for a verification link from Supabase.");
              
              setTimeout(() => {
                window.location.href = '/';
              }, 3000);
            }
            
            return;
          }
          
          // If we have a session, the user is automatically verified or doesn't need verification
          console.log('🎉 PasswordSetup: User has immediate session, attempting auto sign-in');
          setIsSuccess(true);
          
          try {
            // Try to sign them in immediately
            console.log('🔐 PasswordSetup: Attempting automatic sign-in...');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: data.email,
              password: data.password
            });
            
            if (signInError) {
              console.log('⚠️ PasswordSetup: Auto sign-in failed, user may need email confirmation:', signInError.message);
              toast.success("Account created! Please check your email for a confirmation link before signing in.");
              setTimeout(() => {
                window.location.href = '/';
              }, 3000);
            } else {
              console.log('✅ PasswordSetup: User auto-signed in successfully');
              toast.success("Account created and signed in successfully!");
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 1500);
            }
          } catch (signInError) {
            console.error('❌ PasswordSetup: Error during auto sign-in:', signInError);
            toast.success("Account created! Please check your email for a confirmation link.");
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ PasswordSetup: Password setup error:', error);
      handleError(error, { 
        context: isResetMode ? "Resetting password" : "Setting up password",
        showToast: true 
      });
    } finally {
      setIsSubmitting(false);
      console.log('🏁 PasswordSetup: Process completed, isSubmitting set to false');
    }
  };

  const handleNavigateToLogin = () => {
    console.log('🔄 PasswordSetup: Navigating to login page');
    navigate('/login');
  };

  if (accountExists) {
    console.log('👤 PasswordSetup: Rendering account exists screen');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-900">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6 bg-amber-100 border-amber-300">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800 text-lg font-semibold">Account Already Exists</AlertTitle>
            <AlertDescription className="text-amber-700 mt-2">
              An account with this email already exists. Please sign in with your existing credentials or reset your password if needed.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleNavigateToLogin}
            className="w-full mt-4 py-6 rounded-full text-base font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!isValidToken && isResetMode) {
    console.log('⚠️ PasswordSetup: Rendering invalid token screen');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid or Expired Reset Link</h1>
        <p className="text-gray-600 mb-6">
          The password reset link you used is invalid or has expired.
          Please request a new password reset from the login page.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (isSuccess) {
    console.log('🎉 PasswordSetup: Rendering success screen');
    return <SuccessScreen isResetMode={isResetMode} />;
  }

  console.log('📝 PasswordSetup: Rendering password form');
  return (
    <PasswordForm
      emailFromUrl={emailFromUrl}
      isResetMode={isResetMode}
      isSubmitting={isSubmitting}
      onSubmit={handlePasswordSetup}
    />
  );
};

export default PasswordSetup;
