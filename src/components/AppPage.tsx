
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, Trophy, Target, Users, CheckCircle, Bug, Calendar, BarChart3, Download } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import GametriqLogo from './GametriqLogo';

import { Link } from 'react-router-dom';

const AppPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock player data - TODO: Replace with real data from API
  const playerData = {
    name: "Jordan Angeles",
    team: "Eagles Basketball",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
    upcomingGame: {
      opponent: "Thunder Hawks",
      date: "Dec 18, 2024",
      time: "7:00 PM"
    },
    recentStats: {
      lastGame: "vs Lightning Bolts",
      points: 18,
      rebounds: 7,
      assists: 5
    },
    seasonAverages: {
      points: 14.3,
      rebounds: 6.1,
      assists: 4.7
    }
  };

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem('gametriq_token');
    
    if (!storedToken) {
      // Redirect to error if no token found
      window.location.href = '/error?msg=unauthorized';
      return;
    }
    
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('gametriq_token');
    window.location.href = '/';
  };

  const handleSwitchPlayer = () => {
    localStorage.removeItem('gametriq_token');
    window.location.href = '/login';
  };

  // Show loading screen while checking for token
  if (isLoading || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-md text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-300">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <GametriqLogo size="md" animated={true} />
            <div className="flex items-center gap-3">
              <Link to="/support">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-orange-500 text-orange-400 hover:bg-orange-950"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Bug
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSwitchPlayer}
                className="border-blue-500 text-blue-400 hover:bg-blue-950"
              >
                Switch Player
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-red-500 text-red-400 hover:bg-red-950"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Banner */}
        <Alert className="mb-8 bg-green-900/20 border-green-500/30 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-300">
            ✔️ Welcome back! You are now logged in.
          </AlertDescription>
        </Alert>


        {/* Player Profile Card */}
        <Card className="bg-gray-900/80 backdrop-blur-md border-gray-700 shadow-2xl mb-8">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-blue-500">
                <AvatarImage src={playerData.avatar} alt={playerData.name} />
                <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                  {playerData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {playerData.name}
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-600 text-white mb-2">
                  {playerData.team}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 pb-8">
            {/* Upcoming Game */}
            <Card className="bg-purple-900/20 border-purple-500/30 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">Next Game</h4>
                      <p className="text-sm text-purple-300">vs {playerData.upcomingGame.opponent}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{playerData.upcomingGame.date}</p>
                    <p className="text-xs text-purple-300">{playerData.upcomingGame.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Game Performance */}
            <Card className="bg-gray-800/60 border-gray-600 mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-yellow-400" />
                  Last Game: {playerData.recentStats.lastGame}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{playerData.recentStats.points}</div>
                    <div className="text-xs text-gray-400">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{playerData.recentStats.rebounds}</div>
                    <div className="text-xs text-gray-400">Rebounds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{playerData.recentStats.assists}</div>
                    <div className="text-xs text-gray-400">Assists</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Season Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Points per Game */}
              <Card className="bg-gray-800/60 backdrop-blur-md border-gray-600 hover:border-yellow-500 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">Points per Game</CardTitle>
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{playerData.seasonAverages.points}</div>
                  <p className="text-xs text-gray-400">Season Average</p>
                </CardContent>
              </Card>

              {/* Rebounds per Game */}
              <Card className="bg-gray-800/60 backdrop-blur-md border-gray-600 hover:border-green-500 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">Rebounds per Game</CardTitle>
                    <Target className="h-5 w-5 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{playerData.seasonAverages.rebounds}</div>
                  <p className="text-xs text-gray-400">Season Average</p>
                </CardContent>
              </Card>

              {/* Assists per Game */}
              <Card className="bg-gray-800/60 backdrop-blur-md border-gray-600 hover:border-purple-500 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">Assists per Game</CardTitle>
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">{playerData.seasonAverages.assists}</div>
                  <p className="text-xs text-gray-400">Season Average</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  Keep up the great work! Your stats are looking fantastic this season.
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: Today
                </p>
                {/* Hidden developer notes for future features */}
                {/* TODO: Add stat editing capability */}
                {/* TODO: Add player highlight reel */}
                {/* TODO: Add comparison with team average */}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AppPage;
