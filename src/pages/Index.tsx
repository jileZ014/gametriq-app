
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Settings, Calendar, BarChart2, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { QuickGameService, QUICK_GAME_DEFAULTS } from "@/services/QuickGameService";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isCreatingQuickGame, setIsCreatingQuickGame] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [customTeamName, setCustomTeamName] = useState(QUICK_GAME_DEFAULTS.teamName);
  const [customOpponent, setCustomOpponent] = useState(QUICK_GAME_DEFAULTS.opponent);

  const handleQuickGame = async (useDefaults = true) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a quick game",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingQuickGame(true);
    
    try {
      const teamName = useDefaults ? undefined : customTeamName;
      const opponent = useDefaults ? undefined : customOpponent;
      
      const { game } = await QuickGameService.createQuickGame(
        currentUser.id,
        teamName,
        opponent
      );
      
      toast({
        title: "Quick Game Created!",
        description: `Ready to start tracking stats for ${game.opponent}`,
      });
      
      // Navigate to game screen (assuming there's a game route)
      navigate(`/game/${game.id}`);
      
    } catch (error) {
      console.error('Error creating quick game:', error);
      toast({
        title: "Error",
        description: "Failed to create quick game. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingQuickGame(false);
      setShowCustomizeDialog(false);
    }
  };

  const handleCustomizeGame = () => {
    setCustomTeamName(QUICK_GAME_DEFAULTS.teamName);
    setCustomOpponent(QUICK_GAME_DEFAULTS.opponent);
    setShowCustomizeDialog(true);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Welcome to Gametriq</h1>
        <p className="text-lg text-muted-foreground max-w-lg text-center">
          Track basketball stats in real-time. Start a quick game or explore the full dashboard experience.
        </p>
        
        {/* Quick Game Section */}
        <div className="w-full max-w-md space-y-4">
          <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleQuickGame(true)}
                disabled={isCreatingQuickGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold"
              >
                {isCreatingQuickGame ? (
                  <>Creating Game...</>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Quick Game
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">Instant setup with:</p>
                <ul className="text-xs space-y-1">
                  <li>• Team: {QUICK_GAME_DEFAULTS.teamName}</li>
                  <li>• vs {QUICK_GAME_DEFAULTS.opponent}</li>
                  <li>• {QUICK_GAME_DEFAULTS.playerCount} players (#1-#10)</li>
                  <li>• {QUICK_GAME_DEFAULTS.gamePeriod}, {QUICK_GAME_DEFAULTS.timeRemaining}</li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleCustomizeGame}
                className="w-full border-green-500 text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-950"
              >
                <Settings className="mr-2 h-4 w-4" />
                + Customize
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Set up your team, add players, and start tracking basketball statistics in real-time.
              </p>
              <Button variant="outline" onClick={() => window.open("https://react.dev/learn", "_blank")}>
                Learn More
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Live Stat Tracking</li>
                <li>Player Performance Analytics</li>
                <li>Game History & Reports</li>
                <li>Team Management</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                For Coaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your entire team, track player development, and make data-driven decisions.
              </p>
              <Button variant="outline">
                Coach Dashboard
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                For Parents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Follow your player's progress and celebrate their achievements throughout the season.
              </p>
              <Button variant="outline">
                Parent View
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customize Game Dialog */}
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Quick Game</DialogTitle>
            <DialogDescription>
              Adjust the team and opponent names before creating your game.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={customTeamName}
                onChange={(e) => setCustomTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opponent-name">Opponent</Label>
              <Input
                id="opponent-name"
                value={customOpponent}
                onChange={(e) => setCustomOpponent(e.target.value)}
                placeholder="Enter opponent name"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowCustomizeDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleQuickGame(false)}
              disabled={isCreatingQuickGame || !customTeamName.trim() || !customOpponent.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreatingQuickGame ? 'Creating...' : 'Create Game'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
