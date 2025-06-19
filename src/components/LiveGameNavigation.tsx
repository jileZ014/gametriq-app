
import React from 'react';
import { BarChart, RotateCcw, Clock, Users, Power } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayerView } from "@/types";

interface LiveGameNavigationProps {
  currentView: PlayerView;
  onViewChange: (view: PlayerView) => void;
  onUndoLastStat: () => void;
  onEndGame: () => void;
}

const LiveGameNavigation: React.FC<LiveGameNavigationProps> = ({
  currentView,
  onViewChange,
  onUndoLastStat,
  onEndGame
}) => {
  return (
    <Card className="fixed bottom-0 left-0 right-0 p-2 bg-gray-900 border-t border-gray-700 z-50">
      <div className="flex justify-around items-center">
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${
            currentView === PlayerView.STATS ? 'text-blue-400' : 'text-gray-400'
          }`}
          onClick={() => onViewChange(PlayerView.STATS)}
          aria-label="Stats view"
        >
          <BarChart className="h-5 w-5 mb-1" />
          <span className="text-xs">Stats</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${
            currentView === PlayerView.TIMELINE ? 'text-blue-400' : 'text-gray-400'
          }`}
          onClick={() => onViewChange(PlayerView.TIMELINE)}
          aria-label="Timeline view"
        >
          <Clock className="h-5 w-5 mb-1" />
          <span className="text-xs">Timeline</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${
            currentView === PlayerView.ROSTER ? 'text-blue-400' : 'text-gray-400'
          }`}
          onClick={() => onViewChange(PlayerView.ROSTER)}
          aria-label="Roster view"
        >
          <Users className="h-5 w-5 mb-1" />
          <span className="text-xs">Roster</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center text-amber-400"
          onClick={onUndoLastStat}
          aria-label="Undo last stat"
        >
          <RotateCcw className="h-5 w-5 mb-1" />
          <span className="text-xs">Undo</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center text-red-400"
          onClick={onEndGame}
          aria-label="End game"
        >
          <Power className="h-5 w-5 mb-1" />
          <span className="text-xs">End Game</span>
        </Button>
      </div>
    </Card>
  );
};

export default LiveGameNavigation;
