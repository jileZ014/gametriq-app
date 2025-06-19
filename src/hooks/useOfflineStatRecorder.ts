
import { useState, useEffect, useCallback } from 'react';
import { StatType } from '@/types';
import { recordStat } from '@/Stats';
import { StatsService } from '@/services/StatsService';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

interface OfflineStat {
  action: 'recordStat';
  data: {
    playerId: string;
    gameId: string;
    statType: StatType;
    value: number;
    timestamp: Date;
    createdByUserId: string;
    options: {
      quarter?: number;
      timeRemaining?: string;
      coordinatesX?: number;
      coordinatesY?: number;
      notes?: string;
    };
  };
}

// Complete StatData interface that matches how it's being used
interface StatData {
  playerId: string;
  gameId?: string; // Made optional since it's provided externally
  statType: StatType;
  value?: number;
  options?: {
    quarter?: number;
    timeRemaining?: string;
    coordinatesX?: number;
    coordinatesY?: number;
    notes?: string;
  };
}

const useOfflineStatRecorder = (gameId?: string) => {
  const [offlineQueue, setOfflineQueue] = useState<OfflineStat[]>(() => {
    try {
      const storedQueue = localStorage.getItem('offlineStatsQueue');
      return storedQueue ? JSON.parse(storedQueue) : [];
    } catch (error) {
      console.error("Error parsing offline stats queue from localStorage:", error);
      return [];
    }
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    localStorage.setItem('offlineStatsQueue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);
  
  // Get the current user ID for stat recording
  const getCurrentUserId = useCallback(() => {
    // Try to get from auth context first
    if (currentUser?.id) {
      return currentUser.id;
    }
    
    // Fallback to a fixed ID for testing
    return "offline-user-id";
  }, [currentUser]);

  const recordStatOffline = useCallback((
    playerId: string,
    gameId: string,
    statType: StatType,
    value: number = 1,
    options: {
      quarter?: number;
      timeRemaining?: string;
      coordinatesX?: number;
      coordinatesY?: number;
      notes?: string;
    } = {}
  ) => {
    const timestamp = new Date();
    const userId = getCurrentUserId();
    
    // Pass only the parameters defined in the recordStat function
    recordStat({
      playerId,
      statType,
      value
    });
    
    // Push to queue for later sync
    const newOfflineStat: OfflineStat = {
      action: 'recordStat',
      data: {
        playerId,
        gameId,
        statType,
        value,
        timestamp,
        createdByUserId: userId,
        options
      }
    };
    
    setOfflineQueue(prev => [...prev, newOfflineStat]);
    
    // Show success toast
    toast({
      title: "Stat Recorded Offline",
      description: `${statType} for player ${playerId} recorded offline.`,
    });
  }, [getCurrentUserId, toast]);

  // This function will work with the unified interface to handle both online and offline recording
  const recordStat = useCallback((data: StatData) => {
    if (!gameId) {
      console.error("GameID is required for recording stats");
      return;
    }
    
    recordStatOffline(
      data.playerId,
      gameId,
      data.statType,
      data.value || 1,
      data.options || {}
    );
  }, [gameId, recordStatOffline]);

  const syncOfflineStats = useCallback(async () => {
    if (offlineQueue.length === 0) return;
    
    setIsSyncing(true);
    const failedOps: OfflineStat[] = [];
    
    for (const op of offlineQueue) {
      if (op.action === 'recordStat') {
        try {
          const { playerId, gameId, statType, value, createdByUserId, options } = op.data;
          
          await StatsService.recordStat(
            gameId,
            playerId,
            statType,
            value,
            createdByUserId,
            options
          );
          
          console.log('Synced offline stat:', op.data);
        } catch (error) {
          console.error('Failed to sync stat:', error);
          failedOps.push(op);
        }
      }
    }
    
    if (failedOps.length > 0) {
      toast({
        title: "Sync Failed",
        description: `Failed to sync ${failedOps.length} offline stats.`,
        variant: "destructive",
      });
      // Only keep failed operations in the queue
      setOfflineQueue(failedOps);
    } else {
      toast({
        title: "Sync Successful",
        description: "All offline stats synced successfully!",
      });
      setOfflineQueue([]); // Clear the queue after successful sync
    }
    
    setIsSyncing(false);
  }, [offlineQueue, toast]);

  // Force sync function
  const forceSync = useCallback(() => {
    if (isOnline) {
      syncOfflineStats();
    } else {
      toast({
        title: "Cannot Sync",
        description: "You are offline. Please connect to the internet and try again.",
        variant: "destructive",
      });
    }
  }, [isOnline, syncOfflineStats, toast]);

  // Calculate queue length for display
  const offlineQueueLength = offlineQueue.length;

  return { 
    recordStatOffline, 
    syncOfflineStats, 
    isSyncing,
    recordStat,
    isOnline,
    offlineQueueLength,
    forceSync
  };
};

export default useOfflineStatRecorder;
