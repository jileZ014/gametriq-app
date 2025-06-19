
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Filter } from "lucide-react";

export type TimeFilterOption = "all" | "1week" | "2weeks" | "1month";

interface StatTimeFilterProps {
  selectedFilter: TimeFilterOption;
  onFilterChange: (filter: TimeFilterOption) => void;
}

const StatTimeFilter: React.FC<StatTimeFilterProps> = ({ selectedFilter, onFilterChange }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm mb-4">
      <CardContent className="py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-600 mr-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Time Range:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => onFilterChange("all")}
              className="rounded-full"
            >
              All Time
            </Button>
            
            <Button
              size="sm"
              variant={selectedFilter === "1week" ? "default" : "outline"}
              onClick={() => onFilterChange("1week")}
              className="rounded-full"
            >
              <Calendar className="h-3 w-3 mr-1" /> Last Week
            </Button>
            
            <Button
              size="sm"
              variant={selectedFilter === "2weeks" ? "default" : "outline"}
              onClick={() => onFilterChange("2weeks")}
              className="rounded-full"
            >
              <Calendar className="h-3 w-3 mr-1" /> Last 2 Weeks
            </Button>
            
            <Button
              size="sm"
              variant={selectedFilter === "1month" ? "default" : "outline"}
              onClick={() => onFilterChange("1month")}
              className="rounded-full"
            >
              <Calendar className="h-3 w-3 mr-1" /> Last Month
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatTimeFilter;
