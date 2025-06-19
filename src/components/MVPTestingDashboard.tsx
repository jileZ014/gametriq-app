
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BarChart3, Trophy, Target, TrendingUp } from 'lucide-react';
import GameSelection from './GameSelection';

const MVPTestingDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  console.log('MVPTestingDashboard render: selectedGameId =', selectedGameId);

  const handleGameSelect = (gameId: string) => {
    console.log('MVPTestingDashboard: handleGameSelect called with:', gameId);
    console.log('MVPTestingDashboard: Current selectedGameId before update:', selectedGameId);
    setSelectedGameId(gameId);
    console.log('MVPTestingDashboard: setSelectedGameId called with:', gameId);
  };

  // Add useEffect to log state changes
  useEffect(() => {
    console.log('MVPTestingDashboard: selectedGameId state changed to:', selectedGameId);
  }, [selectedGameId]);

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please log in to access the MVP Testing Dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">MVP Testing Dashboard</h1>
          <p className="text-blue-200 mt-1">Beta features and experimental functionality</p>
        </div>
        <Badge variant="outline" className="bg-purple-900/50 text-purple-300 border-purple-400">
          Beta Testing
        </Badge>
      </div>

      {/* Debug info - More prominent display */}
      <Card className="bg-yellow-900/20 border-yellow-500/30">
        <CardContent className="p-4">
          <p className="text-yellow-300 text-sm">
            <strong>DEBUG:</strong> Selected Game ID: 
            <span className="font-mono ml-2 bg-black/30 px-2 py-1 rounded">
              {selectedGameId || 'NONE'}
            </span>
          </p>
          <p className="text-yellow-300 text-xs mt-1">
            State type: {typeof selectedGameId} | Is null: {selectedGameId === null ? 'true' : 'false'}
          </p>
        </CardContent>
      </Card>

      {/* Game Selection Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Game Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GameSelection 
            selectedGameId={selectedGameId}
            onGameSelect={handleGameSelect}
          />
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Manage your roster, track player development, and organize team data.
            </p>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Live Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Real-time stat tracking during games with instant analytics.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!selectedGameId}
              className={selectedGameId ? "border-green-500 text-green-400 hover:bg-green-900/20" : ""}
            >
              {selectedGameId ? "Start Tracking" : "Select Game First"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Advanced player metrics and team performance insights.
            </p>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Set and monitor individual and team improvement goals.
            </p>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Generate detailed reports for players, parents, and coaches.
            </p>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Game History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Review past games and track season-long performance trends.
            </p>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MVPTestingDashboard;
