
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { StatType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import PlayerAnalyticsPage from "@/components/PlayerAnalyticsPage";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerService } from "@/services/PlayerService";
import { GameService } from "@/services/GameService";
import { StatsService } from "@/services/StatsService";

const Analytics = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch players
  const { data: players, isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      return await PlayerService.getAllPlayers();
    }
  });

  // Fetch games
  const { data: games, isLoading: isLoadingGames } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      return await GameService.getAllGames();
    }
  });

  // Fetch stats for all games
  const { data: allGameStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['all-game-stats'],
    queryFn: async () => {
      // We need to fetch stats for each game
      let allStats: Record<string, any[]> = {};
      
      if (games) {
        for (const game of games) {
          const gameStats = await StatsService.getGameStats(game.id);
          allStats[game.id] = gameStats;
        }
      }
      
      return allStats;
    },
    enabled: !!games
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const isLoading = isLoadingPlayers || isLoadingGames || isLoadingStats;

  if (isLoading) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {players && games && allGameStats && (
        <PlayerAnalyticsPage
          players={players}
          games={games}
          statsByGame={allGameStats}
        />
      )}
    </div>
  );
};

export default Analytics;
