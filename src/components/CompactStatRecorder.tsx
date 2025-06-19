import React from "react";
import { Button } from "@/components/ui/button";
import { Target, Award, Shield, Minus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CompactStatRecorderProps {
  onRecordStat: (statType: string, value: number) => void;
  isLoading: boolean;
  isCoach: boolean;
  playerName?: string;
}

const CompactStatRecorder: React.FC<CompactStatRecorderProps> = ({
  onRecordStat,
  isLoading,
  isCoach,
  playerName = "Player"
}) => {
  const [animatingButton, setAnimatingButton] = React.useState<string | null>(null);

  if (!isCoach) {
    return null;
  }

  // Haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.vibrate([20]);
    }
  };

  // Show toast confirmation for stat
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

  const handleStatClick = (statType: string, value: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling to parent click handlers
    triggerHapticFeedback();
    setAnimatingButton(statType);
    setTimeout(() => setAnimatingButton(null), 200);
    onRecordStat(statType, value);
    showStatConfirmation(statType, value);
  };

  // Restore original larger stat buttons with smaller fonts
  const statButtons = [
    {
      type: "FG_Made",
      label: "FG Made",
      icon: <Target className="h-4 w-4" />,
      className: "bg-green-600 hover:bg-green-700",
      value: 1
    },
    {
      type: "FG_Missed",
      label: "FG Missed",
      icon: <X className="h-4 w-4" />,
      className: "bg-red-600 hover:bg-red-700",
      value: 0
    },
    {
      type: "ThreePT_Made",
      label: "3PT Made",
      icon: <Target className="h-4 w-4" />,
      className: "bg-green-600 hover:bg-green-700",
      value: 1
    },
    {
      type: "ThreePT_Missed",
      label: "3PT Missed",
      icon: <X className="h-4 w-4" />,
      className: "bg-red-600 hover:bg-red-700",
      value: 0
    },
    {
      type: "FT_Made",
      label: "FT Made",
      icon: <Target className="h-4 w-4" />,
      className: "bg-green-600 hover:bg-green-700",
      value: 1
    },
    {
      type: "FT_Missed",
      label: "FT Missed",
      icon: <X className="h-4 w-4" />,
      className: "bg-red-600 hover:bg-red-700",
      value: 0
    },
    {
      type: "Rebounds",
      label: "Rebound",
      icon: <Shield className="h-4 w-4" />,
      className: "bg-blue-600 hover:bg-blue-700",
      value: 1
    },
    {
      type: "Assists",
      label: "Assist",
      icon: <Award className="h-4 w-4" />,
      className: "bg-blue-600 hover:bg-blue-700",
      value: 1
    },
    {
      type: "Steals",
      label: "Steal",
      icon: <Shield className="h-4 w-4" />,
      className: "bg-blue-600 hover:bg-blue-700",
      value: 1
    },
    {
      type: "Blocks",
      label: "Block",
      icon: <Minus className="h-4 w-4" />,
      className: "bg-blue-600 hover:bg-blue-700",
      value: 1
    },
    {
      type: "Fouls",
      label: "Foul",
      icon: <X className="h-4 w-4" />,
      className: "bg-yellow-600 hover:bg-yellow-700",
      value: 1
    }
  ];
  
  return (
    <div className="bg-gray-700 p-4 rounded-lg" data-stat-recorder>
      <div className="mb-3 text-sm font-medium text-gray-300">
        Record Stats:
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {statButtons.map((button) => (
          <Button
            key={button.type}
            onClick={(e) => handleStatClick(button.type, button.value, e)}
            className={`${button.className} w-full text-white flex items-center justify-center transition-all duration-200 hover:scale-105 min-h-[48px] py-2 px-3 ${
              animatingButton === button.type 
                ? 'scale-110 shadow-lg animate-pulse' 
                : ''
            }`}
            disabled={isLoading}
            size="sm"
            variant="ghost"
          >
            {button.icon}
            <span className="ml-1 font-medium text-xs">
              {button.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CompactStatRecorder;
