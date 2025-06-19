
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatRecord } from "@/services/StatsService";
import { StatType, POINT_VALUES } from "@/types";

interface PlayerStatsChartsProps {
  statRecords: StatRecord[];
  playerName: string;
}

const PlayerStatsCharts: React.FC<PlayerStatsChartsProps> = ({ 
  statRecords,
  playerName
}) => {
  // Calculate shooting stats for bar chart
  const shootingStats = [
    {
      name: "Field Goals",
      Made: statRecords.filter(stat => stat.stat_type === "FG_Made").length,
      Missed: statRecords.filter(stat => stat.stat_type === "FG_Missed").length,
    },
    {
      name: "3-Pointers",
      Made: statRecords.filter(stat => stat.stat_type === "ThreePT_Made").length,
      Missed: statRecords.filter(stat => stat.stat_type === "ThreePT_Missed").length,
    },
    {
      name: "Free Throws",
      Made: statRecords.filter(stat => stat.stat_type === "FT_Made").length,
      Missed: statRecords.filter(stat => stat.stat_type === "FT_Missed").length,
    },
  ];

  // Calculate point distribution for pie chart
  const fgPoints = statRecords
    .filter(stat => stat.stat_type === "FG_Made")
    .reduce((sum, stat) => sum + POINT_VALUES.FG_Made * (stat.value || 1), 0);

  const threePtPoints = statRecords
    .filter(stat => stat.stat_type === "ThreePT_Made")
    .reduce((sum, stat) => sum + POINT_VALUES.ThreePT_Made * (stat.value || 1), 0);

  const ftPoints = statRecords
    .filter(stat => stat.stat_type === "FT_Made")
    .reduce((sum, stat) => sum + POINT_VALUES.FT_Made * (stat.value || 1), 0);

  const scoringDistribution = [
    { name: "2PT Field Goals", value: fgPoints, fill: "#0088FE" },
    { name: "3PT Field Goals", value: threePtPoints, fill: "#00C49F" },
    { name: "Free Throws", value: ftPoints, fill: "#FFBB28" },
  ].filter(item => item.value > 0); // Only include categories with points

  // Calculate shooting percentages and other stats
  const fgMade = statRecords.filter(stat => stat.stat_type === "FG_Made").length;
  const fgMissed = statRecords.filter(stat => stat.stat_type === "FG_Missed").length;
  const fgPercentage = fgMade + fgMissed > 0 
    ? Math.round((fgMade / (fgMade + fgMissed)) * 100) 
    : 0;

  const tpMade = statRecords.filter(stat => stat.stat_type === "ThreePT_Made").length;
  const tpMissed = statRecords.filter(stat => stat.stat_type === "ThreePT_Missed").length;
  const tpPercentage = tpMade + tpMissed > 0 
    ? Math.round((tpMade / (tpMade + tpMissed)) * 100) 
    : 0;

  const ftMade = statRecords.filter(stat => stat.stat_type === "FT_Made").length;
  const ftMissed = statRecords.filter(stat => stat.stat_type === "FT_Missed").length;
  const ftPercentage = ftMade + ftMissed > 0 
    ? Math.round((ftMade / (ftMade + ftMissed)) * 100) 
    : 0;

  const totalPoints = fgPoints + threePtPoints + ftPoints;

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} points`}</p>
          <p className="text-gray-600">{`${Math.round((payload[0].value / totalPoints) * 100)}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {playerName}'s Shooting Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shootingStats}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Made" fill="#4ade80" name="Made" />
                <Bar dataKey="Missed" fill="#f87171" name="Missed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">FG%</p>
              <p className="text-xl">{fgPercentage}%</p>
              <p className="text-xs text-gray-500">{fgMade}/{fgMade + fgMissed}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">3PT%</p>
              <p className="text-xl">{tpPercentage}%</p>
              <p className="text-xs text-gray-500">{tpMade}/{tpMade + tpMissed}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">FT%</p>
              <p className="text-xl">{ftPercentage}%</p>
              <p className="text-xs text-gray-500">{ftMade}/{ftMade + ftMissed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {totalPoints > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Scoring Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoringDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-lg font-medium">Total Points: {totalPoints}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Other Key Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">Assists</p>
              <p className="text-2xl">{statRecords.filter(stat => stat.stat_type === "Assists").reduce((sum, stat) => sum + (stat.value || 1), 0)}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">Rebounds</p>
              <p className="text-2xl">{statRecords.filter(stat => stat.stat_type === "Rebounds").reduce((sum, stat) => sum + (stat.value || 1), 0)}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">Steals</p>
              <p className="text-2xl">{statRecords.filter(stat => stat.stat_type === "Steals").reduce((sum, stat) => sum + (stat.value || 1), 0)}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">Blocks</p>
              <p className="text-2xl">{statRecords.filter(stat => stat.stat_type === "Blocks").reduce((sum, stat) => sum + (stat.value || 1), 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStatsCharts;
