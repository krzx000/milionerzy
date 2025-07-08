"use client";

import * as React from "react";
import { Question as QuestionType } from "@/types/question";
import { ThemeToggle } from "@/components/theme-toggle";
import { QuestionsManagement } from "@/components/questions-management";
import { GameManagement } from "@/components/game-management";
import { CurrentQuestionDisplay } from "@/components/current-question-display";
import { GameHistory } from "@/components/game-history";
import { GameAPI } from "@/lib/api/game";
import type { GameSessionHistory } from "@/lib/api/game";
import { GameSession } from "@/lib/db/game-session";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { GAME_CONSTANTS } from "@/lib/constants/game";

export default function Admin() {
  const { confirm } = useConfirmDialog();
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [questionsLoading, setQuestionsLoading] = React.useState(true);
  const [selectedQuestions, setSelectedQuestions] = React.useState<
    QuestionType[]
  >([]);
  const [isHistoryVisible, setIsHistoryVisible] = React.useState(false);

  // Historia sesji gry
  const [gameHistory, setGameHistory] = React.useState<GameSessionHistory[]>(
    []
  );
  const [historyLoading, setHistoryLoading] = React.useState(false);

  // Stan gry
  const [gameSession, setGameSession] = React.useState<GameSession | null>(
    null
  );
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

  // Pobierz aktualne pytanie
  const currentQuestion =
    (isGameActive || isGameEnded) && questions.length > currentQuestionIndex
      ? questions[currentQuestionIndex]
      : null;

  const showGameStatusMessage = React.useCallback((message: string) => {
    toast.info(message);
  }, []);

  const showSuccessMessage = React.useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorMessage = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  const loadGameSession = React.useCallback(async () => {
    const response = await GameAPI.getCurrentSession();
    if (response.success && response.data) {
      setGameSession(response.data);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setLastAnswerResult(null);
    } else if (response.error) {
      showErrorMessage(response.error);
    }
  }, [showErrorMessage]);

  const loadGameHistory = React.useCallback(async () => {
    setHistoryLoading(true);
    const response = await GameAPI.getHistory(20);
    if (response.success && response.data) {
      setGameHistory(response.data);
    } else {
      showErrorMessage(response.error || "Błąd ładowania historii sesji");
    }
    setHistoryLoading(false);
  }, [showErrorMessage]);

  const handleStartGame = React.useCallback(async () => {
    if (questions.length === 0) {
      showErrorMessage("Nie można rozpocząć gry bez pytań!");
      return;
    }

    setGameLoading(true);
    const response = await GameAPI.startGame();

    if (response.success && response.data) {
      setGameSession(response.data);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setLastAnswerResult(null);
      loadGameHistory();
      showSuccessMessage("🎮 Gra rozpoczęta!");
    } else {
      showErrorMessage(response.error || "Błąd rozpoczynania gry");
    }
    setGameLoading(false);
  }, [questions.length, showErrorMessage, showSuccessMessage, loadGameHistory]);

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
          setSelectedAnswer(null);
          setIsAnswerRevealed(false);
          setLastAnswerResult(null);
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
    showGameStatusMessage,
    showErrorMessage,
    confirm,
    isGameEnded,
    loadGameHistory,
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
    [gameSession, usedLifelines, showGameStatusMessage, showErrorMessage]
  );

  const handleSelectAnswer = React.useCallback(
    (answer: string) => {
      if (!isGameActive || gameLoading || isAnswerRevealed || isGameEnded)
        return;
      setSelectedAnswer(answer);
    },
    [isGameActive, gameLoading, isAnswerRevealed, isGameEnded]
  );

  const handleConfirmAnswer = React.useCallback(async () => {
    if (!selectedAnswer || gameLoading || isAnswerRevealed || isGameEnded)
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
              setSelectedAnswer(null);
              setIsAnswerRevealed(false);
              setLastAnswerResult(null);
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
  }, [
    selectedAnswer,
    gameLoading,
    isAnswerRevealed,
    isGameEnded,
    showGameStatusMessage,
    showSuccessMessage,
    showErrorMessage,
  ]);

  const handleCancelAnswer = React.useCallback(() => {
    setSelectedAnswer(null);
  }, []);

  const handleToggleHistory = React.useCallback(() => {
    setIsHistoryVisible(!isHistoryVisible);
  }, [isHistoryVisible]);

  // Effect do automatycznego przejścia do kolejnego pytania
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
          setSelectedAnswer(null);
          setIsAnswerRevealed(false);
          setLastAnswerResult(null);
        } catch (error) {
          console.error("Error in auto-progress nextQuestion:", error);
        }
      }, GAME_CONSTANTS.AUTO_PROGRESS_TIME * 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isAnswerRevealed, lastAnswerResult, isGameActive, gameLoading]);

  // Ładowanie danych przy inicjalizacji
  React.useEffect(() => {
    loadGameSession();
    loadGameHistory();
  }, [loadGameSession, loadGameHistory]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Fixed theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full flex min-h-screen gap-4 p-4">
        {/* Lista pytań + edycja i wgrywanie (duży panel po lewej) */}
        <section className="w-full">
          <QuestionsManagement
            questions={questions}
            loading={questionsLoading}
            isGameActive={isGameActive}
            selectedQuestions={selectedQuestions}
            setQuestions={setQuestions}
            setSelectedQuestions={setSelectedQuestions}
            setLoading={setQuestionsLoading}
            currentQuestion={currentQuestion}
            isAnswerRevealed={isAnswerRevealed}
          />
        </section>

        {/* Ustawienia gry (obok listy pytań) */}
        <section className="w-1/2">
          <GameManagement
            gameSession={gameSession}
            gameLoading={gameLoading}
            questionsCount={questions.length}
            onStartGame={handleStartGame}
            onEndGame={handleEndGame}
            onUseLifeline={handleUseLifeline}
          />
        </section>

        {/* Podgląd aktualnego pytania + opcje odpowiedzi (prawa kolumna, góra) */}
        <section className="w-1/2">
          <CurrentQuestionDisplay
            gameSession={gameSession}
            currentQuestion={currentQuestion}
            questionsCount={questions.length}
            selectedAnswer={selectedAnswer}
            isAnswerRevealed={isAnswerRevealed}
            gameLoading={gameLoading}
            lastAnswerResult={lastAnswerResult}
            onSelectAnswer={handleSelectAnswer}
            onConfirmAnswer={handleConfirmAnswer}
            onCancelAnswer={handleCancelAnswer}
          />
        </section>
      </div>

      {/* Historia sesji gry */}
      <div className="w-full p-4">
        <GameHistory
          gameHistory={gameHistory}
          historyLoading={historyLoading}
          isHistoryVisible={isHistoryVisible}
          onToggleHistory={handleToggleHistory}
        />
      </div>
    </div>
  );
}
