import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Share, Heart, TrendingUp, Award, Star, Users } from 'lucide-react';
import ExportablePlayerCard from '../ExportablePlayerCard';

interface PlayerMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  shareCount: number;
}

interface PlayerHighlight {
  statType: string;
  value: number;
  gameDate: string;
  opponent: string;
}

const ParentEngagementMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'milestones' | 'development'>('highlights');

  // Mock player data
  const playerData = {
    name: "Sarah Johnson",
    number: "23",
    position: "Point Guard",
    photo: "/api/placeholder/80/80"
  };

  const currentGameStats = {
    points: 18,
    rebounds: 12,
    assists: 7,
    steals: 2,
    blocks: 1
  };

  const gameInfo = {
    opponent: "Eagles",
    date: "March 15"
  };

  const playerMilestones: PlayerMilestone[] = [
    {
      id: '1',
      title: 'First Double-Double!',
      description: '12 points, 10 rebounds vs Eagles',
      date: '2 days ago',
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      shareCount: 8
    },
    {
      id: '2',
      title: 'Career High in Assists',
      description: '7 assists in a single game',
      date: '1 week ago',
      icon: <Star className="h-6 w-6 text-purple-500" />,
      shareCount: 12
    },
    {
      id: '3',
      title: 'Perfect Free Throws',
      description: '6/6 from the line vs Hawks',
      date: '2 weeks ago',
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      shareCount: 5
    }
  ];

  const highlights: PlayerHighlight[] = [
    { statType: 'Points', value: 18, gameDate: 'March 15', opponent: 'Eagles' },
    { statType: 'Rebounds', value: 12, gameDate: 'March 15', opponent: 'Eagles' },
    { statType: 'Assists', value: 7, gameDate: 'March 8', opponent: 'Hawks' },
    { statType: 'Steals', value: 4, gameDate: 'March 1', opponent: 'Lions' }
  ];

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Exportable Player Performance Card */}
      <ExportablePlayerCard 
        player={playerData}
        stats={currentGameStats}
        gameInfo={gameInfo}
      />

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 bg-gray-800 rounded-lg overflow-hidden">
        {[
          { key: 'highlights', label: 'Highlights', icon: <Star className="h-4 w-4" /> },
          { key: 'milestones', label: 'Milestones', icon: <Award className="h-4 w-4" /> },
          { key: 'development', label: 'Growth', icon: <TrendingUp className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`p-3 text-center transition-colors ${
              activeTab === tab.key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'highlights' && (
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Season Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-semibold">{highlight.value} {highlight.statType}</p>
                  <p className="text-gray-400 text-sm">vs {highlight.opponent} • {highlight.gameDate}</p>
                </div>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {playerMilestones.map((milestone) => (
            <Card key={milestone.id} className="bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-700 rounded-full">
                    {milestone.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{milestone.title}</h3>
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{milestone.date}</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      {milestone.shareCount}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'development' && (
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Development Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Shooting Accuracy</span>
                  <span className="text-green-400">+15% this month</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Rebounds per Game</span>
                  <span className="text-blue-400">+2.3 avg</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Court Awareness</span>
                  <span className="text-purple-400">Excellent</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* Coach Notes */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-400 text-sm font-medium">Coach's Note</span>
              </div>
              <p className="text-gray-300 text-sm">
                "Sarah has shown tremendous improvement in her court vision. Her assist-to-turnover ratio has improved by 40% this season!"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons - Updated to remove duplicate Share button */}
      <div className="grid grid-cols-1 gap-3">
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Camera className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>
    </div>
  );
};

export default ParentEngagementMockup;
