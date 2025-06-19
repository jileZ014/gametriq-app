
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { StatType } from '@/types';
import { StatRecord } from '@/services/StatsService';
import { Check, X, Award, Target, Clock, Feather } from 'lucide-react';

interface VisualFeedbackProps {
  latestStat: StatRecord | null;
  playerId: string;
  playerName: string;
}

const STAT_ANIMATIONS = {
  'FG_Made': { icon: <Target className="h-8 w-8" />, color: 'bg-green-500', points: '+2' },
  'ThreePT_Made': { icon: <Target className="h-8 w-8" />, color: 'bg-indigo-500', points: '+3' },
  'FT_Made': { icon: <Feather className="h-8 w-8" />, color: 'bg-blue-500', points: '+1' },
  'FG_Missed': { icon: <X className="h-8 w-8" />, color: 'bg-red-500', points: '' },
  'ThreePT_Missed': { icon: <X className="h-8 w-8" />, color: 'bg-red-500', points: '' },
  'FT_Missed': { icon: <X className="h-8 w-8" />, color: 'bg-red-500', points: '' },
  'Rebounds': { icon: <Check className="h-8 w-8" />, color: 'bg-amber-500', points: '' },
  'Assists': { icon: <Award className="h-8 w-8" />, color: 'bg-purple-500', points: '' },
  'Steals': { icon: <Check className="h-8 w-8" />, color: 'bg-teal-500', points: '' },
  'Blocks': { icon: <Check className="h-8 w-8" />, color: 'bg-cyan-500', points: '' },
  'Fouls': { icon: <X className="h-8 w-8" />, color: 'bg-yellow-500', points: '' },
} as const;

const StatRecordingVisualFeedback: React.FC<VisualFeedbackProps> = ({ 
  latestStat, 
  playerId,
  playerName
}) => {
  const [visible, setVisible] = useState(false);
  
  // Reset animation when a new stat is recorded
  useEffect(() => {
    if (latestStat && latestStat.player_id === playerId) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [latestStat, playerId]);
  
  if (!latestStat || latestStat.player_id !== playerId || !visible) {
    return null;
  }
  
  const statType = latestStat.stat_type as StatType;
  const animation = STAT_ANIMATIONS[statType] || {
    icon: <Check className="h-8 w-8" />,
    color: 'bg-gray-500',
    points: ''
  };
  
  const statLabel = statType.replace('_', ' ');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
    >
      <motion.div 
        className={`${animation.color} text-white rounded-lg shadow-lg px-6 py-4 text-center`}
        initial={{ rotate: -5 }}
        animate={{ rotate: 0 }}
      >
        <div className="flex items-center justify-center mb-2">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1.2 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {animation.icon}
          </motion.div>
        </div>
        
        <div className="text-lg font-bold">{statLabel}</div>
        <div className="text-sm">{playerName}</div>
        
        {animation.points && (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1.5, y: -5 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold mt-1"
          >
            {animation.points}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StatRecordingVisualFeedback;
