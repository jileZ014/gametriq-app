
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Users, 
  Calendar,
  Settings
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTeams, Team } from '@/hooks/useTeams';

interface TeamManagerProps {
  onSelectTeam: (team: Team) => void;
  selectedTeamId?: string;
}

const TeamManager: React.FC<TeamManagerProps> = ({ onSelectTeam, selectedTeamId }) => {
  const { teams, createTeam, cloneTeam, deleteTeam, isCreatingTeam, isCloningTeam } = useTeams();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [selectedTeamToClone, setSelectedTeamToClone] = useState<Team | null>(null);
  
  const [newTeamData, setNewTeamData] = useState({
    team_name: '',
    season: '',
    description: ''
  });
  
  const [cloneTeamData, setCloneTeamData] = useState({
    new_team_name: '',
    new_season: ''
  });

  const handleCreateTeam = () => {
    if (!newTeamData.team_name.trim()) return;
    
    createTeam(newTeamData);
    setNewTeamData({ team_name: '', season: '', description: '' });
    setIsCreateDialogOpen(false);
  };

  const handleCloneTeam = () => {
    if (!selectedTeamToClone || !cloneTeamData.new_team_name.trim()) return;
    
    cloneTeam({
      source_team_id: selectedTeamToClone.id,
      new_team_name: cloneTeamData.new_team_name,
      new_season: cloneTeamData.new_season || undefined
    });
    
    setCloneTeamData({ new_team_name: '', new_season: '' });
    setIsCloneDialogOpen(false);
    setSelectedTeamToClone(null);
  };

  const openCloneDialog = (team: Team) => {
    setSelectedTeamToClone(team);
    setCloneTeamData({
      new_team_name: `${team.team_name} (Copy)`,
      new_season: ''
    });
    setIsCloneDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">My Teams</h2>
          <p className="text-blue-200">Manage your team rosters and seasons</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Team</DialogTitle>
              <DialogDescription className="text-gray-400">
                Set up a new team roster for a season or league.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Team Name</label>
                <Input
                  placeholder="e.g., Lightning Bolts"
                  value={newTeamData.team_name}
                  onChange={(e) => setNewTeamData(prev => ({ ...prev, team_name: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Season/League</label>
                <Input
                  placeholder="e.g., Fall 2024, Winter 12U"
                  value={newTeamData.season}
                  onChange={(e) => setNewTeamData(prev => ({ ...prev, season: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
                <Input
                  placeholder="Team description or notes"
                  value={newTeamData.description}
                  onChange={(e) => setNewTeamData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-gray-700 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTeam}
                disabled={!newTeamData.team_name.trim() || isCreatingTeam}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <Card className="bg-gray-900/80 border-gray-800">
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
            <p className="text-gray-400 mb-6">Create your first team to start managing players and games.</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card 
              key={team.id} 
              className={`bg-gray-900/80 border-gray-800 cursor-pointer transition-all hover:bg-gray-800/90 ${
                selectedTeamId === team.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onSelectTeam(team)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{team.team_name}</CardTitle>
                    {team.season && (
                      <Badge variant="outline" className="mt-1 text-xs border-blue-400 text-blue-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {team.season}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCloneDialog(team);
                      }}
                      className="text-gray-400 hover:text-white p-1 h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-red-400 p-1 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Team</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete "{team.team_name}"? This will permanently remove all players, games, and stats associated with this team.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-700 text-gray-300">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteTeam(team.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Team
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {team.description && (
                  <p className="text-sm text-gray-400 mb-3">{team.description}</p>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Click to manage</span>
                  <Settings className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Clone Team Dialog */}
      <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Clone Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a copy of "{selectedTeamToClone?.team_name}" with all players and jersey numbers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">New Team Name</label>
              <Input
                placeholder="Enter new team name"
                value={cloneTeamData.new_team_name}
                onChange={(e) => setCloneTeamData(prev => ({ ...prev, new_team_name: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300">Season/League (Optional)</label>
              <Input
                placeholder="e.g., Spring 2025"
                value={cloneTeamData.new_season}
                onChange={(e) => setCloneTeamData(prev => ({ ...prev, new_season: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setIsCloneDialogOpen(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCloneTeam}
              disabled={!cloneTeamData.new_team_name.trim() || isCloningTeam}
              className="bg-green-600 hover:bg-green-700"
            >
              <Copy className="mr-2 h-4 w-4" />
              Clone Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManager;
