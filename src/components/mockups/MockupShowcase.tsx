
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OnboardingTour from './OnboardingTour';
import EnhancedLiveMode from './EnhancedLiveMode';
import ParentEngagementMockup from './ParentEngagementMockup';
import CoachInsightsMockup from './CoachInsightsMockup';
import { Eye, Smartphone, Users, TrendingUp } from 'lucide-react';

const MockupShowcase: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOutdoorMode, setIsOutdoorMode] = useState(false);

  console.log('MockupShowcase component rendered');

  const mockPlayer = {
    id: '1',
    name: 'Sarah Johnson',
    playerNumber: '23'
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Gametriq UI/UX Mockups
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Enhanced user interface designs focusing on sideline usability, parent engagement, 
            and AI-powered coaching insights for youth basketball teams.
          </p>
        </div>

        {/* Mockup Showcase */}
        <Tabs defaultValue="onboarding" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="onboarding" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Onboarding</span>
            </TabsTrigger>
            <TabsTrigger value="live-mode" className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Live Mode</span>
            </TabsTrigger>
            <TabsTrigger value="parent-view" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Parent View</span>
            </TabsTrigger>
            <TabsTrigger value="coach-insights" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Coach AI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding" className="mt-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="h-6 w-6 mr-2 text-blue-400" />
                  Interactive Onboarding Tour
                </CardTitle>
                <p className="text-gray-400">
                  First-time user experience with guided tour showcasing key features
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Key Features:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Progressive disclosure of features</li>
                      <li>• Visual mockups with interactive elements</li>
                      <li>• Step-by-step guidance for core functionality</li>
                      <li>• Skip option for experienced users</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => setShowOnboarding(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Launch Onboarding Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {showOnboarding && <OnboardingTour />}
          </TabsContent>

          <TabsContent value="live-mode" className="mt-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Smartphone className="h-6 w-6 mr-2 text-green-400" />
                  Enhanced Live Game Mode
                </CardTitle>
                <p className="text-gray-400">
                  Optimized for sideline use with outdoor mode and quick stat entry
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Enhancements:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Outdoor/Indoor mode toggle for visibility</li>
                      <li>• Quick stats mode for common actions</li>
                      <li>• Visual celebrations for achievements</li>
                      <li>• Voice mode integration</li>
                      <li>• Haptic feedback indicators</li>
                    </ul>
                  </div>
                  <EnhancedLiveMode 
                    player={mockPlayer}
                    isOutdoorMode={isOutdoorMode}
                    onToggleOutdoorMode={() => setIsOutdoorMode(!isOutdoorMode)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parent-view" className="mt-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-6 w-6 mr-2 text-purple-400" />
                  Parent Engagement Dashboard
                </CardTitle>
                <p className="text-gray-400">
                  Rich player development tracking and milestone celebrations for parents
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Parent Features:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Player milestone tracking and celebrations</li>
                      <li>• Shareable highlights and achievements</li>
                      <li>• Development progress visualization</li>
                      <li>• Coach notes and feedback</li>
                      <li>• Photo sharing and memory creation</li>
                    </ul>
                  </div>
                  <ParentEngagementMockup />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach-insights" className="mt-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-amber-400" />
                  AI-Powered Coach Insights
                </CardTitle>
                <p className="text-gray-400">
                  Real-time game analysis and strategic recommendations
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">AI Features:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Real-time playing time balance monitoring</li>
                      <li>• Performance-based strategic suggestions</li>
                      <li>• Hot hand detection and recommendations</li>
                      <li>• Defensive adjustment alerts</li>
                      <li>• Player rotation optimization</li>
                    </ul>
                  </div>
                  <CoachInsightsMockup />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Implementation Notes */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Implementation Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
                <h4 className="text-green-400 font-semibold mb-2">Immediate (1-2 weeks)</h4>
                <ul className="text-green-300 space-y-1 text-sm">
                  <li>• Onboarding tour implementation</li>
                  <li>• Outdoor mode toggle</li>
                  <li>• Quick stats interface</li>
                  <li>• Basic milestone tracking</li>
                </ul>
              </div>
              <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700">
                <h4 className="text-yellow-400 font-semibold mb-2">Short-term (1 month)</h4>
                <ul className="text-yellow-300 space-y-1 text-sm">
                  <li>• Parent engagement features</li>
                  <li>• Development tracking</li>
                  <li>• Basic AI insights</li>
                  <li>• Voice mode integration</li>
                </ul>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                <h4 className="text-blue-400 font-semibold mb-2">Long-term (2-3 months)</h4>
                <ul className="text-blue-300 space-y-1 text-sm">
                  <li>• Advanced AI coaching</li>
                  <li>• Social sharing features</li>
                  <li>• Season analytics</li>
                  <li>• League integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MockupShowcase;
