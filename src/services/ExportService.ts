
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { StatRecord } from './StatsService';
import { Player, Game, StatType, POINT_VALUES } from '@/types';
import Papa from 'papaparse';

export class ExportService {
  // Helper to calculate stat totals for a player
  private static calculateStatTotals(statRecords: StatRecord[], playerId: string) {
    const playerStats = statRecords.filter(stat => stat.player_id === playerId);
    
    const totals: Record<string, number> = {
      'FG_Made': 0, 'FG_Missed': 0, 'ThreePT_Made': 0, 'ThreePT_Missed': 0, 
      'FT_Made': 0, 'FT_Missed': 0, 'Rebounds': 0, 'Assists': 0, 
      'Steals': 0, 'Blocks': 0, 'Fouls': 0
    };
    
    // Aggregate stats
    playerStats.forEach(stat => {
      const statType = stat.stat_type as StatType;
      totals[statType] = (totals[statType] || 0) + (stat.value || 1);
    });
    
    // Calculate total points
    const totalPoints = playerStats.reduce((total, stat) => {
      const statType = stat.stat_type as StatType;
      const pointValue = POINT_VALUES[statType] || 0;
      return total + (pointValue * (stat.value || 1));
    }, 0);
    
    // Calculate percentages
    const fgTotal = totals['FG_Made'] + totals['FG_Missed'];
    const fgPercentage = fgTotal > 0 ? Math.round((totals['FG_Made'] / fgTotal) * 100) : 0;
    
    const threeTotal = totals['ThreePT_Made'] + totals['ThreePT_Missed'];
    const threePercentage = threeTotal > 0 ? Math.round((totals['ThreePT_Made'] / threeTotal) * 100) : 0;
    
    const ftTotal = totals['FT_Made'] + totals['FT_Missed'];
    const ftPercentage = ftTotal > 0 ? Math.round((totals['FT_Made'] / ftTotal) * 100) : 0;
    
    // Return totals with the calculated percentages
    return {
      ...totals, // Include all totals
      totalPoints,
      fgPercentage,
      threePercentage,
      ftPercentage
    };
  }
  
  // Export game stats as CSV
  static async exportGameStatsCSV(game: Game, players: Player[], stats: StatRecord[]) {
    // Create header row
    const headers = [
      'Player', 'Jersey', 'Points', 'FG', 'FG%', '3PT', '3PT%', 'FT', 'FT%', 
      'REB', 'AST', 'STL', 'BLK', 'FOULS'
    ];
    
    // Create data rows
    const rows = players.map(player => {
      const statTotals = this.calculateStatTotals(stats, player.id);
      
      return [
        player.name,
        player.playerNumber || '',
        statTotals.totalPoints,
        `${statTotals['FG_Made']}/${statTotals['FG_Made'] + statTotals['FG_Missed']}`,
        `${statTotals.fgPercentage}%`,
        `${statTotals['ThreePT_Made']}/${statTotals['ThreePT_Made'] + statTotals['ThreePT_Missed']}`,
        `${statTotals.threePercentage}%`,
        `${statTotals['FT_Made']}/${statTotals['FT_Made'] + statTotals['FT_Missed']}`,
        `${statTotals.ftPercentage}%`,
        statTotals['Rebounds'],
        statTotals['Assists'],
        statTotals['Steals'],
        statTotals['Blocks'],
        statTotals['Fouls']
      ];
    });
    
    // Create CSV
    const csv = Papa.unparse({
      fields: headers,
      data: rows
    });
    
    // Format file name with game details
    const fileName = `GameStats_vs_${game.opponent.replace(/\s+/g, '_')}_${
      format(new Date(game.date), 'yyyy-MM-dd')
    }.csv`;
    
    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
    
    return { success: true, fileName };
  }
}
