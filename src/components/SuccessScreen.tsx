
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GametriqLogo from './GametriqLogo';
import AuthBackground from './AuthBackground';
import { CheckCircle2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessScreenProps {
  isResetMode?: boolean;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ isResetMode = false }) => {
  const navigate = useNavigate();
  
  const handleReturn = () => {
    navigate('/');
  };
  
  return (
    <>
      <AuthBackground />
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <GametriqLogo size="lg" />
          </div>
          
          <Card className="border shadow-xl bg-gray-900/80 backdrop-blur-md text-white rounded-2xl">
            <div className="flex justify-center mt-8">
              <div className="bg-green-500/20 p-5 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>
            
            <CardHeader className="pb-2 space-y-2 text-center">
              <CardTitle className="text-2xl text-green-400 font-bold">
                {isResetMode ? "Password Reset Complete" : "Account Setup Complete"}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pb-8 px-8">
              <div className="space-y-6">
                {!isResetMode && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-blue-300">Important Next Step</span>
                    </div>
                    <p className="text-sm text-blue-200">
                      Check your email for a verification link. You must click this link before you can sign in to Gametriq.
                    </p>
                  </div>
                )}
                
                <p className="text-center text-gray-300">
                  {isResetMode 
                    ? "Your password has been successfully updated. You can now log in with your new password."
                    : "Your account has been created successfully! Please verify your email before signing in."}
                </p>
                
                <Button 
                  className="w-full mt-4 py-6 rounded-full text-base font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                  onClick={handleReturn}
                >
                  {isResetMode ? "Sign In Now" : "Go to Login Page"}
                </Button>
                
                {!isResetMode && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      After verifying your email, return to this page to sign in
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SuccessScreen;
