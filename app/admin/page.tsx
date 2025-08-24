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
import { GameSessionWithQuestions } from "@/lib/db/game-session";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ConnectionBadge } from "@/components/ui/connection-badge";
import { useServerSentEvents } from "@/hooks/use-sse";
import type { GameEventType } from "@/types/events";
import { AuthGuard } from "@/components/auth/AuthGuard";

function AdminPanel() {
  const { confirm, dialog } = useConfirmDialog();
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
    "wrong_answer" | "game_won" | null
  >(null);

  // Stan głosowania
  const [voteResults, setVoteResults] = React.useState<{
    totalVotes: number;
    results: Record<string, { count: number; percentage: number }>;
  } | null>(null);
  const [showVoteResults, setShowVoteResults] = React.useState(false);
  const [isVotingActive, setIsVotingActive] = React.useState(false);

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

  // Sprawdź czy dla aktualnego pytania było głosowanie publiczności
  const hasVoteResultsForCurrentQuestion = React.useMemo(() => {
    if (!gameSession?.audienceVoteQuestions) return false;
    return gameSession.audienceVoteQuestions.includes(currentQuestionIndex);
  }, [gameSession?.audienceVoteQuestions, currentQuestionIndex]);

  // Pobierz aktualne pytanie - używaj pytań z sesji jeśli dostępne, inaczej z globalnej listy
  const currentQuestion = React.useMemo(() => {
    if ((isGameActive || isGameEnded) && gameSession?.questions) {
      // Użyj pytań z sesji (w losowej kolejności)
      return gameSession.questions[currentQuestionIndex] || null;
    } else if (
      (isGameActive || isGameEnded) &&
      questions.length > currentQuestionIndex
    ) {
      // Fallback na globalną listę pytań
      return questions[currentQuestionIndex];
    }
    return null;
  }, [
    isGameActive,
    isGameEnded,
    gameSession?.questions,
    currentQuestionIndex,
    questions,
  ]);

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

  // Obsługa eventów SSE
  const handleSSEEvent = React.useCallback(
    (eventType: GameEventType, data: Record<string, unknown>) => {
      console.log("Admin SSE Event received:", eventType, data);

      switch (eventType) {
        case "voting-started":
          setIsVotingActive(true);
          showGameStatusMessage("📊 Głosowanie rozpoczęte!");
          // Odśwież sesję gry aby zaktualizować stan
          loadGameSession();
          break;
        case "voting-ended":
          setIsVotingActive(false);
          const reason = data.reason as string;
          if (reason === "timeout") {
            showGameStatusMessage("⏰ Głosowanie zakończone - upłynął czas");
          } else if (reason === "manual") {
            showGameStatusMessage("⏹️ Głosowanie zakończone ręcznie");
          } else {
            showGameStatusMessage("✅ Głosowanie zakończone");
          }
          // Odśwież sesję gry aby zaktualizować stan
          loadGameSession();
          break;
        case "question-changed":
          // Nowe pytanie - odśwież wszystko
          setIsVotingActive(false);
          setVoteResults(null);
          setShowVoteResults(false);
          loadGameSession();
          break;
        case "game-ended":
          // Gra się skończyła
          setIsVotingActive(false);
          setVoteResults(null);
          setShowVoteResults(false);
          loadGameSession();
          break;
      }
    },
    [showGameStatusMessage, loadGameSession]
  );

  // Konfiguracja SSE
  const { isConnected } = useServerSentEvents({
    clientType: "admin",
    onEvent: handleSSEEvent,
    onConnect: () => {
      console.log("Admin SSE connected");
    },
    onDisconnect: () => {
      console.log("Admin SSE disconnected");
    },
    onError: (error) => {
      console.error("Admin SSE error:", error);
    },
    autoReconnect: true,
    reconnectDelay: 3000,
  });

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

    if (questions.length < 12) {
      showErrorMessage(
        `Potrzeba minimum 12 pytań do rozpoczęcia gry. Masz tylko ${questions.length} pytań.`
      );
      return;
    }

    setGameLoading(true);
    const response = await GameAPI.startGame();

    if (response.success && response.data) {
      // Po uruchomieniu gry, pobierz pełną sesję z pytaniami
      await loadGameSession();
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setLastAnswerResult(null);
      loadGameHistory();
      showSuccessMessage("🎮 Gra rozpoczęta!");
    } else {
      showErrorMessage(response.error || "Błąd rozpoczynania gry");
    }
    setGameLoading(false);
  }, [
    questions.length,
    showErrorMessage,
    showSuccessMessage,
    loadGameHistory,
    loadGameSession,
  ]);

  // Funkcja do zamknięcia sesji (usunięcie sesji)
  const handleEndGame = React.useCallback(async () => {
    try {
      const confirmed = await confirm({
        title: "Zamknąć sesję?",
        description:
          "Czy na pewno chcesz zamknąć tę sesję? Sesja zostanie przeniesiona do historii i nie będzie już pokazywana w panelu gry.",
        confirmText: "Zamknij sesję",
        cancelText: "Anuluj",
        variant: "destructive",
      });

      if (confirmed) {
        setGameLoading(true);

        const response = await GameAPI.endGame();

        if (response.success) {
          setGameSession(null);
          setSelectedAnswer(null);
          setIsAnswerRevealed(false);
          setLastAnswerResult(null);
          setGameEndReason(null);
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
    showGameStatusMessage,
    showErrorMessage,
    loadGameHistory,
    setGameEndReason,
  ]);

  // Funkcja do masowego usuwania wszystkich sesji
  const handleClearAllSessions = React.useCallback(async () => {
    try {
      const confirmed = await confirm({
        title: "Usunąć wszystkie sesje?",
        description:
          "Czy na pewno chcesz usunąć WSZYSTKIE sesje z bazy danych? Ta operacja jest nieodwracalna i usuwa całą historię gier.",
        confirmText: "Usuń wszystkie",
        cancelText: "Anuluj",
        variant: "destructive",
      });

      if (confirmed) {
        setHistoryLoading(true);

        const response = await GameAPI.clearAllSessions();

        if (response.success) {
          setGameHistory([]);
          setGameSession(null);
          setSelectedAnswer(null);
          setIsAnswerRevealed(false);
          setLastAnswerResult(null);
          setGameEndReason(null);
          const deletedCount = response.data?.deletedCount || 0;
          showSuccessMessage(`🗑️ Usunięto ${deletedCount} sesji z bazy danych`);
        } else {
          showErrorMessage(response.error || "Błąd usuwania sesji");
        }
        setHistoryLoading(false);
      }
    } catch (error) {
      console.error("handleClearAllSessions: Exception:", error);
      setHistoryLoading(false);
    }
  }, [
    confirm,
    showSuccessMessage,
    showErrorMessage,
    setGameSession,
    setGameHistory,
    setGameEndReason,
  ]);

  const handleUseLifeline = React.useCallback(
    async (lifelineType: keyof typeof usedLifelines) => {
      if (!gameSession || usedLifelines[lifelineType]) return;

      try {
        const lifelineName = GAME_CONSTANTS.LIFELINE_NAMES[lifelineType];
        const confirmed = await confirm({
          title: "Użyć koła ratunkowego?",
          description: `Czy na pewno chcesz użyć koła ratunkowego "${lifelineName}"? Po użyciu nie będzie można go użyć ponownie w tej grze.`,
          confirmText: `Użyj ${lifelineName}`,
          cancelText: "Anuluj",
          variant: "default",
        });

        if (confirmed) {
          setGameLoading(true);
          const response = await GameAPI.activateLifeline(lifelineType);

          if (response.success && response.data) {
            // Po użyciu koła ratunkowego, ponownie załaduj pełną sesję z pytaniami
            // żeby nie stracić listy pytań (use-lifeline zwraca tylko podstawową sesję)
            await loadGameSession();

            // Jeśli użyto koła "Pytanie do publiczności", ustaw stan głosowania jako aktywne
            if (lifelineType === "askAudience") {
              setIsVotingActive(true);
            }

            showGameStatusMessage(`✅ Użyto koła ratunkowego: ${lifelineName}`);
          } else {
            showErrorMessage(response.error || "Błąd użycia koła ratunkowego");
          }
          setGameLoading(false);
        }
      } catch (error) {
        console.error("handleUseLifeline: Exception:", error);
        setGameLoading(false);
      }
    },
    [
      gameSession,
      usedLifelines,
      showGameStatusMessage,
      showErrorMessage,
      loadGameSession,
      confirm,
      setIsVotingActive,
    ]
  );

  const handleSelectAnswer = React.useCallback(
    (answer: string) => {
      console.log("handleSelectAnswer called with:", answer);
      console.log("Current state:", {
        isGameActive,
        gameLoading,
        isAnswerRevealed,
        isGameEnded,
        "lastAnswerResult?.gameWon": lastAnswerResult?.gameWon,
      });

      if (
        !isGameActive ||
        gameLoading ||
        isAnswerRevealed ||
        isGameEnded ||
        lastAnswerResult?.gameWon
      ) {
        console.log("handleSelectAnswer: condition failed, returning early");
        return;
      }

      console.log("handleSelectAnswer: setting selected answer to:", answer);
      setSelectedAnswer(answer);
    },
    [
      isGameActive,
      gameLoading,
      isAnswerRevealed,
      isGameEnded,
      lastAnswerResult?.gameWon,
    ]
  );

  const handleConfirmAnswer = React.useCallback(async () => {
    if (
      !selectedAnswer ||
      gameLoading ||
      isAnswerRevealed ||
      isGameEnded ||
      lastAnswerResult?.gameWon
    )
      return;

    setGameLoading(true);
    showGameStatusMessage("📝 Zatwierdzenie odpowiedzi...");

    // Krok 1: Zatwierdź wybór odpowiedzi (pokaż widowni wybraną odpowiedź)
    const selectResponse = await GameAPI.selectAnswer(selectedAnswer);
    if (!selectResponse.success) {
      showErrorMessage(selectResponse.error || "Błąd zatwierdzania odpowiedzi");
      setGameLoading(false);
      return;
    }

    // Opóźnienie przed ujawnieniem poprawnej odpowiedzi
    showGameStatusMessage("🎵 Sprawdzanie odpowiedzi...");

    setTimeout(async () => {
      // Krok 2: Sprawdź odpowiedź (pokaż wynik)
      const response = await GameAPI.submitAnswer(selectedAnswer);

      if (response.success && response.data) {
        const responseData = response.data;
        const correct = responseData.correct;
        const correctAnswer = responseData.correctAnswer;
        const gameWon = responseData.gameWon;

        // Odśwież sesję, aby pobrać aktualne dane z pytaniami
        await loadGameSession();
        setIsAnswerRevealed(true);
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

            setTimeout(() => {
              setSelectedAnswer(null);
              setIsAnswerRevealed(false);
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
    lastAnswerResult?.gameWon,
    loadGameSession,
    showGameStatusMessage,
    showSuccessMessage,
    showErrorMessage,
    setGameEndReason,
  ]);

  const handleCancelAnswer = React.useCallback(() => {
    setSelectedAnswer(null);
  }, []);

  // Funkcja do pobierania wyników głosowania
  const handleShowVoteResults = React.useCallback(async () => {
    try {
      const response = await fetch("/api/voting/stats");
      if (response.ok) {
        const stats = await response.json();
        if (stats.totalVotes > 0) {
          setVoteResults(stats);
          setShowVoteResults(true);
          showGameStatusMessage("📊 Pobrano wyniki głosowania");
        } else {
          showErrorMessage("Brak wyników głosowania do wyświetlenia");
        }
      } else {
        showErrorMessage("Brak dostępnych wyników głosowania");
      }
    } catch {
      showErrorMessage("Błąd pobierania wyników głosowania");
    }
  }, [showGameStatusMessage, showErrorMessage]);

  const handleToggleHistory = React.useCallback(() => {
    setIsHistoryVisible(!isHistoryVisible);
  }, [isHistoryVisible]);

  // Funkcja do kończenia głosowania przez admina
  const handleEndVoting = React.useCallback(async () => {
    try {
      const response = await fetch("/api/voting/end", {
        method: "POST",
      });

      if (response.ok) {
        setIsVotingActive(false);
        showGameStatusMessage("⏹️ Głosowanie zostało zakończone");
      } else {
        const error = await response.json();
        showErrorMessage(error.error || "Błąd kończenia głosowania");
      }
    } catch {
      showErrorMessage("Błąd kończenia głosowania");
    }
  }, [showGameStatusMessage, showErrorMessage]);

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
            // Odśwież sesję, aby pobrać aktualne dane z pytaniami
            await loadGameSession();
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
  }, [
    isAnswerRevealed,
    lastAnswerResult,
    isGameActive,
    gameLoading,
    loadGameSession,
  ]);

  // Ładowanie danych przy inicjalizacji
  React.useEffect(() => {
    loadGameSession();
    loadGameHistory();
  }, [loadGameSession, loadGameHistory]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Fixed theme toggle and debug */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <ThemeToggle />
        {/* Wskaźnik połączenia SSE */}
        <ConnectionBadge isConnected={isConnected} />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-screen">
        {/* Lista pytań + edycja i wgrywanie (lewa kolumna) */}
        <section className="md:col-span-2 lg:col-span-1 order-1">
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

        {/* Ustawienia gry (środkowa kolumna) */}
        <section className="md:col-span-1 lg:col-span-1 order-2">
          <GameManagement
            gameSession={gameSession}
            gameLoading={gameLoading}
            questionsCount={gameSession?.totalQuestions || questions.length}
            onStartGame={handleStartGame}
            onEndGame={handleEndGame}
            onUseLifeline={handleUseLifeline}
            onShowVoteResults={handleShowVoteResults}
            onEndVoting={handleEndVoting}
            hasVoteResults={hasVoteResultsForCurrentQuestion}
            isVotingActive={isVotingActive}
          />
        </section>

        {/* Podgląd aktualnego pytania + opcje odpowiedzi (prawa kolumna) */}
        <section className="md:col-span-1 lg:col-span-1 order-3">
          <CurrentQuestionDisplay
            gameSession={gameSession}
            currentQuestion={currentQuestion}
            questionsCount={gameSession?.totalQuestions || questions.length}
            selectedAnswer={selectedAnswer}
            isAnswerRevealed={isAnswerRevealed}
            gameLoading={gameLoading}
            lastAnswerResult={lastAnswerResult}
            gameEndReason={gameEndReason}
            onSelectAnswer={handleSelectAnswer}
            onConfirmAnswer={handleConfirmAnswer}
            onCancelAnswer={handleCancelAnswer}
          />
        </section>
      </div>

      {/* Wyniki głosowania */}
      <Dialog open={showVoteResults} onOpenChange={setShowVoteResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              📊 Wyniki głosowania publiczności
            </DialogTitle>
          </DialogHeader>

          {voteResults && (
            <div className="space-y-6">
              {/* Łączna liczba głosów */}
              <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {voteResults.totalVotes}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Łącznie głosów
                </p>
              </div>

              {/* Wyniki dla każdej opcji */}
              <div className="space-y-4">
                {Object.entries(voteResults.results)
                  .sort(([, a], [, b]) => b.percentage - a.percentage)
                  .map(([option, result]) => (
                    <div
                      key={option}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold">
                          Odpowiedź {option}.
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {result.percentage}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.count} głosów
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="relative">
                        <Progress
                          value={result.percentage}
                          className="h-3 bg-gray-200 dark:bg-gray-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-white mix-blend-difference">
                            {result.percentage > 5
                              ? `${result.percentage}%`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Przycisk zamknij */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setShowVoteResults(false)}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Zamknij wyniki
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Historia sesji gry */}
      <div className="w-full p-4 pt-0">
        <GameHistory
          gameHistory={gameHistory}
          historyLoading={historyLoading}
          isHistoryVisible={isHistoryVisible}
          onToggleHistory={handleToggleHistory}
          onClearAllSessions={handleClearAllSessions}
        />
      </div>

      {dialog}
    </div>
  );
}

export default function Admin() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminPanel />
    </AuthGuard>
  );
}
