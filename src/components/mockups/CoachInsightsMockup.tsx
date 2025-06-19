
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Users, Clock, Lightbulb, Target } from 'lucide-react';

interface InsightCard {
  id: string;
  type: 'suggestion' | 'warning' | 'celebration' | 'strategy';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

const CoachInsightsMockup: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'halftime' | 'postgame'>('live');

  const insights: InsightCard[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Playing Time Imbalance',
      description: 'Sarah has played 18 minutes, while Emma has only played 4 minutes this game.',
      action: 'Consider rotating players',
      priority: 'high',
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
    },
    {
      id: '2',
      type: 'celebration',
      title: 'Excellent Ball Movement',
      description: 'Team has 12 assists on 16 made baskets - great teamwork!',
      priority: 'medium',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Feed the Hot Hand',
      description: 'Sarah is 4/5 from the field and 2/2 from three. Keep getting her good looks.',
      action: 'Run plays for Sarah',
      priority: 'high',
      icon: <Target className="h-5 w-5 text-blue-500" />
    },
    {
      id: '4',
      type: 'strategy',
      title: 'Defensive Adjustment',
      description: 'Opponents are shooting 60% from the right corner. Consider zone defense.',
      action: 'Switch to 2-3 zone',
      priority: 'medium',
      icon: <Lightbulb className="h-5 w-5 text-purple-500" />
    }
  ];

  const getInsightColor = (type: InsightCard['type'], priority: InsightCard['priority']) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-900/20';
    if (type === 'celebration') return 'border-l-green-500 bg-green-900/20';
    if (type === 'suggestion') return 'border-l-blue-500 bg-blue-900/20';
    if (type === 'strategy') return 'border-l-purple-500 bg-purple-900/20';
    return 'border-l-gray-500 bg-gray-900/20';
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header with Live Score */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Warriors vs Eagles</h2>
              <p className="text-blue-200">Q3 • 4:32 remaining</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">42-38</div>
              <Badge className="bg-green-600 mt-2">Leading by 4</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 bg-gray-800 rounded-lg overflow-hidden">
        {[
          { key: 'all', label: 'All Insights' },
          { key: 'live', label: 'Live Game' },
          { key: 'halftime', label: 'Halftime' },
          { key: 'postgame', label: 'Post-Game' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as any)}
            className={`p-3 text-center text-sm font-medium transition-colors ${
              activeFilter === filter.key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-white">67%</div>
          <div className="text-xs text-gray-400">FG%</div>
        </Card>
        <Card className="bg-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-white">12</div>
          <div className="text-xs text-gray-400">AST</div>
        </Card>
        <Card className="bg-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-white">8</div>
          <div className="text-xs text-gray-400">TO</div>
        </Card>
        <Card className="bg-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-white">+4</div>
          <div className="text-xs text-gray-400">+/-</div>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-yellow-400" />
            AI Coach Insights
          </h3>
          <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-600">
            Live Analysis
          </Badge>
        </div>

        {insights.map((insight) => (
          <Card key={insight.id} className={`bg-gray-800 border-l-4 ${getInsightColor(insight.type, insight.priority)}`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-700 rounded-full flex-shrink-0">
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-semibold">{insight.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        insight.priority === 'high' ? 'border-red-500 text-red-400' :
                        insight.priority === 'medium' ? 'border-yellow-500 text-yellow-400' :
                        'border-gray-500 text-gray-400'
                      }`}
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                  {insight.action && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      {insight.action}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Playing Time Tracker */}
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-400" />
            Playing Time Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Sarah Johnson', minutes: 18, percentage: 75 },
            { name: 'Emma Davis', minutes: 12, percentage: 50 },
            { name: 'Maya Wilson', minutes: 8, percentage: 33 },
            { name: 'Chloe Brown', minutes: 4, percentage: 17 }
          ].map((player) => (
            <div key={player.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{player.name}</span>
                <span className="text-white">{player.minutes} min</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    player.percentage > 60 ? 'bg-red-500' :
                    player.percentage > 40 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${player.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Panel */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
          <Users className="h-4 w-4 mr-2" />
          Substitutions
        </Button>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Target className="h-4 w-4 mr-2" />
          Set Play
        </Button>
      </div>
    </div>
  );
};

export default CoachInsightsMockup;
