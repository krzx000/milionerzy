import * as React from "react";
import { GameAPI } from "@/lib/api/game";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import { useGameManagement } from "./use-game-management";
import { useConfirmDialog } from "./use-confirm-dialog";
import { Question as QuestionType } from "@/types/question";
import { GameSession } from "@/lib/db/game-session";

export function useGameLogic(
  questionsCount: number,
  loadGameHistory: () => void
) {
  const { confirm } = useConfirmDialog();
  const {
    gameSession,
    gameLoading,
    selectedAnswer,
    isAnswerRevealed,
    lastAnswerResult,
    isGameActive,
    isGameEnded,
    usedLifelines,
    setGameSession,
    setGameLoading,
    setSelectedAnswer,
    setIsAnswerRevealed,
    setLastAnswerResult,
    resetGameState,
    showGameStatusMessage,
    showSuccessMessage,
    showErrorMessage,
    loadGameSession,
    getCurrentPrize,
    getWinningPrize,
  } = useGameManagement();

  const handleStartGame = React.useCallback(async () => {
    if (questionsCount === 0) {
      showErrorMessage("Nie można rozpocząć gry bez pytań!");
      return;
    }

    setGameLoading(true);

    const response = await GameAPI.startGame();

    if (response.success && response.data) {
      setGameSession(response.data);
      resetGameState();
      loadGameHistory();
      showSuccessMessage("🎮 Gra rozpoczęta!");
    } else {
      showErrorMessage(response.error || "Błąd rozpoczynania gry");
    }

    setGameLoading(false);
  }, [
    questionsCount,
    showErrorMessage,
    showSuccessMessage,
    loadGameHistory,
    setGameLoading,
    setGameSession,
    resetGameState,
  ]);

  const handleEndGame = React.useCallback(async () => {
    try {
      const confirmed = await confirm({
        title: "Zakończyć grę?",
        description:
          "Czy na pewno chcesz zakończyć grę? Sesja zostanie zamknięta.",
        confirmText: isGameEnded ? "Zamknij sesję" : "Zakończ grę",
        cancelText: "Anuluj",
        variant: "destructive",
      });

      if (confirmed) {
        setGameLoading(true);

        const response = await GameAPI.endGame();

        if (response.success && response.data) {
          setGameSession(null);
          resetGameState();
          loadGameHistory();
          showGameStatusMessage("🛑 Sesja gry zamknięta!");
        } else {
          showErrorMessage(response.error || "Błąd kończenia gry");
        }

        setGameLoading(false);
      }
    } catch (error) {
      console.error("handleEndGame: Exception:", error);
      setGameLoading(false);
    }
  }, [
    confirm,
    isGameEnded,
    setGameLoading,
    setGameSession,
    resetGameState,
    loadGameHistory,
    showGameStatusMessage,
    showErrorMessage,
  ]);

  const handleUseLifeline = React.useCallback(
    async (lifelineType: keyof typeof usedLifelines) => {
      if (!gameSession || usedLifelines[lifelineType]) return;

      setGameLoading(true);

      const response = await GameAPI.activateLifeline(lifelineType);

      if (response.success && response.data) {
        setGameSession(response.data);
        showGameStatusMessage(
          `Użyto koła ratunkowego: ${GAME_CONSTANTS.LIFELINE_NAMES[lifelineType]}`
        );
      } else {
        showErrorMessage(response.error || "Błąd użycia koła ratunkowego");
      }

      setGameLoading(false);
    },
    [
      gameSession,
      usedLifelines,
      setGameLoading,
      setGameSession,
      showGameStatusMessage,
      showErrorMessage,
    ]
  );

  const handleSelectAnswer = React.useCallback(
    (answer: string, currentQuestion: QuestionType | null) => {
      if (!currentQuestion || gameLoading || isAnswerRevealed || isGameEnded)
        return;
      setSelectedAnswer(answer);
    },
    [gameLoading, isAnswerRevealed, isGameEnded, setSelectedAnswer]
  );

  const handleConfirmAnswer = React.useCallback(
    async (currentQuestion: QuestionType | null) => {
      if (
        !currentQuestion ||
        !selectedAnswer ||
        gameLoading ||
        isAnswerRevealed ||
        isGameEnded
      )
        return;

      setGameLoading(true);

      showGameStatusMessage("🎵 Sprawdzanie odpowiedzi...");

      setTimeout(async () => {
        const response = await GameAPI.submitAnswer(selectedAnswer);

        if (response.success && response.data) {
          const responseData = response.data;
          const correct = responseData.correct;
          const correctAnswer = responseData.correctAnswer;
          const gameWon = responseData.gameWon;

          setGameSession(responseData as GameSession);
          setIsAnswerRevealed(true);
          setLastAnswerResult({
            correct: correct || false,
            gameWon: gameWon || false,
            correctAnswer: correctAnswer,
          });

          setGameLoading(false);

          if (correct) {
            if (gameWon) {
              showSuccessMessage("Gratulacje! Gracz wygrał wszystkie pytania!");
              setTimeout(() => {
                resetGameState();
              }, 3000);
            } else {
              showSuccessMessage("Poprawna odpowiedź!");
            }
          } else {
            showErrorMessage(
              `Niepoprawna odpowiedź! Poprawna odpowiedź to: ${correctAnswer}.`
            );
          }
        } else {
          showErrorMessage(response.error || "Błąd wysyłania odpowiedzi");
          setGameLoading(false);
        }
      }, GAME_CONSTANTS.ANSWER_CHECK_DELAY);
    },
    [
      selectedAnswer,
      gameLoading,
      isAnswerRevealed,
      isGameEnded,
      setGameLoading,
      setGameSession,
      setIsAnswerRevealed,
      setLastAnswerResult,
      resetGameState,
      showGameStatusMessage,
      showSuccessMessage,
      showErrorMessage,
    ]
  );

  // Auto-progress effect
  React.useEffect(() => {
    if (
      isAnswerRevealed &&
      lastAnswerResult?.correct &&
      !lastAnswerResult?.gameWon &&
      isGameActive &&
      !gameLoading
    ) {
      const timeoutId = setTimeout(async () => {
        try {
          const nextResponse = await GameAPI.nextQuestion();
          if (nextResponse.success && nextResponse.data) {
            setGameSession(nextResponse.data);
          }
          resetGameState();
        } catch (error) {
          console.error("Error in auto-progress nextQuestion:", error);
        }
      }, GAME_CONSTANTS.AUTO_PROGRESS_TIME * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    isAnswerRevealed,
    lastAnswerResult,
    isGameActive,
    gameLoading,
    setGameSession,
    resetGameState,
  ]);

  return {
    gameSession,
    gameLoading,
    selectedAnswer,
    isAnswerRevealed,
    lastAnswerResult,
    isGameActive,
    isGameEnded,
    usedLifelines,
    handleStartGame,
    handleEndGame,
    handleUseLifeline,
    handleSelectAnswer,
    handleConfirmAnswer,
    setSelectedAnswer,
    loadGameSession,
    getCurrentPrize,
    getWinningPrize,
  };
}
