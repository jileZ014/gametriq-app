import React from 'react';
import { AlertCircle, BarChart3, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DataFallbackProps {
  type: 'player' | 'stats' | 'games' | 'general';
  title?: string;
  description?: string;
  onRetry?: () => void;
  showSampleData?: boolean;
}

const DataFallback: React.FC<DataFallbackProps> = ({
  type,
  title,
  description,
  onRetry,
  showSampleData = true
}) => {
  const getIconForType = () => {
    switch (type) {
      case 'player':
        return <Users className="h-12 w-12 text-muted-foreground" />;
      case 'stats':
        return <BarChart3 className="h-12 w-12 text-muted-foreground" />;
      case 'games':
        return <TrendingUp className="h-12 w-12 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'player':
        return {
          title: 'No Player Data Available',
          description: 'Player information could not be loaded. This might be because the player hasn\'t been set up yet or there\'s a connection issue.'
        };
      case 'stats':
        return {
          title: 'No Statistics Available',
          description: 'No statistics have been recorded yet. Start tracking player performance during games to see stats here.'
        };
      case 'games':
        return {
          title: 'No Games Found',
          description: 'No games have been scheduled or recorded yet. Create a game to start tracking statistics.'
        };
      default:
        return {
          title: 'Data Unavailable',
          description: 'The requested information could not be loaded at this time.'
        };
    }
  };

  const defaultMessage = getDefaultMessage();
  const displayTitle = title || defaultMessage.title;
  const displayDescription = description || defaultMessage.description;

  const getSampleDataInfo = () => {
    switch (type) {
      case 'player':
        return {
          title: 'Sample Player Data',
          items: [
            'Player: John Smith (#23)',
            'Position: Point Guard',
            'Season Stats: 15.2 PPG, 6.1 APG'
          ]
        };
      case 'stats':
        return {
          title: 'Sample Statistics',
          items: [
            'Field Goals: 5/8 (62.5%)',
            'Three Pointers: 2/4 (50%)',
            'Free Throws: 4/5 (80%)'
          ]
        };
      case 'games':
        return {
          title: 'Sample Game Data',
          items: [
            'vs. Eagles - Won 65-58',
            'vs. Hawks - Lost 72-68',
            'vs. Lions - Won 71-55'
          ]
        };
      default:
        return null;
    }
  };

  const sampleData = getSampleDataInfo();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            {getIconForType()}
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">
            {displayTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {displayDescription}
          </p>

          {showSampleData && sampleData && (
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-sm text-foreground mb-2">
                {sampleData.title}:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {sampleData.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          )}

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              If this issue persists, please contact support or check your internet connection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataFallback;