
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Target, Users, BarChart, X } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  mockupContent: React.ReactNode;
}

const OnboardingTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Gametriq!",
      description: "The simplest way to track basketball stats on the sidelines. Built for coaches and parents who want to focus on the game, not the technology.",
      icon: <Target className="h-8 w-8 text-blue-400" />,
      mockupContent: (
        <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg text-center">
          <Target className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Gametriq</h2>
          <p className="text-blue-200">Sideline stat tracking made simple</p>
        </div>
      )
    },
    {
      id: 2,
      title: "One-Tap Stat Recording",
      description: "Record any stat with a single tap. Large buttons designed for quick sideline use, even with gloves or in bright sunlight.",
      icon: <Target className="h-8 w-8 text-green-400" />,
      mockupContent: (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button className="bg-green-600 h-16 text-xl font-bold">
              <Target className="h-6 w-6 mr-2" />
              2PT
            </Button>
            <Button className="bg-blue-600 h-16 text-xl font-bold">
              <Target className="h-6 w-6 mr-2" />
              3PT
            </Button>
          </div>
          <div className="text-center">
            <Badge className="bg-blue-600 text-xl py-2 px-4">12 PTS</Badge>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Smart Player Management",
      description: "Add players with photos, track their development, and celebrate milestones automatically.",
      icon: <Users className="h-8 w-8 text-purple-400" />,
      mockupContent: (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Sarah Johnson #23</p>
              <p className="text-gray-400 text-sm">12 PTS • 5 REB • 3 AST</p>
            </div>
          </div>
          <div className="bg-yellow-600 p-2 rounded text-center">
            <p className="text-yellow-100 text-sm">🎉 First double-double!</p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Real-Time Insights",
      description: "Get instant game summaries, player highlights, and coaching suggestions as the game unfolds.",
      icon: <BarChart className="h-8 w-8 text-amber-400" />,
      mockupContent: (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-blue-900/50 p-3 rounded text-center">
              <p className="text-blue-400 text-sm">Team</p>
              <p className="text-white text-xl font-bold">42</p>
            </div>
            <div className="bg-green-900/50 p-3 rounded text-center">
              <p className="text-green-400 text-sm">FG%</p>
              <p className="text-white text-xl font-bold">67%</p>
            </div>
            <div className="bg-purple-900/50 p-3 rounded text-center">
              <p className="text-purple-400 text-sm">REB</p>
              <p className="text-white text-xl font-bold">18</p>
            </div>
          </div>
          <div className="bg-amber-600 p-2 rounded">
            <p className="text-amber-100 text-sm">💡 Sarah is hot! Keep feeding her the ball</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              {currentStepData.icon}
              <div>
                <Badge variant="outline" className="text-xs mb-2">
                  {currentStep + 1} of {steps.length}
                </Badge>
                <h3 className="text-xl font-bold text-white">{currentStepData.title}</h3>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mockup Content */}
          <div className="mb-6">
            {currentStepData.mockupContent}
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <Button variant="ghost" onClick={skipTour} className="text-gray-400">
              Skip Tour
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={skipTour} className="bg-green-600 hover:bg-green-700">
                Get Started!
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTour;
