
import { useMemo, useState } from 'react';
import { Player } from '@/types';

export const usePlayerSorting = (players: Player[]) => {
  const [sortByJersey, setSortByJersey] = useState(false);

  const sortedPlayers = useMemo(() => {
    if (!sortByJersey) {
      return players;
    }

    return [...players].sort((a, b) => {
      // Players with jersey numbers come first
      const aHasNumber = a.playerNumber && a.playerNumber !== "";
      const bHasNumber = b.playerNumber && b.playerNumber !== "";
      
      if (aHasNumber && !bHasNumber) return -1;
      if (!aHasNumber && bHasNumber) return 1;
      if (!aHasNumber && !bHasNumber) {
        // Both without numbers, sort by name
        return a.name.localeCompare(b.name);
      }
      
      // Both have numbers, sort numerically
      const numA = parseInt(a.playerNumber || "999");
      const numB = parseInt(b.playerNumber || "999");
      return numA - numB;
    });
  }, [players, sortByJersey]);

  return {
    sortedPlayers,
    sortByJersey,
    setSortByJersey
  };
};
