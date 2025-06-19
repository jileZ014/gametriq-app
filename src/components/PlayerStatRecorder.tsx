
import React from "react";
import { Button } from "@/components/ui/button";
import { Award, Target, Shield, Minus, X, RotateCcw } from "lucide-react";
import StatButtonTooltip from "./StatButtonTooltip";
import { toast } from "@/components/ui/use-toast";

interface PlayerStatRecorderProps {
  onRecordStat: (statType: string, value: number) => void;
  isLoading: boolean;
  isCoach: boolean;
  isLiveMode?: boolean;
  playerName?: string;
}

const PlayerStatRecorder: React.FC<PlayerStatRecorderProps> = ({
  onRecordStat,
  isLoading,
  isCoach,
  isLiveMode = false,
  playerName = "Player"
}) => {
  const [animatingButton, setAnimatingButton] = React.useState<string | null>(null);

  // Allow both coaches and parents to record stats in manual games
  if (!isCoach) {
    // Check if we're in a manual game context by looking at the current URL or game context
    const isManualGame = window.location.pathname.includes('manual') || 
                        document.querySelector('[data-game-type="manual"]') !== null;
    
    if (!isManualGame) {
      // Parents don't have access to record stats in regular games
      return null;
    }
  }

  // Haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.vibrate([20]);
    }
  };

  const showStatConfirmation = (statType: string, value: number) => {
    let message = statType.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim();
    
    // Add points for scoring stats
    if (statType === 'FG_Made' && value === 1) message = '+2 Points';
    else if (statType === 'ThreePT_Made' && value === 1) message = '+3 Points';
    else if (statType === 'FT_Made' && value === 1) message = '+1 Point';
    else if (statType.includes('Missed')) message = `Missed ${message.replace('Missed', '').trim()}`;
    
    message += ` for ${playerName}`;
    
    const isPositive = value === 1 && !statType.includes('Missed') && statType !== 'Fouls';
    
    toast({
      title: message,
      duration: 2000,
      className: isPositive 
        ? "bg-green-600 text-white border-green-700" 
        : "bg-gray-600 text-white border-gray-700"
    });
  };

  const handleMadeClick = (statType: string) => {
    triggerHapticFeedback();
    setAnimatingButton(statType);
    setTimeout(() => setAnimatingButton(null), 200);
    onRecordStat(statType, 1);
    showStatConfirmation(statType, 1);
  };
  
  const handleMissedClick = (statType: string) => {
    triggerHapticFeedback();
    setAnimatingButton(statType);
    setTimeout(() => setAnimatingButton(null), 200);
    onRecordStat(statType, 0);
    showStatConfirmation(statType, 0);
  };

  // Standard stat buttons for normal mode
  const standardStatButtons = [
    {
      type: "FG_Made",
      label: "FG Made",
      icon: <Target className="h-5 w-5" />,
      className: "bg-green-600 hover:bg-green-700"
    },
    {
      type: "FG_Missed",
      label: "FG Missed",
      icon: <X className="h-5 w-5" />,
      className: "bg-red-600 hover:bg-red-700"
    },
    {
      type: "ThreePT_Made",
      label: "3PT Made",
      icon: <Target className="h-5 w-5" />,
      className: "bg-green-600 hover:bg-green-700"
    },
    {
      type: "ThreePT_Missed",
      label: "3PT Missed",
      icon: <X className="h-5 w-5" />,
      className: "bg-red-600 hover:bg-red-700"
    },
    {
      type: "FT_Made",
      label: "FT Made",
      icon: <Target className="h-5 w-5" />,
      className: "bg-green-600 hover:bg-green-700"
    },
    {
      type: "FT_Missed",
      label: "FT Missed",
      icon: <X className="h-5 w-5" />,
      className: "bg-red-600 hover:bg-red-700"
    },
    {
      type: "Rebounds",
      label: "Rebound",
      icon: <Shield className="h-5 w-5" />,
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      type: "Assists",
      label: "Assist",
      icon: <Award className="h-5 w-5" />,
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      type: "Steals",
      label: "Steal",
      icon: <Shield className="h-5 w-5" />,
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      type: "Blocks",
      label: "Block",
      icon: <Minus className="h-5 w-5" />,
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      type: "Fouls",
      label: "Foul",
      icon: <X className="h-5 w-5" />,
      className: "bg-yellow-600 hover:bg-yellow-700"
    },
  ];
  
  const liveStatButtons = [
    {
      type: "FG_Made",
      label: "2PT",
      icon: <Target className="h-6 w-6" />,
      className: "bg-green-600 hover:bg-green-700 text-white py-6 text-xl font-bold"
    },
    {
      type: "ThreePT_Made",
      label: "3PT",
      icon: <Target className="h-6 w-6" />,
      className: "bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-xl font-bold" 
    },
    {
      type: "FT_Made",
      label: "FREE",
      icon: <Target className="h-6 w-6" />,
      className: "bg-cyan-600 hover:bg-cyan-700 text-white py-6 text-xl font-bold"
    },
    {
      type: "Rebounds",
      label: "REB",
      icon: <Shield className="h-6 w-6" />,
      className: "bg-amber-600 hover:bg-amber-700 text-white py-6 text-xl font-bold"
    },
    {
      type: "Assists",
      label: "AST",
      icon: <Award className="h-6 w-6" />,
      className: "bg-purple-600 hover:bg-purple-700 text-white py-6 text-xl font-bold"
    },
    {
      type: "Steals",
      label: "STEAL",
      icon: <Shield className="h-6 w-6" />,
      className: "bg-blue-600 hover:bg-blue-700 text-white py-6 text-xl font-bold"
    },
    {
      type: "Blocks",
      label: "BLOCK",
      icon: <Minus className="h-6 w-6" />,
      className: "bg-teal-600 hover:bg-teal-700 text-white py-6 text-xl font-bold"
    },
    {
      type: "FG_Missed",
      label: "MISS",
      icon: <X className="h-6 w-6" />,
      className: "bg-red-600 hover:bg-red-700 text-white py-6 text-xl font-bold"
    }
  ];

  const buttonsToDisplay = isLiveMode ? liveStatButtons : standardStatButtons;
  const gridCols = isLiveMode ? "grid-cols-2 gap-3" : "grid-cols-3 gap-2";
  
  return (
    <div className={`bg-gray-700 p-3 rounded-lg ${isLiveMode ? 'p-4' : ''}`}>
      <div className="mb-2 text-sm font-medium text-gray-300">
        {isLiveMode ? "Live Game Recording:" : "Record Stats:"}
      </div>
      <div className={`grid ${gridCols}`}>
        {buttonsToDisplay.map((button) => (
          <StatButtonTooltip key={button.type} content={button.label}>
            <Button
              onClick={() => {
                if (button.type.includes("Missed")) {
                  handleMissedClick(button.type);
                } else {
                  handleMadeClick(button.type);
                }
              }}
              className={`${button.className} w-full text-white flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                animatingButton === button.type 
                  ? 'scale-110 shadow-lg animate-pulse' 
                  : ''
              }`}
              disabled={isLoading}
              size={isLiveMode ? "lg" : "sm"}
              variant="ghost"
            >
              {button.icon}
              <span className={`ml-1 font-medium ${isLiveMode ? 'text-lg' : ''}`}>
                {button.label}
              </span>
            </Button>
          </StatButtonTooltip>
        ))}
      </div>
    </div>
  );
};

export default PlayerStatRecorder;
