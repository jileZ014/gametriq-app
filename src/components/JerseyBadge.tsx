
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface JerseyBadgeProps {
  playerNumber?: string;
  playerName: string;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const JerseyBadge: React.FC<JerseyBadgeProps> = ({ 
  playerNumber, 
  playerName, 
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  if (!playerNumber) {
    return <span className="font-medium">{playerName}</span>;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={variant}
        className={`${sizeClasses[size]} bg-blue-600 text-white font-bold rounded-full ${className}`}
      >
        #{playerNumber}
      </Badge>
      <span className="font-medium">{playerName}</span>
    </div>
  );
};

export default JerseyBadge;
