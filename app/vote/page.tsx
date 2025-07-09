"use client";

import * as React from "react";
import type { VoteSession, VoteStats, VoteOption } from "@/types/voting";
import { VotingAPI, type GameViewerState } from "@/lib/api/voting";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import { getWinningPrize } from "@/lib/utils/prize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Users,
  Trophy,
  PlayCircle,
  Wifi,
  WifiOff,
  Phone,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useServerSentEvents } from "@/hooks/use-sse";
import type { GameEventType } from "@/types/events";

interface ViewerState {
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

export default function VotePage() {
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

  React.useEffect(() => {
    loadCurrentState();
  }, [loadCurrentState]);

  React.useEffect(() => {
    if (!isConnected) {
      console.log("⚠️ SSE nie połączone - używam backup polling");
      const pollInterval = setInterval(() => {
        loadCurrentState();
      }, 3000);

      return () => clearInterval(pollInterval);
    }
  }, [isConnected, loadCurrentState]);

  React.useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      console.log("💓 Heartbeat - sprawdzam aktualność stanu");
      loadCurrentState();
    }, 10000);

    return () => clearInterval(heartbeatInterval);
  }, [loadCurrentState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-80 mx-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <p className="text-lg font-semibold text-gray-700">
                Ładowanie gry...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="max-w-md mx-auto">
        {/* Nagłówek w stylu mobilnej aplikacji */}
        <div className="px-4 pt-6 pb-4">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 text-center justify-center">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-blue-600" />
                </div>
                Milionerzy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center bg-blue-50 rounded-xl p-3">
                <p className="text-sm font-medium text-gray-700">
                  Centrum Widzów - Głosuj na Żywo!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stan gry */}
        {viewerState.gameState && (
          <div className="px-4 pb-4">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm gap-0">
              <CardHeader
                className="cursor-pointer transition-colors duration-200 w-full flex items-center"
                onClick={() => setIsGameStateCollapsed(!isGameStateCollapsed)}
              >
                <CardTitle className="flex items-center justify-between text-base w-full font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-blue-600" />
                    </div>
                    Stan Gry
                  </div>
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center transition-transform duration-200">
                    {isGameStateCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isGameStateCollapsed
                    ? "max-h-0 opacity-0"
                    : "max-h-[1000px] opacity-100"
                }`}
              >
                <CardContent className="space-y-3 py-6">
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              #
                            </span>
                          </div>
                          <span className="text-base font-semibold text-gray-800">
                            Pytanie
                          </span>
                        </div>
                        <span className="text-xl font-semibold text-blue-700">
                          {(viewerState.gameState.gameSession
                            ?.currentQuestionIndex ?? 0) + 1}
                        </span>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              Σ
                            </span>
                          </div>
                          <span className="text-base font-semibold text-gray-800">
                            Łącznie
                          </span>
                        </div>
                        <span className="text-xl font-semibold text-purple-700">
                          {viewerState.gameState.gameSession?.totalQuestions}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Koła ratunkowe */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-center mb-3">
                      <span className="text-base font-semibold text-gray-800">
                        Koła Ratunkowe
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-gray-50 border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              ½
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            50:50
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            viewerState.gameState.gameSession?.usedLifelines
                              .fiftyFifty
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          <span className="text-xs font-medium">
                            {viewerState.gameState.gameSession?.usedLifelines
                              .fiftyFifty
                              ? "Użyte"
                              : "Dostępne"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-gray-50 border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Phone className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            Telefon
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            viewerState.gameState.gameSession?.usedLifelines
                              .phoneAFriend
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          <span className="text-xs font-medium">
                            {viewerState.gameState.gameSession?.usedLifelines
                              .phoneAFriend
                              ? "Użyte"
                              : "Dostępne"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-gray-50 border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <UserCheck className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            Publiczność
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            viewerState.gameState.gameSession?.usedLifelines
                              .askAudience
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          <span className="text-xs font-medium">
                            {viewerState.gameState.gameSession?.usedLifelines
                              .askAudience
                              ? "Użyte"
                              : "Dostępne"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Aktualne pytanie */}
        {(viewerState.gameState?.currentQuestion ||
          viewerState.voteSession?.question) && (
          <div className="px-4 pb-4">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PlayCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    Pytanie
                  </div>
                  {((viewerState.gameState?.gameSession?.hiddenAnswers
                    ?.length || 0) > 0 ||
                    (viewerState.voteSession?.hiddenAnswers?.length || 0) >
                      0) && (
                    <div className="px-2 py-1 rounded-md border-2 bg-red-50 border-red-400">
                      <span className="text-xs font-medium text-red-700">
                        50:50
                      </span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4 bg-yellow-50 rounded-xl p-3">
                  <p className="text-lg font-semibold text-gray-800">
                    {viewerState.voteSession?.question.content ||
                      viewerState.gameState?.currentQuestion?.content}
                  </p>
                </div>

                <div className="space-y-3">
                  {(["A", "B", "C", "D"] as VoteOption[]).map(
                    (option, index) => {
                      const answerText =
                        viewerState.voteSession?.question.answers[option] ||
                        viewerState.gameState?.currentQuestion?.answers[option];
                      const isSelected = viewerState.userVote === option;
                      const canVoteForThis =
                        viewerState.canVote && !viewerState.userVote;

                      const isHidden =
                        viewerState.voteSession?.hiddenAnswers?.includes(
                          option
                        ) ||
                        viewerState.gameState?.gameSession?.hiddenAnswers?.includes(
                          option
                        );

                      const isAdminSelected =
                        viewerState.selectedAnswer === option;
                      const isCorrectAnswer =
                        viewerState.correctAnswer === option;
                      const isRevealed = viewerState.isAnswerRevealed;

                      let votePercentage = 0;
                      let voteCount = 0;

                      if (viewerState.showResults && viewerState.stats) {
                        votePercentage =
                          viewerState.stats.results[option]?.percentage || 0;
                        voteCount =
                          viewerState.stats.results[option]?.count || 0;
                      }

                      const colors = [
                        "bg-blue-600",
                        "bg-orange-500",
                        "bg-purple-600",
                        "bg-teal-600",
                      ];

                      let cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                        canVoteForThis && !isHidden
                          ? "bg-gray-50 border-gray-200 hover:border-gray-300 active:scale-95"
                          : isHidden
                          ? "bg-gray-50 border-gray-200 opacity-20 cursor-not-allowed pointer-events-none"
                          : "bg-gray-50 border-gray-200"
                      }`;

                      if (isSelected) {
                        cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-blue-50 border-blue-400 overflow-hidden`;
                      }

                      if (isAdminSelected && !isRevealed) {
                        cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-yellow-50 border-yellow-400 overflow-hidden`;
                      }

                      if (isRevealed) {
                        if (isCorrectAnswer) {
                          cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-green-50 border-green-400 overflow-hidden`;
                        } else if (isAdminSelected) {
                          cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-red-50 border-red-400 overflow-hidden`;
                        }
                      }

                      return (
                        <div
                          key={option}
                          className={cardClass}
                          onClick={() =>
                            canVoteForThis && !isHidden && handleVote(option)
                          }
                        >
                          {viewerState.showResults && !isHidden && (
                            <div
                              className="absolute inset-0 bg-blue-200 rounded-xl opacity-60 transition-all duration-500"
                              style={{ width: `${votePercentage}%` }}
                            />
                          )}
                          <div className="flex items-center gap-3 relative z-10">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-sm ${colors[index]}`}
                            >
                              {option}
                            </div>
                            <span className="font-medium text-sm text-gray-800">
                              {answerText}
                            </span>
                            {isAdminSelected && !isRevealed && (
                              <span className="text-lg animate-bounce">👆</span>
                            )}
                            {isRevealed && isCorrectAnswer && (
                              <span className="text-lg overflow-hidden">
                                ✅
                              </span>
                            )}
                            {isRevealed &&
                              isAdminSelected &&
                              !isCorrectAnswer && (
                                <span className="text-lg">❌</span>
                              )}
                          </div>
                          {viewerState.showResults && !isHidden && (
                            <div className="relative z-10 text-right">
                              <div className="font-semibold text-base text-gray-800">
                                {votePercentage}%
                              </div>
                              <div className="text-xs text-gray-600">
                                ({voteCount} głosów)
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Głosowanie aktywne */}
        {viewerState.voteSession &&
          viewerState.voteSession.isActive &&
          viewerState.timeRemaining > 0 && (
            <div className="px-4 pb-4">
              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    Głosowanie Aktywne!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white animate-pulse" />
                          </div>
                          <span className="text-base font-semibold text-gray-800">
                            Pozostały czas
                          </span>
                        </div>
                        <span className="text-xl font-semibold text-green-700">
                          {formatTime(viewerState.timeRemaining)}
                        </span>
                      </div>
                      <Progress
                        value={
                          (viewerState.timeRemaining /
                            GAME_CONSTANTS.VOTING_TIME_LIMIT) *
                          100
                        }
                        className="h-2 mt-2"
                      />
                    </div>

                    <div
                      className={`p-3 rounded-xl border-2 ${
                        viewerState.userVote
                          ? "bg-blue-50 border-blue-400"
                          : "bg-yellow-50 border-yellow-400"
                      }`}
                    >
                      {viewerState.userVote ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            <span className="text-base font-semibold text-gray-800">
                              Głos oddany!
                            </span>
                          </div>
                          <div className="px-2 py-1 rounded-md bg-blue-50 border border-blue-200">
                            <span className="text-xs font-medium text-blue-700">
                              Twój głos: {viewerState.userVote}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-base font-semibold text-gray-800 mb-1">
                            ⏰ Czas na głosowanie!
                          </p>
                          <p className="text-sm text-gray-600">
                            👆 Wybierz odpowiedź powyżej
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        {/* Wyniki głosowania */}
        {viewerState.showResults && viewerState.stats && (
          <div className="px-4 pb-4">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  Wyniki Głosowania
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4 bg-purple-50 rounded-xl p-3">
                  <p className="text-lg font-semibold text-gray-800">
                    Łącznie głosów: {viewerState.stats.totalVotes}
                  </p>
                </div>

                <div className="space-y-3">
                  {(["A", "B", "C", "D"] as VoteOption[]).map(
                    (option, index) => {
                      const result = viewerState.stats!.results[option];
                      const isUserVote = viewerState.userVote === option;

                      const colors = [
                        "bg-blue-600",
                        "bg-orange-500",
                        "bg-purple-600",
                        "bg-teal-600",
                      ];

                      return (
                        <div
                          key={option}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 ${
                            isUserVote
                              ? "bg-yellow-50 border-yellow-400"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-sm ${colors[index]}`}
                            >
                              {option}
                            </div>
                            <span className="font-semibold text-base text-gray-800">
                              {result.percentage}%
                            </span>
                            {isUserVote && <span className="text-lg">👆</span>}
                          </div>
                          <span className="font-medium text-gray-600 text-sm">
                            ({result.count} głosów)
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ekran zakończenia gry */}
        {viewerState.gameEnded && (
          <div className="px-4 pb-6">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="text-center py-8">
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                    viewerState.gameWon ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <span className="text-4xl">
                    {viewerState.gameWon ? "🎉" : "💔"}
                  </span>
                </div>

                <h2
                  className={`text-2xl font-bold mb-4 ${
                    viewerState.gameWon ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {viewerState.gameWon ? "🏆 WYGRAŁ!" : "😢 PRZEGRAŁ"}
                </h2>

                <div
                  className={`rounded-2xl p-4 mb-6 ${
                    viewerState.gameWon
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Końcowa kwota:
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      viewerState.gameWon ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {viewerState.finalAmount.toLocaleString("pl-PL")} zł
                  </p>
                </div>

                <div className="space-y-3">
                  {viewerState.gameWon ? (
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        🎊 Gratulacje!
                      </p>
                      <p className="text-sm text-gray-600">
                        Uczestnik odpowiedział na wszystkie pytania poprawnie i
                        zdobył główną nagrodę!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        😔 Niestety...
                      </p>
                      <p className="text-sm text-gray-600">
                        Uczestnik udzielił błędnej odpowiedzi. Gra zakończona.
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm font-medium text-gray-700">
                      💫 Dziękujemy za udział w głosowaniu publiczności!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Brak aktywnej gry */}
        {(!viewerState.gameState &&
          !viewerState.voteSession &&
          !viewerState.showResults &&
          !viewerState.gameEnded &&
          !isLoading) ||
        (!isLoading &&
          !viewerState.gameState?.currentQuestion &&
          !viewerState.voteSession?.question &&
          !viewerState.stats &&
          !viewerState.canVote &&
          !viewerState.showResults &&
          !viewerState.gameEnded) ? (
          <div className="px-4 pb-6">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  🎮 Brak aktywnej gry
                </h2>
                <p className="text-gray-600 mb-2">
                  Obecnie nie ma aktywnej gry ani głosowania
                </p>
                <p className="text-sm text-gray-500">
                  Czekaj aż administrator rozpocznie nową grę...
                </p>
                <div className="mt-6 bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700">
                    💡 Kiedy gra się rozpocznie, automatycznie zobaczysz
                    aktualne pytanie
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>

      {/* Fixed Footer Bar */}
      {(viewerState.gameState || viewerState.voteSession) &&
        !viewerState.gameEnded && (
          <div className="fixed bottom-2 left-2 right-2 z-10">
            <div className="max-w-md mx-auto">
              <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  {/* Progres pytań */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">
                        #
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-gray-800">
                        {(viewerState.gameState?.gameSession
                          ?.currentQuestionIndex ?? 0) + 1}
                      </span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-gray-600">
                        {viewerState.gameState?.gameSession?.totalQuestions ||
                          12}
                      </span>
                    </div>
                  </div>

                  {/* Progres bar */}
                  <div className="flex-1 mx-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${
                            (((viewerState.gameState?.gameSession
                              ?.currentQuestionIndex ?? 0) +
                              1) /
                              (viewerState.gameState?.gameSession
                                ?.totalQuestions || 12)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status połączenia */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        isConnected ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {isConnected ? (
                        <Wifi className="w-3 h-3 text-green-600" />
                      ) : (
                        <WifiOff className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
