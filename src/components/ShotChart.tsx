
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatRecord } from '@/services/StatsService';

interface Shot {
  id: string;
  zone: 'paint' | 'midrange' | 'corner3' | 'top3';
  made: boolean;
  timestamp: string;
  x: number; // SVG coordinate
  y: number; // SVG coordinate
}

interface ShotChartProps {
  playerName: string;
  statRecords: StatRecord[];
}

const ShotChart: React.FC<ShotChartProps> = ({ playerName, statRecords }) => {
  const [shots, setShots] = useState<Shot[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');

  // Zone coordinates mapping for SVG (half-court view)
  const zoneCoordinates = {
    paint: { x: 200, y: 280 },
    midrange: { x: 200, y: 200 },
    corner3: { x: 120, y: 320 },
    top3: { x: 200, y: 120 }
  };

  const zones = [
    { id: 'paint', label: 'Paint', color: 'bg-orange-100 text-orange-800' },
    { id: 'midrange', label: 'Midrange', color: 'bg-blue-100 text-blue-800' },
    { id: 'corner3', label: 'Corner 3', color: 'bg-purple-100 text-purple-800' },
    { id: 'top3', label: 'Top 3', color: 'bg-green-100 text-green-800' }
  ];

  // Calculate stats from existing stat records
  const fgMade = statRecords.filter(stat => stat.stat_type === 'FG_Made').length;
  const fgMissed = statRecords.filter(stat => stat.stat_type === 'FG_Missed').length;
  const threePtMade = statRecords.filter(stat => stat.stat_type === 'ThreePT_Made').length;
  const threePtMissed = statRecords.filter(stat => stat.stat_type === 'ThreePT_Missed').length;

  const handleShotRecord = (made: boolean) => {
    if (!selectedZone) return;

    const zone = selectedZone as Shot['zone'];
    const coordinates = zoneCoordinates[zone];
    
    // Add some randomness to coordinates for multiple shots in same zone
    const randomOffset = () => (Math.random() - 0.5) * 30;
    
    const newShot: Shot = {
      id: `shot-${Date.now()}-${Math.random()}`,
      zone,
      made,
      timestamp: new Date().toISOString(),
      x: coordinates.x + randomOffset(),
      y: coordinates.y + randomOffset()
    };

    setShots(prev => [...prev, newShot]);
    setSelectedZone('');
  };

  const clearShots = () => {
    setShots([]);
  };

  const madeShots = shots.filter(shot => shot.made);
  const missedShots = shots.filter(shot => !shot.made);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{playerName}'s Shot Chart</span>
            <Button onClick={clearShots} variant="outline" size="sm">
              Clear Chart
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Zone Selection */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Select shooting zone:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {zones.map(zone => (
                <Badge
                  key={zone.id}
                  className={`cursor-pointer transition-all ${
                    selectedZone === zone.id 
                      ? 'ring-2 ring-blue-500 ' + zone.color
                      : zone.color
                  }`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  {zone.label}
                </Badge>
              ))}
            </div>
            
            {selectedZone && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleShotRecord(true)}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Made Shot ✅
                </Button>
                <Button 
                  onClick={() => handleShotRecord(false)}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Missed Shot ❌
                </Button>
              </div>
            )}
          </div>

          {/* SVG Half-Court */}
          <div className="bg-orange-100 p-4 rounded-lg">
            <svg 
              width="400" 
              height="400" 
              viewBox="0 0 400 400" 
              className="border border-gray-300 bg-orange-50 rounded-lg"
            >
              {/* Half-court background */}
              <rect width="400" height="400" fill="#f97316" fillOpacity="0.1" />
              
              {/* Free throw lane */}
              <rect x="160" y="280" width="80" height="120" fill="none" stroke="#000" strokeWidth="2" />
              
              {/* Free throw circle */}
              <circle cx="200" cy="280" r="30" fill="none" stroke="#000" strokeWidth="2" />
              
              {/* 3-point arc (simplified) */}
              <path 
                d="M 50 350 Q 200 150 350 350" 
                fill="none" 
                stroke="#000" 
                strokeWidth="2"
              />
              
              {/* Basket */}
              <circle cx="200" cy="380" r="8" fill="none" stroke="#000" strokeWidth="3" />
              <rect x="195" y="375" width="10" height="2" fill="#000" />
              
              {/* Zone labels */}
              <text x="200" y="310" textAnchor="middle" fontSize="12" fill="#666">Paint</text>
              <text x="200" y="200" textAnchor="middle" fontSize="12" fill="#666">Midrange</text>
              <text x="80" y="340" textAnchor="middle" fontSize="12" fill="#666">Corner 3</text>
              <text x="320" y="340" textAnchor="middle" fontSize="12" fill="#666">Corner 3</text>
              <text x="200" y="140" textAnchor="middle" fontSize="12" fill="#666">Top 3</text>
              
              {/* Plot made shots (green circles) */}
              {madeShots.map(shot => {
                const isThree = shot.zone === 'corner3' || shot.zone === 'top3';
                return (
                  <circle
                    key={shot.id}
                    cx={shot.x}
                    cy={shot.y}
                    r="6"
                    fill={isThree ? "#3b82f6" : "#10b981"}
                    stroke="#fff"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                );
              })}
              
              {/* Plot missed shots (red X marks) */}
              {missedShots.map(shot => (
                <g key={shot.id}>
                  <line
                    x1={shot.x - 4}
                    y1={shot.y - 4}
                    x2={shot.x + 4}
                    y2={shot.y + 4}
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <line
                    x1={shot.x - 4}
                    y1={shot.y + 4}
                    x2={shot.x + 4}
                    y2={shot.y - 4}
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Shot Summary */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Chart Shots</p>
              <p className="text-2xl font-bold">{shots.length}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Made</p>
              <p className="text-2xl font-bold text-green-700">{madeShots.length}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Missed</p>
              <p className="text-2xl font-bold text-red-700">{missedShots.length}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">FG%</p>
              <p className="text-2xl font-bold text-blue-700">
                {shots.length > 0 ? Math.round((madeShots.length / shots.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Made 2PT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Made 3PT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="text-red-500 font-bold">×</span>
              </div>
              <span>Missed Shot</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShotChart;
