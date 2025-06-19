
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingProps {
  role: "Coach" | "Parent";
}

const Onboarding = ({ role }: OnboardingProps) => {
  const handleGetStarted = () => {
    // Simple navigation or close onboarding
    window.location.href = '/';
  };
  
  return (
    <Card className="w-full max-w-md mx-auto modern-card shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-t-xl border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to Gametriq!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6 bg-white dark:bg-slate-800">
        {role === "Coach" ? (
          <>
            <p className="text-lg text-gray-700 dark:text-gray-300">Here's how to get started as a coach:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Add players to your roster</li>
              <li>Track stats during games</li>
              <li>Share updates with parents</li>
              <li>Review performance over time</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Ready to build your team?</p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 dark:text-gray-300">Here's how to get started as a parent:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>View your athlete's game stats</li>
              <li>Track progress over time</li>
              <li>Get updates from coaches</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Ready to follow your athlete's journey?</p>
          </>
        )}
        
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg btn-glow"
          >
            Get Started
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Onboarding;
