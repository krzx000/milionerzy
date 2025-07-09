import * as React from "react";
import { GameAPI } from "@/lib/api/game";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import { useGameManagement } from "./use-game-management";
import { useConfirmDialog } from "./use-confirm-dialog";
import { Question as QuestionType } from "@/types/question";

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
    gameEndReason,
    isGameActive,
    isGameEnded,
    usedLifelines,
    setGameSession,
    setGameLoading,
    setSelectedAnswer,
    setIsAnswerRevealed,
    setLastAnswerResult,
    setGameEndReason,
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

    if (questionsCount < 12) {
      showErrorMessage(
        `Potrzeba minimum 12 pytań do rozpoczęcia gry. Masz tylko ${questionsCount} pytań.`
      );
      return;
    }

    setGameLoading(true);

    const response = await GameAPI.startGame();

    if (response.success && response.data) {
      // Po uruchomieniu gry, pobierz pełną sesję z pytaniami
      await loadGameSession();
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
    loadGameSession,
    setGameLoading,
    resetGameState,
  ]);

  const handleEndGame = React.useCallback(async () => {
    try {
      const confirmed = await confirm({
        title: "Zamknąć sesję?",
        description:
          "Czy na pewno chcesz zamknąć tę sesję? Sesja zostanie usunięta i nie będzie już można jej przywrócić.",
        confirmText: "Zamknij sesję",
        cancelText: "Anuluj",
        variant: "destructive",
      });

      if (confirmed) {
        setGameLoading(true);

        const response = await GameAPI.endGame();

        if (response.success) {
          setGameSession(null);
          resetGameState();
          loadGameHistory();
          showGameStatusMessage("🛑 Sesja gry została zamknięta!");
        } else {
          showErrorMessage(response.error || "Błąd zamykania sesji");
        }

        setGameLoading(false);
      }
    } catch (error) {
      console.error("handleEndGame: Exception:", error);
      setGameLoading(false);
    }
  }, [
    confirm,
    setGameLoading,
    resetGameState,
    loadGameHistory,
    showGameStatusMessage,
    showErrorMessage,
    setGameSession,
  ]);

  const handleUseLifeline = React.useCallback(
    async (lifelineType: keyof typeof usedLifelines) => {
      if (!gameSession || usedLifelines[lifelineType]) return;

      setGameLoading(true);

      const response = await GameAPI.activateLifeline(lifelineType);

      if (response.success && response.data) {
        // Odśwież sesję, aby pobrać aktualne dane
        await loadGameSession();
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
      loadGameSession,
      setGameLoading,
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

          // WAŻNE: Natychmiast ustaw isAnswerRevealed, aby zablokować możliwość klikania
          setIsAnswerRevealed(true);

          // Jeśli odpowiedź kończy grę (wygrana lub przegrana), natychmiast zmień status
          if (gameWon || !correct) {
            // Ręcznie ustawiamy status na "finished", aby natychmiast wyłączyć przyciski
            if (gameSession) {
              setGameSession({
                ...gameSession,
                status: "finished",
              });
            }
          }

          // Ustaw wynik ostatniej odpowiedzi
          setLastAnswerResult({
            correct: correct || false,
            gameWon: gameWon || false,
            correctAnswer: correctAnswer,
          });

          // Ustaw powód zakończenia gry
          if (gameWon) {
            setGameEndReason("game_won");
          } else if (!correct) {
            setGameEndReason("wrong_answer");
          }

          setGameLoading(false);

          if (correct) {
            if (gameWon) {
              showSuccessMessage("Gratulacje! Gracz wygrał wszystkie pytania!");
              showGameStatusMessage(
                "Gra zakończona! Gracz wygrał główną nagrodę!"
              );

              // Gra zostanie automatycznie zakończona przez backend
              // Odśwież sesję aby pobrać aktualny status
              setTimeout(async () => {
                await loadGameSession();
              }, 500);

              setSelectedAnswer(null);
            } else {
              showSuccessMessage("Poprawna odpowiedź!");
            }
          } else {
            showErrorMessage(
              `Niepoprawna odpowiedź! Poprawna odpowiedź to: ${correctAnswer}.`
            );
            showGameStatusMessage("Gra zakończona! Gracz przegrał.");

            // Gra zostanie automatycznie zakończona przez backend
            // Odśwież sesję aby pobrać aktualny status
            setTimeout(async () => {
              await loadGameSession();
            }, 500);

            setSelectedAnswer(null);
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
      loadGameSession,
      setGameLoading,
      setIsAnswerRevealed,
      setLastAnswerResult,
      setGameEndReason,
      showGameStatusMessage,
      showSuccessMessage,
      showErrorMessage,
      gameSession,
      setGameSession,
      setSelectedAnswer,
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
            // Odśwież sesję, aby pobrać aktualne dane z pytaniami
            await loadGameSession();
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
    loadGameSession,
    resetGameState,
  ]);

  return {
    gameSession,
    gameLoading,
    selectedAnswer,
    isAnswerRevealed,
    lastAnswerResult,
    gameEndReason,
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
