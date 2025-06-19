
import React from "react";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading = true }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-2"></div>
        <p className="text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
