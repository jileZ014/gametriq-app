
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";

interface OfflineIndicatorProps {
  isOnline: boolean;
  offlineQueueLength: number;
  forceSync: () => void;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  isOnline, 
  offlineQueueLength, 
  forceSync 
}) => {
  if (isOnline) return null;

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Cloud className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <span className="text-yellow-800 dark:text-yellow-300 font-medium">
          You're offline. Stats are being saved locally.
        </span>
        {offlineQueueLength > 0 && (
          <Badge variant="outline" className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
            {offlineQueueLength} pending
          </Badge>
        )}
      </div>
      <Button 
        size="sm" 
        variant="outline"
        className="bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800"
        onClick={forceSync}
      >
        Try to sync
      </Button>
    </div>
  );
};

export default OfflineIndicator;
