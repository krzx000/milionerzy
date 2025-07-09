import * as React from "react";
import { GameAPI } from "@/lib/api/game";
import { GameSessionWithQuestions } from "@/lib/db/game-session";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import { toast } from "sonner";

export function useGameManagement() {
  const [gameSession, setGameSession] =
    React.useState<GameSessionWithQuestions | null>(null);
  const [gameLoading, setGameLoading] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(
    null
  );
  const [isAnswerRevealed, setIsAnswerRevealed] = React.useState(false);
  const [lastAnswerResult, setLastAnswerResult] = React.useState<{
    correct: boolean;
    gameWon: boolean;
    correctAnswer?: string;
  } | null>(null);
  const [gameEndReason, setGameEndReason] = React.useState<
    "wrong_answer" | "game_won" | "admin_stopped" | null
  >(null);

  // Computed values
  const isGameActive = gameSession?.status === "active";
  const isGameEnded = gameSession?.status === "finished";
  const currentQuestionIndex = gameSession?.currentQuestionIndex || 0;
  const usedLifelines = React.useMemo(
    () =>
      gameSession?.usedLifelines || {
        fiftyFifty: false,
        phoneAFriend: false,
        askAudience: false,
      },
    [gameSession?.usedLifelines]
  );

  // Toast helpers
  const showGameStatusMessage = React.useCallback((message: string) => {
    toast.info(message);
  }, []);

  const showSuccessMessage = React.useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorMessage = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  // Prize calculation helpers
  const getCurrentPrize = React.useCallback(() => {
    return (
      GAME_CONSTANTS.PRIZE_AMOUNTS[
        Math.min(currentQuestionIndex, GAME_CONSTANTS.PRIZE_AMOUNTS.length - 1)
      ] || "0 zł"
    );
  }, [currentQuestionIndex]);

  const getWinningPrize = React.useCallback(() => {
    if (currentQuestionIndex === 0) {
      return "0 zł";
    }
    const winningIndex = currentQuestionIndex - 1;
    return GAME_CONSTANTS.PRIZE_AMOUNTS[winningIndex] || "0 zł";
  }, [currentQuestionIndex]);

  // Load game session
  const loadGameSession = React.useCallback(async () => {
    const response = await GameAPI.getCurrentSession();

    if (response.success && response.data) {
      setGameSession(response.data);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setLastAnswerResult(null);
      setGameEndReason(null);
    } else if (response.error) {
      showErrorMessage(response.error);
    }
  }, [showErrorMessage]);

  // Reset game state
  const resetGameState = React.useCallback(() => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setLastAnswerResult(null);
    setGameEndReason(null);
  }, []);

  return {
    // State
    gameSession,
    gameLoading,
    selectedAnswer,
    isAnswerRevealed,
    lastAnswerResult,
    gameEndReason,

    // Computed values
    isGameActive,
    isGameEnded,
    currentQuestionIndex,
    usedLifelines,

    // Helpers
    getCurrentPrize,
    getWinningPrize,
    showGameStatusMessage,
    showSuccessMessage,
    showErrorMessage,

    // Actions
    setGameSession,
    setGameLoading,
    setSelectedAnswer,
    setIsAnswerRevealed,
    setLastAnswerResult,
    setGameEndReason,
    loadGameSession,
    resetGameState,
  };
}
