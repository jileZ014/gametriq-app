
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExportService } from '@/services/ExportService';
import { toast } from "sonner";
import { FileText, Mail, Table } from "lucide-react";
import { Game, Player } from '@/types';
import { StatRecord } from '@/services/StatsService';
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface StatsExportProps {
  game: Game;
  players: Player[];
  stats: StatRecord[];
  selectedPlayer?: Player | null;
}

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().optional(),
});

const StatsExport: React.FC<StatsExportProps> = ({
  game,
  players,
  stats,
  selectedPlayer
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      subject: `Game Stats: vs ${game.opponent} - ${new Date(game.date).toLocaleDateString()}`,
      message: `Here are the stats from our game against ${game.opponent}.`
    }
  });
  
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const result = await ExportService.exportGameStatsCSV(game, players, stats);
      
      if (result.success) {
        toast.success(`Exported game stats successfully`);
      } else {
        toast.error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export stats");
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleShareViaEmail = async (data: z.infer<typeof emailSchema>) => {
    try {
      setIsExporting(true);
      
      // Use the send-email edge function directly
      const { data: result, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: data.email,
          templateType: "game_stats_share",
          params: {
            recipientName: data.email.split('@')[0],
            teamName: game.team_id || "Team",
            gameInfo: {
              opponent: game.opponent,
              date: new Date(game.date).toLocaleDateString(),
              location: game.location
            },
            message: data.message,
            players: players,
            stats: stats,
            gameId: game.id
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(`Stats shared with ${data.email}`);
      setIsEmailDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share stats via email");
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <CardTitle className="text-white">Export & Share</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Table className="h-4 w-4" />
            Export Game Stats (CSV)
          </Button>
          
          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                disabled={isExporting}
              >
                <Mail className="h-4 w-4" />
                Share via Email
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Game Stats</DialogTitle>
                <DialogDescription>
                  Send game stats to parents, players, or other coaches
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(handleShareViaEmail)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Recipient Email</label>
                  <Input
                    id="email"
                    placeholder="Email address"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    {...register("subject")}
                    className={errors.subject ? "border-red-500" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message (Optional)</label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message"
                    rows={4}
                    {...register("message")}
                  />
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEmailDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isExporting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isExporting ? "Sending..." : "Send Stats"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsExport;
