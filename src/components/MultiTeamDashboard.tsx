
import React, { useState } from 'react';
import { useTeams, Team } from '@/hooks/useTeams';
import TeamManager from './TeamManager';
import TeamDashboard from './TeamDashboard';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MultiTeamDashboard: React.FC = () => {
  const { teams } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // If no team is selected, show team manager
  if (!selectedTeam) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-50">Team Management</h1>
        </div>
        
        
        <TeamManager 
          onSelectTeam={setSelectedTeam}
          selectedTeamId={selectedTeam?.id}
        />
      </div>
    );
  }

  // Show the selected team's dashboard
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setSelectedTeam(null)}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>
      </div>
      
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-50">
          {selectedTeam.team_name}
        </h1>
        {selectedTeam.season && (
          <p className="text-blue-200 mt-1">{selectedTeam.season}</p>
        )}
        {selectedTeam.description && (
          <p className="text-blue-300 text-sm mt-1">{selectedTeam.description}</p>
        )}
      </div>

      <TeamDashboard team={selectedTeam} />
    </div>
  );
};

export default MultiTeamDashboard;
