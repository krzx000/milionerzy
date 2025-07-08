import * as React from "react";
import { GameAPI } from "@/lib/api/game";
import type { GameSessionHistory } from "@/lib/api/game";
import { toast } from "sonner";

export function useGameHistory() {
  const [gameHistory, setGameHistory] = React.useState<GameSessionHistory[]>(
    []
  );
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = React.useState(false);

  const loadGameHistory = React.useCallback(async () => {
    setHistoryLoading(true);

    const response = await GameAPI.getHistory(20);

    if (response.success && response.data) {
      setGameHistory(response.data);
    } else {
      toast.error(response.error || "Błąd ładowania historii sesji");
    }

    setHistoryLoading(false);
  }, []);

  return {
    gameHistory,
    historyLoading,
    isHistoryVisible,
    setIsHistoryVisible,
    loadGameHistory,
  };
}
