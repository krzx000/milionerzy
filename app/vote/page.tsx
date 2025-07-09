"use client";

import * as React from "react";
import { VoteSession, VoteStats, VoteOption } from "@/types/voting";
import { VotingAPI, GameViewerState } from "@/lib/api/voting";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, PlayCircle, Wifi, WifiOff } from "lucide-react";
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
  // Nowe pola dla śledzenia odpowiedzi
  selectedAnswer: string | null; // Odpowiedź wybrana przez admina
  correctAnswer: string | null; // Poprawna odpowiedź (gdy ujawniona)
  isAnswerRevealed: boolean; // Czy odpowiedź została ujawniona
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
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [userId] = React.useState(
    () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // Wykryj zmianę pytania i wyczyść głos użytkownika
  const [currentQuestionId, setCurrentQuestionId] = React.useState<
    string | null
  >(null);

  // Pobierz statystyki głosowania
  const loadVoteStats = React.useCallback(async () => {
    const response = await VotingAPI.getVoteStats();
    if (response.success && response.data) {
      setViewerState((prev) => ({
        ...prev,
        stats: response.data!,
      }));
    }
  }, []);

  // Pobierz aktualny stan gry/głosowania
  const loadCurrentState = React.useCallback(async () => {
    try {
      console.log("🔄 Ładowanie aktualnego stanu...");
      const response = await VotingAPI.getCurrentVoteSession();
      console.log("📡 API Response:", response);

      if (response.success && response.data) {
        const data = response.data as VoteSession | GameViewerState;

        // Sprawdź czy to sesja głosowania czy stan gry
        if ("question" in data) {
          // To jest VoteSession
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
            // Resetuj pola związane z odpowiedziami gdy ładujemy sesję głosowania
            selectedAnswer: null,
            correctAnswer: null,
            isAnswerRevealed: false,
          }));

          // Pobierz statystyki jeśli głosowanie się skończyło
          if (!voteSession.isActive || timeRemaining === 0) {
            setTimeout(() => loadVoteStats(), 100);
          }
        } else {
          // To jest GameViewerState
          const gameState = data as GameViewerState;
          console.log("🎮 Setting GameViewerState:", gameState);
          setViewerState((prev) => ({
            ...prev,
            gameState,
            voteSession: gameState.voteSession,
            showResults: false,
            canVote: false,
            // Wyczyść dane z poprzedniego głosowania gdy przechodzi do nowego pytania
            stats: null,
            userVote: null,
            timeRemaining: 0,
            // Zachowaj stan odpowiedzi jeśli już są ustawione (nie resetuj przy zwykłym odświeżeniu)
            // selectedAnswer: null,
            // correctAnswer: null,
            // isAnswerRevealed: false,
          }));
        }
      } else {
        // Brak danych - wyczyść całkowicie stan
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
        });
      }
    } catch (error) {
      console.error("❌ Błąd ładowania stanu:", error);
    } finally {
      setIsLoading(false);
    }
  }, [loadVoteStats]);

  // Obsługa eventów SSE
  const handleSSEEvent = React.useCallback(
    (eventType: GameEventType, data: Record<string, unknown>) => {
      console.log("📡 SSE Event received:", eventType, data);

      switch (eventType) {
        case "voting-started":
          console.log("🗳️ SSE: Głosowanie rozpoczęte");
          // Wymuś pełne odświeżenie stanu z małym opóźnieniem
          setTimeout(() => loadCurrentState(), 100);
          break;
        case "voting-ended":
          // Głosowanie się skończyło, pokaż wyniki
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
          // Użyto koła ratunkowego - odśwież stan gry
          console.log("🎯 SSE: Koło ratunkowe użyte:", data);
          const lifelineName = data.lifelineName as string;
          if (lifelineName) {
            console.log(`📢 Użyto koła ratunkowego: ${lifelineName}`);
          }
          // Wymuś pełne odświeżenie stanu
          setTimeout(() => loadCurrentState(), 100);
          break;
        case "question-changed":
          // Nowe pytanie, wyczyść poprzedni stan głosowania
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
          }));
          // Wymuś pełne odświeżenie stanu z małym opóźnieniem
          setTimeout(() => loadCurrentState(), 200);
          break;
        case "game-ended":
          // Gra się skończyła
          setViewerState((prev) => ({
            ...prev,
            voteSession: null,
            canVote: false,
            showResults: false,
            selectedAnswer: null,
            correctAnswer: null,
            isAnswerRevealed: false,
          }));
          loadCurrentState();
          break;
        case "vote-stats-updated":
          // Aktualizuj statystyki głosowania
          loadVoteStats();
          break;
        case "answer-selected":
          // Admin wybrał odpowiedź - podświetl ją
          const selectedAnswer = data.selectedAnswer as string;
          console.log("👆 SSE: Wybrano odpowiedź:", selectedAnswer);
          setViewerState((prev) => ({
            ...prev,
            selectedAnswer,
            isAnswerRevealed: false,
          }));
          break;
        case "answer-revealed":
          // Ujawniono poprawną odpowiedź
          const correctAnswer = data.correctAnswer as string;
          const isCorrect = data.isCorrect as boolean;
          const gameWon = data.gameWon as boolean;
          console.log("✅ SSE: Ujawniono odpowiedź:", {
            correctAnswer,
            isCorrect,
            gameWon,
          });
          setViewerState((prev) => ({
            ...prev,
            correctAnswer,
            isAnswerRevealed: true,
          }));
          break;
      }
    },
    [loadCurrentState, loadVoteStats]
  );

  // Konfiguracja SSE
  const { isConnected } = useServerSentEvents({
    clientType: "voter",
    onEvent: handleSSEEvent,
    onConnect: () => {
      console.log("✅ SSE connected - odświeżam stan");
      // Odśwież stan gdy SSE się połączy/ponownie połączy
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

  // Oddaj głos
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

  // Timer dla odliczania czasu
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

        // Pobierz statystyki gdy czas się skończy
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

  // Załaduj stan początkowy jednorazowo (SSE będzie obsługiwać aktualizacje)
  React.useEffect(() => {
    loadCurrentState();
  }, [loadCurrentState]);

  // Backup polling - jeśli SSE nie działa prawidłowo
  React.useEffect(() => {
    if (!isConnected) {
      console.log("⚠️ SSE nie połączone - używam backup polling");
      const pollInterval = setInterval(() => {
        loadCurrentState();
      }, 3000); // Co 3 sekundy jeśli SSE nie działa

      return () => clearInterval(pollInterval);
    }
  }, [isConnected, loadCurrentState]);

  // Okresowe odświeżanie stanu (heartbeat) - nawet jeśli SSE działa
  React.useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      console.log("💓 Heartbeat - sprawdzam aktualność stanu");
      loadCurrentState();
    }, 10000); // Co 10 sekund

    return () => clearInterval(heartbeatInterval);
  }, [loadCurrentState]);

  // Formatowanie czasu
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  // Debug: loguj stan gry
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

  // Wykryj zmianę pytania i wyczyść głos użytkownika
  React.useEffect(() => {
    const questionId =
      viewerState.voteSession?.questionId ||
      viewerState.gameState?.currentQuestion?.id;

    if (questionId && currentQuestionId && questionId !== currentQuestionId) {
      // Nowe pytanie - wyczyść głos użytkownika i wyniki
      setViewerState((prev) => ({
        ...prev,
        userVote: null,
        stats: null,
        showResults: false,
        canVote: false,
        selectedAnswer: null,
        correctAnswer: null,
        isAnswerRevealed: false,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <PlayCircle className="w-12 h-12 mx-auto mb-4 animate-spin" />
              <p className="text-lg">Ładowanie stanu gry...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Nagłówek z lepszym kontrastem */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl border-4 border-yellow-300">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-5xl font-black text-slate-900 drop-shadow-lg">
                🎮 MILIONERZY
              </h1>
            </div>
            <p className="text-2xl font-bold text-slate-900 drop-shadow">
              Centrum Widzów - Głosuj na Żywo!
            </p>
          </div>
        </div>

        {/* Stan gry */}
        {viewerState.gameState && (
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-2 border-indigo-400 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <Trophy className="w-8 h-8 text-yellow-300" />
                Stan Gry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-black text-yellow-300">
                    {(viewerState.gameState.gameSession?.currentQuestionIndex ??
                      0) + 1}
                  </div>
                  <div className="text-sm font-semibold text-gray-100">
                    Pytanie
                  </div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-black text-yellow-300">
                    {viewerState.gameState.gameSession?.totalQuestions}
                  </div>
                  <div className="text-sm font-semibold text-gray-100">
                    Łącznie
                  </div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-lg font-bold">
                    {viewerState.gameState.gameSession?.status === "active"
                      ? "🟢 AKTYWNA"
                      : "🔴 NIEAKTYWNA"}
                  </div>
                  <div className="text-sm font-semibold text-gray-100">
                    Status
                  </div>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex gap-2 justify-center mb-2">
                    <Badge
                      className={
                        viewerState.gameState.gameSession?.usedLifelines
                          .fiftyFifty
                          ? "bg-red-600 text-white border-red-400"
                          : "bg-green-600 text-white border-green-400"
                      }
                    >
                      50:50
                    </Badge>
                    <Badge
                      className={
                        viewerState.gameState.gameSession?.usedLifelines
                          .phoneAFriend
                          ? "bg-red-600 text-white border-red-400"
                          : "bg-green-600 text-white border-green-400"
                      }
                    >
                      📞
                    </Badge>
                    <Badge
                      className={
                        viewerState.gameState.gameSession?.usedLifelines
                          .askAudience
                          ? "bg-red-600 text-white border-red-400"
                          : "bg-green-600 text-white border-green-400"
                      }
                    >
                      👥
                    </Badge>
                  </div>
                  <div className="text-sm font-semibold text-gray-100">
                    Koła Ratunkowe
                  </div>
                </div>
              </div>

              {/* Wskaźnik połączenia SSE z lepszym kontrastem */}
              <div className="mt-4">
                {isConnected ? (
                  <Badge className="bg-green-600 hover:bg-green-600  w-full flex items-center justify-center  text-white font-bold text-lg px-4 py-2 shadow-lg">
                    <Wifi className="w-5 h-5 mr-2" />
                    Połączono z serwerem
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 hover:bg-red-600 flex items-center justify-center  text-white font-bold text-lg px-4 py-2 shadow-lg animate-pulse">
                    <WifiOff className="w-5 h-5 mr-2" />
                    Rołączono z serwerem. Odśwież stronę
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aktualne pytanie */}
        {(viewerState.gameState?.currentQuestion ||
          viewerState.voteSession?.question) && (
          <Card className="bg-gradient-to-br from-white to-blue-50 border-2 py-0 border-blue-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <PlayCircle className="w-8 h-8" />
                  Aktualne Pytanie
                </span>
                {/* Pokazuj informację o użytym kole 50:50 */}
                {((viewerState.gameState?.gameSession?.hiddenAnswers?.length ||
                  0) > 0 ||
                  (viewerState.voteSession?.hiddenAnswers?.length || 0) >
                    0) && (
                  <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 text-lg border-2 border-red-400">
                    🎯 50:50 UŻYTE
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-2xl font-bold mb-8 text-gray-800 bg-yellow-100 p-6 rounded-lg border-l-4 border-yellow-500 shadow-md">
                {viewerState.voteSession?.question.content ||
                  viewerState.gameState?.currentQuestion?.content}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["A", "B", "C", "D"] as VoteOption[]).map((option) => {
                  const answerText =
                    viewerState.voteSession?.question.answers[option] ||
                    viewerState.gameState?.currentQuestion?.answers[option];
                  const isSelected = viewerState.userVote === option;
                  const canVoteForThis =
                    viewerState.canVote && !viewerState.userVote;

                  // Sprawdź czy odpowiedź jest ukryta przez koło 50:50
                  const isHidden =
                    viewerState.voteSession?.hiddenAnswers?.includes(option) ||
                    viewerState.gameState?.gameSession?.hiddenAnswers?.includes(
                      option
                    );

                  // Sprawdź stan odpowiedzi (wybrana przez admina, poprawna)
                  const isAdminSelected = viewerState.selectedAnswer === option;
                  const isCorrectAnswer = viewerState.correctAnswer === option;
                  const isRevealed = viewerState.isAnswerRevealed;

                  let votePercentage = 0;
                  let voteCount = 0;

                  if (viewerState.showResults && viewerState.stats) {
                    votePercentage =
                      viewerState.stats.results[option]?.percentage || 0;
                    voteCount = viewerState.stats.results[option]?.count || 0;
                  }

                  // Określ styl przycisku na podstawie stanu
                  let buttonVariant: "default" | "outline" | "destructive" =
                    "outline";
                  let buttonClass = `h-auto p-6 text-left justify-start relative overflow-hidden transition-all duration-500 border-2 text-lg font-semibold ${
                    canVoteForThis && !isHidden
                      ? "hover:bg-blue-100 hover:border-blue-400 hover:shadow-lg transform hover:scale-105"
                      : ""
                  } ${
                    isHidden
                      ? "opacity-30 cursor-not-allowed bg-gray-100 border-gray-300"
                      : "bg-white border-gray-300 text-gray-800"
                  }`;

                  // Podświetl wybrany przez użytkownika
                  if (isSelected) {
                    buttonClass = buttonClass.replace(
                      "bg-white border-gray-300",
                      "bg-blue-600 border-blue-700 text-white"
                    );
                    buttonVariant = "default";
                  }

                  // Podświetlenie dla wybranej odpowiedzi przez admina
                  if (isAdminSelected && !isRevealed) {
                    buttonClass = buttonClass.replace(
                      "bg-white border-gray-300",
                      "bg-yellow-400 border-yellow-600 text-black"
                    );
                    buttonClass = buttonClass.replace(
                      "bg-blue-600 border-blue-700 text-white",
                      "bg-yellow-400 border-yellow-600 text-black"
                    );
                  }

                  // Podświetlenie po ujawnieniu odpowiedzi
                  if (isRevealed) {
                    if (isCorrectAnswer) {
                      buttonClass = buttonClass.replace(
                        /bg-\w+-\d+/g,
                        "bg-green-500"
                      );
                      buttonClass = buttonClass.replace(
                        /border-\w+-\d+/g,
                        "border-green-700"
                      );
                      buttonClass = buttonClass.replace(
                        /text-\w+-\d+/g,
                        "text-white"
                      );
                      buttonClass +=
                        " shadow-2xl ring-4 ring-green-300 animate-pulse";
                      buttonVariant = "default";
                    } else if (isAdminSelected) {
                      buttonClass = buttonClass.replace(
                        /bg-\w+-\d+/g,
                        "bg-red-500"
                      );
                      buttonClass = buttonClass.replace(
                        /border-\w+-\d+/g,
                        "border-red-700"
                      );
                      buttonClass = buttonClass.replace(
                        /text-\w+-\d+/g,
                        "text-white"
                      );
                      buttonClass += " shadow-xl ring-2 ring-red-300";
                      buttonVariant = "destructive";
                    }
                  }

                  return (
                    <Button
                      key={option}
                      variant={buttonVariant}
                      className={buttonClass}
                      onClick={() =>
                        canVoteForThis && !isHidden && handleVote(option)
                      }
                      disabled={!canVoteForThis || isHidden}
                    >
                      {viewerState.showResults && !isHidden && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-purple-400/40 transition-all duration-1000 rounded-lg"
                          style={{ width: `${votePercentage}%` }}
                        />
                      )}
                      <div className="relative w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-black text-2xl mr-3 bg-gray-800 text-white px-3 py-1 rounded-full min-w-[3rem] text-center">
                              {option}
                            </span>
                            <span className="text-lg font-semibold">
                              {isHidden ? "🚫 UKRYTE" : answerText}
                            </span>
                            {/* Ikony stanu odpowiedzi - większe i bardziej widoczne */}
                            {isAdminSelected && !isRevealed && (
                              <span className="ml-3 text-2xl animate-bounce">
                                👆
                              </span>
                            )}
                            {isRevealed && isCorrectAnswer && (
                              <span className="ml-3 text-2xl animate-pulse">
                                ✅
                              </span>
                            )}
                            {isRevealed &&
                              isAdminSelected &&
                              !isCorrectAnswer && (
                                <span className="ml-3 text-2xl">❌</span>
                              )}
                          </div>
                          {viewerState.showResults && !isHidden && (
                            <div className="text-right bg-black/20 rounded-lg p-2 min-w-[80px]">
                              <div className="font-black text-xl">
                                {votePercentage}%
                              </div>
                              <div className="text-sm font-semibold opacity-80">
                                ({voteCount} głosów)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Głosowanie aktywne */}
        {viewerState.voteSession &&
          viewerState.voteSession.isActive &&
          viewerState.timeRemaining > 0 && (
            <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-2 border-green-400 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8" />
                  🗳️ Głosowanie Aktywne!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center bg-white/20 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Clock className="w-8 h-8 animate-pulse" />
                      <span className="text-4xl font-black">
                        {formatTime(viewerState.timeRemaining)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (viewerState.timeRemaining /
                          GAME_CONSTANTS.VOTING_TIME_LIMIT) *
                        100
                      }
                      className="h-6 bg-white/30"
                    />
                  </div>

                  <div className="text-center bg-white/10 rounded-lg p-6">
                    {viewerState.userVote ? (
                      <div>
                        <p className="text-2xl font-bold mb-2">
                          ✅ Głos oddany!
                        </p>
                        <p className="text-xl">
                          Twój głos:{" "}
                          <span className="font-black bg-white/20 px-4 py-2 rounded-lg">
                            {viewerState.userVote}
                          </span>
                        </p>
                        <p className="text-lg mt-2 opacity-90">
                          Czekaj na wyniki...
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl font-bold mb-2">
                          ⏰ Czas na głosowanie!
                        </p>
                        <p className="text-xl opacity-90">
                          👆 Wybierz odpowiedź powyżej
                        </p>
                        <p className="text-lg mt-2">
                          Czas na głosowanie: {GAME_CONSTANTS.VOTING_TIME_LIMIT}{" "}
                          sekund
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Wyniki głosowania */}
        {viewerState.showResults && viewerState.stats && (
          <Card className="bg-gradient-to-br from-purple-600 to-pink-700 text-white border-2 border-purple-400 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Users className="w-8 h-8" />
                📊 Wyniki Głosowania
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6 bg-white/20 rounded-lg p-4">
                <p className="text-3xl font-black">
                  Łącznie głosów: {viewerState.stats.totalVotes}
                </p>
              </div>

              <div className="space-y-4">
                {(["A", "B", "C", "D"] as VoteOption[]).map((option) => {
                  const result = viewerState.stats!.results[option];
                  const isUserVote = viewerState.userVote === option;

                  return (
                    <div
                      key={option}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        isUserVote
                          ? "bg-yellow-500/30 border-yellow-400 shadow-lg"
                          : "bg-white/10 border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-black text-2xl bg-black/30 px-3 py-1 rounded-full min-w-[3rem] text-center">
                          {option}
                        </span>
                        <span className="font-bold text-xl">
                          {result.percentage}%
                        </span>
                        {isUserVote && <span className="text-2xl">👆</span>}
                      </div>
                      <span className="font-semibold text-lg">
                        ({result.count} głosów)
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brak aktywnej gry */}
        {(!viewerState.gameState &&
          !viewerState.voteSession &&
          !viewerState.showResults &&
          !isLoading) ||
        // Dodatkowy warunek - jeśli wszystko jest puste/false, na pewno pokaż komunikat
        (!isLoading &&
          !viewerState.gameState?.currentQuestion &&
          !viewerState.voteSession?.question &&
          !viewerState.stats &&
          !viewerState.canVote &&
          !viewerState.showResults) ? (
          <Card className="bg-gradient-to-br from-gray-600 to-slate-700 text-white border-2 border-gray-400 shadow-xl">
            <CardContent className="text-center py-16">
              <PlayCircle className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h2 className="text-4xl font-bold mb-4">🎮 Brak aktywnej gry</h2>
              <p className="text-xl text-gray-200 mb-2">
                Obecnie nie ma aktywnej gry ani głosowania
              </p>
              <p className="text-lg text-gray-300">
                Czekaj aż administrator rozpocznie nową grę...
              </p>
              <div className="mt-6 bg-white/10 rounded-lg p-4">
                <p className="text-lg font-semibold">
                  💡 Kiedy gra się rozpocznie, automatycznie zobaczysz aktualne
                  pytanie
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
