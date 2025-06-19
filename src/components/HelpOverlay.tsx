
import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HelpOverlay: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-40 rounded-full">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Help & Quick Tips</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="coach">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="coach">For Coaches</TabsTrigger>
            <TabsTrigger value="parent">For Parents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coach" className="space-y-4 pt-4">
            <div>
              <h4 className="font-medium text-lg">Adding Players</h4>
              <p className="text-sm text-gray-600">
                Enter player name and optional parent email. Players will appear in your roster.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-lg">Tracking Game Stats</h4>
              <p className="text-sm text-gray-600">
                Select a game, then use the + and - buttons to record statistics for each player.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-lg">Sharing with Parents</h4>
              <p className="text-sm text-gray-600">
                Enter a parent's email when creating a player to automatically send them access.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="parent" className="space-y-4 pt-4">
            <div>
              <h4 className="font-medium text-lg">Viewing Stats</h4>
              <p className="text-sm text-gray-600">
                Your athlete's stats are displayed automatically. Select different games to see all statistics.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-lg">Adding Photos</h4>
              <p className="text-sm text-gray-600">
                You can upload a photo of your athlete by clicking the "Upload Photo" button.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-lg">Getting Updates</h4>
              <p className="text-sm text-gray-600">
                You'll receive automatic updates when the coach adds new game statistics.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HelpOverlay;
