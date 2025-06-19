import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from "react-swipeable";
import { StatType } from "@/types";
import { Target, Award, X, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useMilestoneTracker } from "@/hooks/useMilestoneTracker";
import JerseyBadge from "./JerseyBadge";

interface LiveGameModeProps {
  player: {
    id: string;
    name: string;
    playerNumber?: string;
  };
  onRecordStat: (playerId: string, statType: StatType, value: number) => void;
  onUndo: (playerId: string) => void;
  totalPoints: number;
  isLoading: boolean;
  // Add these props to get current game stats for milestone checking
  currentStats?: {
    points: number;
    assists: number;
    steals: number;
    blocks: number;
    rebounds: number;
    fouls: number;
  };
}

const LiveGameMode: React.FC<LiveGameModeProps> = ({
  player,
  onRecordStat,
  onUndo,
  totalPoints,
  isLoading,
  currentStats = { points: 0, assists: 0, steals: 0, blocks: 0, rebounds: 0, fouls: 0 }
}) => {
  const [activeTab, setActiveTab] = React.useState<'offense' | 'defense'>('offense');
  const [animatingButton, setAnimatingButton] = React.useState<string | null>(null);
  
  // Initialize milestone tracker
  const { checkMilestones } = useMilestoneTracker(player.id, player.name);
  
  // Swipe handlers for mobile - removed preventDefaultTouchmoveEvent
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActiveTab('defense'),
    onSwipedRight: () => setActiveTab('offense'),
    trackMouse: true
  });
  
  // Haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.vibrate([20]);
    }
  };
  
  // Show toast confirmation for stat
  const showStatConfirmation = (statType: string, points?: number) => {
    let message = `${statType.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim()}`;
    
    if (points && points > 0) {
      message = `+${points} Points`;
    }
    
    message += ` for ${player.name}`;
    
    toast({
      title: message,
      duration: 2000,
      className: "bg-green-600 text-white border-green-700"
    });
  };
  
  // Offensive stat buttons
  const offensiveButtons = [
    { type: 'FG_Made', label: '2PT', color: 'bg-green-600', icon: <Target className="h-4 w-4" />, points: 2 },
    { type: 'ThreePT_Made', label: '3PT', color: 'bg-blue-600', icon: <Target className="h-4 w-4" />, points: 3 },
    { type: 'FT_Made', label: 'FREE', color: 'bg-purple-600', icon: <Target className="h-4 w-4" />, points: 1 },
    { type: 'FG_Missed', label: 'MISS 2', color: 'bg-red-600', icon: <X className="h-4 w-4" />, points: 0 },
    { type: 'ThreePT_Missed', label: 'MISS 3', color: 'bg-red-700', icon: <X className="h-4 w-4" />, points: 0 },
    { type: 'FT_Missed', label: 'MISS FT', color: 'bg-red-500', icon: <X className="h-4 w-4" />, points: 0 }
  ];
  
  // Defensive stat buttons
  const defensiveButtons = [
    { type: 'Rebounds', label: 'REB', color: 'bg-amber-600', icon: <Award className="h-4 w-4" />, points: 0 },
    { type: 'Assists', label: 'AST', color: 'bg-cyan-600', icon: <Award className="h-4 w-4" />, points: 0 },
    { type: 'Steals', label: 'STL', color: 'bg-teal-600', icon: <Award className="h-4 w-4" />, points: 0 },
    { type: 'Blocks', label: 'BLK', color: 'bg-indigo-600', icon: <Clock className="h-4 w-4" />, points: 0 },
    { type: 'Fouls', label: 'FOUL', color: 'bg-yellow-600', icon: <X className="h-4 w-4" />, points: 0 }
  ];
  
  const handleStatClick = (statType: string, points?: number) => {
    // Trigger haptic feedback
    triggerHapticFeedback();
    
    // Animate button
    setAnimatingButton(statType);
    setTimeout(() => setAnimatingButton(null), 200);
    
    // Record the stat
    const value = statType.includes('Missed') ? 0 : 1;
    onRecordStat(player.id, statType as StatType, value);
    
    // Show confirmation toast
    showStatConfirmation(statType, points);
    
    // Check for milestones after recording the stat
    const isScoring = ['FG_Made', 'ThreePT_Made', 'FT_Made'].includes(statType);
    
    // Calculate updated stats for milestone checking
    const updatedStats = {
      points: isScoring ? currentStats.points + (points || 0) : currentStats.points,
      assists: statType === 'Assists' ? currentStats.assists + 1 : currentStats.assists,
      steals: statType === 'Steals' ? currentStats.steals + 1 : currentStats.steals,
      blocks: statType === 'Blocks' ? currentStats.blocks + 1 : currentStats.blocks,
      isScoring: isScoring
    };
    
    checkMilestones(updatedStats);
  };
  
  const handleUndo = () => {
    triggerHapticFeedback();
    setAnimatingButton('undo');
    setTimeout(() => setAnimatingButton(null), 200);
    onUndo(player.id);
    
    toast({
      title: `Undo last stat for ${player.name}`,
      duration: 2000,
      className: "bg-gray-600 text-white border-gray-700"
    });
  };
  
  const activeButtons = activeTab === 'offense' ? offensiveButtons : defensiveButtons;
  
  return (
    <div className="courtside-mode rounded-lg overflow-hidden shadow-lg" {...swipeHandlers}>
      {/* Player header with points */}
      <div className="flex justify-between items-center bg-gray-800 p-3 rounded-t-lg">
        <div className="flex-1">
          <JerseyBadge 
            playerNumber={player.playerNumber} 
            playerName={player.name}
            variant="outline"
            size="lg"
          />
        </div>
        <Badge className="text-xl py-1.5 px-4 bg-blue-600">
          {totalPoints} PTS
        </Badge>
      </div>
      
      {/* Tab selector */}
      <div className="grid grid-cols-2 bg-gray-700">
        <button 
          className={`py-3 text-center font-medium text-lg transition-colors ${
            activeTab === 'offense' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setActiveTab('offense')}
        >
          OFFENSE
        </button>
        <button 
          className={`py-3 text-center font-medium text-lg transition-colors ${
            activeTab === 'defense' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setActiveTab('defense')}
        >
          DEFENSE
        </button>
      </div>
      
      {/* Stat buttons */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-gray-800">
        {activeButtons.map((button) => (
          <Button
            key={button.type}
            onClick={() => handleStatClick(button.type, button.points)}
            disabled={isLoading}
            className={`${button.color} h-16 md:h-20 text-white text-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 ${
              animatingButton === button.type 
                ? 'scale-110 shadow-lg animate-pulse' 
                : ''
            }`}
          >
            {button.icon}
            {button.label}
          </Button>
        ))}
        
        {/* Undo button */}
        <Button
          onClick={handleUndo}
          disabled={isLoading}
          className={`col-span-2 bg-gray-600 text-white text-lg h-12 md:h-16 mt-2 transition-all duration-200 hover:scale-105 ${
            animatingButton === 'undo' 
              ? 'scale-110 shadow-lg animate-pulse' 
              : ''
          }`}
        >
          UNDO LAST STAT
        </Button>
      </div>
      
      {/* Swipe indicator */}
      <div className="text-center text-sm text-gray-400 bg-gray-800 pb-2 rounded-b-lg">
        Swipe to switch between offense and defense
      </div>
    </div>
  );
};

export default LiveGameMode;
