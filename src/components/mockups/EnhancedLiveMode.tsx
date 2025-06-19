
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Award, X, Zap, Sun, Volume2, RotateCcw } from 'lucide-react';

interface EnhancedLiveModeProps {
  player: {
    id: string;
    name: string;
    playerNumber?: string;
  };
  isOutdoorMode?: boolean;
  onToggleOutdoorMode?: () => void;
}

const EnhancedLiveMode: React.FC<EnhancedLiveModeProps> = ({ 
  player, 
  isOutdoorMode = false,
  onToggleOutdoorMode 
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>('quick');
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [recentStats, setRecentStats] = useState<string[]>([]);

  // Quick stat buttons (most common actions)
  const quickButtons = [
    { type: 'made_shot', label: 'MADE SHOT', color: 'bg-green-600', icon: <Target className="h-6 w-6" />, points: '+2' },
    { type: 'three_made', label: '3-POINTER', color: 'bg-blue-600', icon: <Target className="h-6 w-6" />, points: '+3' },
    { type: 'rebound', label: 'REBOUND', color: 'bg-amber-600', icon: <Award className="h-6 w-6" />, points: '' },
    { type: 'assist', label: 'ASSIST', color: 'bg-purple-600', icon: <Award className="h-6 w-6" />, points: '' }
  ];

  // Advanced stat buttons
  const advancedButtons = [
    { type: 'FT_Made', label: 'FREE THROW', color: 'bg-indigo-600', icon: <Target className="h-5 w-5" /> },
    { type: 'FG_Missed', label: 'MISSED SHOT', color: 'bg-red-600', icon: <X className="h-5 w-5" /> },
    { type: 'Steals', label: 'STEAL', color: 'bg-cyan-600', icon: <Award className="h-5 w-5" /> },
    { type: 'Blocks', label: 'BLOCK', color: 'bg-teal-600', icon: <Award className="h-5 w-5" /> },
    { type: 'Fouls', label: 'FOUL', color: 'bg-yellow-600', icon: <X className="h-5 w-5" /> },
    { type: 'Turnover', label: 'TURNOVER', color: 'bg-orange-600', icon: <X className="h-5 w-5" /> }
  ];

  const handleQuickStat = (statType: string, points?: string) => {
    setRecentStats([statType, ...recentStats.slice(0, 2)]);
    
    // Show celebration for significant stats
    if (['made_shot', 'three_made'].includes(statType)) {
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 2000);
    }
  };

  const activeButtons = activeTab === 'quick' ? quickButtons : advancedButtons;
  const containerClass = isOutdoorMode 
    ? "bg-white text-black border-4 border-black" 
    : "bg-gray-800 text-white";

  return (
    <div className="space-y-4">
      {/* Outdoor Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Live Game Mode</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleOutdoorMode}
            className={`${isOutdoorMode ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}
          >
            <Sun className="h-4 w-4 mr-1" />
            {isOutdoorMode ? 'Outdoor' : 'Indoor'}
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-700 text-gray-300">
            <Volume2 className="h-4 w-4 mr-1" />
            Voice
          </Button>
        </div>
      </div>

      <Card className={`${containerClass} overflow-hidden relative`}>
        {/* Celebration Animation */}
        {celebrationVisible && (
          <div className="absolute inset-0 bg-green-500/20 animate-pulse z-10 flex items-center justify-center">
            <div className="text-6xl">🎉</div>
          </div>
        )}

        <CardContent className="p-0">
          {/* Player Header */}
          <div className={`p-4 ${isOutdoorMode ? 'bg-black text-white' : 'bg-gray-700'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">
                  {player.name} {player.playerNumber && <span>#{player.playerNumber}</span>}
                </h3>
                <div className="flex space-x-2 mt-1">
                  {recentStats.slice(0, 3).map((stat, index) => (
                    <Badge key={index} variant="outline" className="text-xs opacity-70">
                      {stat.replace('_', ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <Badge className={`text-2xl py-2 px-4 ${isOutdoorMode ? 'bg-black text-white' : 'bg-blue-600'}`}>
                  15 PTS
                </Badge>
                <p className="text-sm opacity-70 mt-1">🔥 Hot streak!</p>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2">
            <button 
              className={`py-4 text-center font-bold text-lg transition-colors ${
                activeTab === 'quick' 
                  ? (isOutdoorMode ? 'bg-black text-white' : 'bg-blue-600 text-white')
                  : (isOutdoorMode ? 'bg-gray-200 text-black' : 'bg-gray-600 text-gray-300')
              }`}
              onClick={() => setActiveTab('quick')}
            >
              <Zap className="h-5 w-5 inline mr-2" />
              QUICK STATS
            </button>
            <button 
              className={`py-4 text-center font-bold text-lg transition-colors ${
                activeTab === 'advanced' 
                  ? (isOutdoorMode ? 'bg-black text-white' : 'bg-blue-600 text-white')
                  : (isOutdoorMode ? 'bg-gray-200 text-black' : 'bg-gray-600 text-gray-300')
              }`}
              onClick={() => setActiveTab('advanced')}
            >
              ALL STATS
            </button>
          </div>

          {/* Stat Buttons */}
          <div className="p-4">
            {activeTab === 'quick' ? (
              <div className="grid grid-cols-2 gap-4">
                {quickButtons.map((button) => (
                  <Button
                    key={button.type}
                    onClick={() => handleQuickStat(button.type, button.points)}
                    className={`${button.color} h-20 text-white text-lg font-bold flex flex-col items-center justify-center gap-2 relative`}
                  >
                    {button.icon}
                    <span>{button.label}</span>
                    {button.points && (
                      <Badge className="absolute top-1 right-1 bg-white/20 text-xs">
                        {button.points}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {advancedButtons.map((button) => (
                  <Button
                    key={button.type}
                    onClick={() => handleQuickStat(button.type)}
                    className={`${button.color} h-16 text-white text-sm font-bold flex items-center justify-center gap-2`}
                  >
                    {button.icon}
                    {button.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                variant="outline"
                className={`h-12 ${isOutdoorMode ? 'border-black text-black hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                UNDO
              </Button>
              <Button
                variant="outline"
                className={`h-12 ${isOutdoorMode ? 'border-black text-black hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                VOICE MODE
              </Button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className={`p-3 text-center text-sm ${isOutdoorMode ? 'bg-gray-100 text-gray-600' : 'bg-gray-700 text-gray-400'}`}>
            💡 Tip: Long press any button for advanced options • Shake to undo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedLiveMode;
