
import { useState, useEffect, useRef } from 'react';
import { StatRecord } from '@/types';
import { toast } from "@/components/ui/use-toast";

interface MilestoneState {
  consecutiveScores: number;
  lastScoreTime: number;
  lastMilestoneTime: number;
}

const MILESTONE_COOLDOWN = 30000; // 30 seconds

export const useMilestoneTracker = (playerId: string, playerName: string) => {
  const [milestoneState, setMilestoneState] = useState<MilestoneState>({
    consecutiveScores: 0,
    lastScoreTime: 0,
    lastMilestoneTime: 0
  });
  
  const prevStatsRef = useRef<{ points: number; assists: number; stealsBlocks: number }>({
    points: 0,
    assists: 0,
    stealsBlocks: 0
  });

  // Haptic feedback for milestone achievements
  const triggerMilestoneHaptic = () => {
    if ('vibrate' in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.vibrate([100, 50, 100, 50, 200]); // Special celebration pattern
    }
  };

  // Show milestone toast with celebration styling
  const showMilestoneToast = (message: string, icon: string, isSpecial = false) => {
    const now = Date.now();
    
    // Check cooldown to avoid spam
    if (now - milestoneState.lastMilestoneTime < MILESTONE_COOLDOWN) {
      return;
    }
    
    triggerMilestoneHaptic();
    
    toast({
      title: `${icon} ${message}`,
      duration: 3000,
      className: isSpecial 
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700 animate-pulse" 
        : "bg-gradient-to-r from-green-600 to-blue-600 text-white border-green-700"
    });
    
    setMilestoneState(prev => ({ ...prev, lastMilestoneTime: now }));
  };

  const checkMilestones = (currentStats: {
    points: number;
    assists: number;
    steals: number;
    blocks: number;
    isScoring: boolean;
  }) => {
    const prevStats = prevStatsRef.current;
    const stealsBlocks = currentStats.steals + currentStats.blocks;
    
    // Check for 10 points milestone
    if (currentStats.points >= 10 && prevStats.points < 10) {
      showMilestoneToast(`10 Points! ${playerName} is heating up!`, "🎉", true);
    }
    
    // Check for 5 assists milestone
    if (currentStats.assists >= 5 && prevStats.assists < 5) {
      showMilestoneToast(`5 Assists! Great vision, ${playerName}!`, "🎯");
    }
    
    // Check for 3+ steals/blocks milestone
    if (stealsBlocks >= 3 && prevStats.stealsBlocks < 3) {
      showMilestoneToast(`3+ Steals/Blocks! Defensive stopper!`, "🛡️");
    }
    
    // Track consecutive scores
    if (currentStats.isScoring) {
      const now = Date.now();
      const timeSinceLastScore = now - milestoneState.lastScoreTime;
      
      // Reset consecutive count if too much time has passed (more than 2 minutes)
      let newConsecutive = timeSinceLastScore > 120000 ? 1 : milestoneState.consecutiveScores + 1;
      
      // Check for back-to-back scores (2+ consecutive)
      if (newConsecutive >= 2 && milestoneState.consecutiveScores < 2) {
        showMilestoneToast(`Back-to-back scores! ${playerName} is on fire!`, "🔥", true);
      }
      
      setMilestoneState(prev => ({
        ...prev,
        consecutiveScores: newConsecutive,
        lastScoreTime: now
      }));
    }
    
    // Update previous stats reference
    prevStatsRef.current = {
      points: currentStats.points,
      assists: currentStats.assists,
      stealsBlocks: stealsBlocks
    };
  };

  return { checkMilestones };
};
