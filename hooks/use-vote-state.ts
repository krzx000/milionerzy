"use client";

import * as React from "react";
import type { VoteSession, VoteStats, VoteOption } from "@/types/voting";
import { VotingAPI, type GameViewerState } from "@/lib/api/voting";
import { getWinningPrize } from "@/lib/utils/prize";
import { useServerSentEvents } from "@/hooks/use-sse";
import type { GameEventType } from "@/types/events";

export interface ViewerState {
  gameState: GameViewerState | null;
  voteSession: VoteSession | null;
  stats: VoteStats | null;
  userVote: VoteOption | null;
  timeRemaining: number;
  canVote: boolean;
  showResults: boolean;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isAnswerRevealed: boolean;
  gameEnded: boolean;
  gameWon: boolean;
  finalAmount: number;
}

export function useVoteState() {
  const [viewerState, setViewerState] = React.useState<ViewerState>({
    gameState: null,
    voteSession: null,
    stats: null,
    userVote: null,
    timeRemaining: 0,
    canVote: false,
    showResults: false,
    selectedAnswer: null,
    correctAnswer: null,
    isAnswerRevealed: false,
    gameEnded: false,
    gameWon: false,
    finalAmount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [userId] = React.useState(
    () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const [currentQuestionId, setCurrentQuestionId] = React.useState<
    string | null
  >(null);

  const [isGameStateCollapsed, setIsGameStateCollapsed] = React.useState(false);

  const loadVoteStats = React.useCallback(async () => {
    const response = await VotingAPI.getVoteStats();
    if (response.success && response.data) {
      setViewerState((prev) => ({
        ...prev,
        stats: response.data!,
      }));
    }
  }, []);

  const loadCurrentState = React.useCallback(async () => {
    try {
      console.log("🔄 Ładowanie aktualnego stanu...");
      const response = await VotingAPI.getCurrentVoteSession();
      console.log("📡 API Response:", response);

      if (response.success && response.data) {
        const data = response.data as VoteSession | GameViewerState;

        if ("question" in data) {
          const voteSession = data as VoteSession;
          const now = new Date();
          const endTime = new Date(voteSession.endTime || Date.now());
          const timeRemaining = Math.max(
            0,
            Math.floor((endTime.getTime() - now.getTime()) / 1000)
          );

          console.log("🗳️ Setting VoteSession state:", {
            voteSession,
            timeRemaining,
          });
          setViewerState((prev) => ({
            ...prev,
            gameState: null,
            voteSession,
            timeRemaining,
            canVote:
              voteSession.isActive && timeRemaining > 0 && !prev.userVote,
            showResults: !voteSession.isActive || timeRemaining === 0,
            selectedAnswer: null,
            correctAnswer: null,
            isAnswerRevealed: false,
          }));

          if (!voteSession.isActive || timeRemaining === 0) {
            setTimeout(() => loadVoteStats(), 100);
          }
        } else {
          const gameState = data as GameViewerState;
          console.log("🎮 Setting GameViewerState:", gameState);
          setViewerState((prev) => ({
            ...prev,
            gameState,
            voteSession: gameState.voteSession,
            showResults: false,
            canVote: false,
            stats: null,
            userVote: null,
            timeRemaining: 0,
          }));
        }
      } else {
        console.log("❌ Brak danych z API - czyszczenie stanu");
        setViewerState({
          gameState: null,
          voteSession: null,
          stats: null,
          userVote: null,
          timeRemaining: 0,
          canVote: false,
          showResults: false,
          selectedAnswer: null,
          correctAnswer: null,
          isAnswerRevealed: false,
          gameEnded: false,
          gameWon: false,
          finalAmount: 0,
        });
      }
    } catch (error) {
      console.error("❌ Błąd ładowania stanu:", error);
    } finally {
      setIsLoading(false);
    }
  }, [loadVoteStats]);

  const handleSSEEvent = React.useCallback(
    (eventType: GameEventType, data: Record<string, unknown>) => {
      console.log("📡 SSE Event received:", eventType, data);

      switch (eventType) {
        case "voting-started":
          console.log("🗳️ SSE: Głosowanie rozpoczęte");
          setTimeout(() => loadCurrentState(), 100);
          break;
        case "voting-ended":
          console.log("🏁 SSE: Głosowanie zakończone");
          setViewerState((prev) => ({
            ...prev,
            canVote: false,
            showResults: true,
            timeRemaining: 0,
          }));
          setTimeout(() => loadVoteStats(), 100);
          break;
        case "lifeline-used":
          console.log("🎯 SSE: Koło ratunkowe użyte:", data);
          const lifelineName = data.lifelineName as string;
          if (lifelineName) {
            console.log(`📢 Użyto koła ratunkowego: ${lifelineName}`);
          }
          setTimeout(() => loadCurrentState(), 100);
          break;
        case "question-changed":
          console.log("❓ SSE: Zmiana pytania");
          setViewerState((prev) => ({
            ...prev,
            voteSession: null,
            stats: null,
            userVote: null,
            timeRemaining: 0,
            canVote: false,
            showResults: false,
            selectedAnswer: null,
            correctAnswer: null,
            isAnswerRevealed: false,
            gameEnded: false,
          }));
          setTimeout(() => loadCurrentState(), 200);
          break;
        case "game-ended":
          const endGameWon = data.gameWon as boolean;
          const endFinalAmount = data.finalAmount as number;
          const endReason = data.reason as string;
          console.log("🏁 SSE: Gra zakończona:", {
            gameWon: endGameWon,
            finalAmount: endFinalAmount,
            reason: endReason,
          });

          // Jeśli administrator zamknął sesję manualnie, wyczyść stan i pokaż "brak aktywnej gry"
          if (endReason === "manual") {
            console.log(
              "🔒 Administrator zamknął sesję - powrót do ekranu braku aktywnej gry"
            );
            setViewerState((prev) => ({
              ...prev,
              gameState: null,
              voteSession: null,
              stats: null,
              userVote: null,
              timeRemaining: 0,
              canVote: false,
              showResults: false,
              selectedAnswer: null,
              correctAnswer: null,
              isAnswerRevealed: false,
              gameEnded: false,
              gameWon: false,
              finalAmount: 0,
            }));
          } else {
            // W pozostałych przypadkach pokaż ekran końcowy gry
            setViewerState((prev) => ({
              ...prev,
              voteSession: null,
              canVote: false,
              showResults: false,
              selectedAnswer: null,
              correctAnswer: null,
              isAnswerRevealed: false,
              gameEnded: true,
              gameWon: endGameWon,
              finalAmount: endFinalAmount || 0,
            }));
          }
          break;
        case "vote-stats-updated":
          loadVoteStats();
          break;
        case "answer-selected":
          const selectedAnswer = data.selectedAnswer as string;
          console.log("👆 SSE: Wybrano odpowiedź:", selectedAnswer);
          setViewerState((prev) => ({
            ...prev,
            selectedAnswer,
            isAnswerRevealed: false,
          }));
          break;
        case "answer-revealed":
          const correctAnswer = data.correctAnswer as string;
          const isCorrect = data.isCorrect as boolean;
          const gameWon = data.gameWon as boolean;
          const finalAmount = data.finalAmount as number;
          console.log("✅ SSE: Ujawniono odpowiedź:", {
            correctAnswer,
            isCorrect,
            gameWon,
            finalAmount,
          });

          setViewerState((prev) => ({
            ...prev,
            correctAnswer,
            isAnswerRevealed: true,
          }));

          // Jeśli odpowiedź była niepoprawna, automatycznie przejdź do ekranu końcowego po krótkim opóźnieniu
          if (!isCorrect) {
            setTimeout(() => {
              console.log(
                "🏁 Automatyczne przejście do ekranu zakończenia gry po niepoprawnej odpowiedzi"
              );
              setViewerState((prev) => {
                // Oblicz finalAmount na podstawie aktualnego pytania
                const currentIndex =
                  prev.gameState?.gameSession?.currentQuestionIndex ?? 0;
                const totalQuestions =
                  prev.gameState?.gameSession?.totalQuestions ?? 12;
                const calculatedAmount = getWinningPrize(
                  currentIndex,
                  totalQuestions
                );

                return {
                  ...prev,
                  gameEnded: true,
                  gameWon: false,
                  finalAmount:
                    finalAmount ||
                    parseInt(calculatedAmount.replace(/[^\d]/g, "")) ||
                    0,
                };
              });
            }, 3000); // 3 sekundy opóźnienia, żeby użytkownik zobaczył niepoprawną odpowiedź
          }

          // Jeśli gracz wygrał grę (odpowiedział na wszystkie pytania poprawnie)
          if (gameWon) {
            setTimeout(() => {
              console.log(
                "🏆 Automatyczne przejście do ekranu zakończenia gry po wygraniu"
              );
              setViewerState((prev) => ({
                ...prev,
                gameEnded: true,
                gameWon: true,
                finalAmount: finalAmount || 1000000,
              }));
            }, 3000); // 3 sekundy opóźnienia, żeby użytkownik zobaczył poprawną odpowiedź
          }
          break;
      }
    },
    [loadCurrentState, loadVoteStats]
  );

  const { isConnected } = useServerSentEvents({
    clientType: "voter",
    onEvent: handleSSEEvent,
    onConnect: () => {
      console.log("✅ SSE connected - odświeżam stan");
      setTimeout(() => loadCurrentState(), 100);
    },
    onDisconnect: () => {
      console.log("❌ SSE disconnected");
    },
    onError: (error) => {
      console.error("⚠️ SSE error:", error);
    },
    autoReconnect: true,
    reconnectDelay: 3000,
  });

  const handleVote = React.useCallback(
    async (option: VoteOption) => {
      if (!viewerState.canVote || !viewerState.voteSession) return;

      const response = await VotingAPI.submitVote(option, userId);
      if (response.success) {
        setViewerState((prev) => ({
          ...prev,
          userVote: option,
          canVote: false,
        }));
      }
    },
    [viewerState.canVote, viewerState.voteSession, userId]
  );

  // Timer effect
  React.useEffect(() => {
    if (
      viewerState.voteSession &&
      viewerState.timeRemaining > 0 &&
      viewerState.voteSession.isActive
    ) {
      const timer = setTimeout(() => {
        setViewerState((prev) => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1),
          canVote: prev.timeRemaining > 1 && !prev.userVote,
          showResults: prev.timeRemaining <= 1,
        }));

        if (viewerState.timeRemaining === 1) {
          setTimeout(loadVoteStats, 1000);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    viewerState.voteSession,
    viewerState.timeRemaining,
    viewerState.userVote,
    loadVoteStats,
  ]);

  // Initial load effect
  React.useEffect(() => {
    loadCurrentState();
  }, [loadCurrentState]);

  // Connection polling effect
  React.useEffect(() => {
    if (!isConnected) {
      console.log("⚠️ SSE nie połączone - używam backup polling");
      const pollInterval = setInterval(() => {
        loadCurrentState();
      }, 3000);

      return () => clearInterval(pollInterval);
    }
  }, [isConnected, loadCurrentState]);

  // Heartbeat effect
  React.useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      console.log("💓 Heartbeat - sprawdzam aktualność stanu");
      loadCurrentState();
    }, 10000);

    return () => clearInterval(heartbeatInterval);
  }, [loadCurrentState]);

  // Debug logging effect
  React.useEffect(() => {
    console.log("📊 ViewerState changed:", {
      gameState: !!viewerState.gameState,
      voteSession: !!viewerState.voteSession,
      showResults: viewerState.showResults,
      stats: !!viewerState.stats,
      userVote: viewerState.userVote,
      canVote: viewerState.canVote,
      timeRemaining: viewerState.timeRemaining,
      isLoading: isLoading,
      currentQuestionId: currentQuestionId,
      selectedAnswer: viewerState.selectedAnswer,
      correctAnswer: viewerState.correctAnswer,
      isAnswerRevealed: viewerState.isAnswerRevealed,
      isConnected: isConnected,
    });
  }, [viewerState, isLoading, currentQuestionId, isConnected]);

  // Question change effect
  React.useEffect(() => {
    const questionId =
      viewerState.voteSession?.questionId ||
      viewerState.gameState?.currentQuestion?.id;

    if (questionId && currentQuestionId && questionId !== currentQuestionId) {
      setViewerState((prev) => ({
        ...prev,
        userVote: null,
        stats: null,
        showResults: false,
        canVote: false,
        selectedAnswer: null,
        correctAnswer: null,
        isAnswerRevealed: false,
        gameEnded: false,
      }));
    }

    setCurrentQuestionId(questionId || null);
  }, [
    viewerState.voteSession?.questionId,
    viewerState.gameState?.currentQuestion?.id,
    currentQuestionId,
  ]);

  return {
    viewerState,
    isLoading,
    userId,
    currentQuestionId,
    isGameStateCollapsed,
    setIsGameStateCollapsed,
    isConnected,
    handleVote,
    loadCurrentState,
    loadVoteStats,
  };
}
