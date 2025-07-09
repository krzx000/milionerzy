"use client";

import * as React from "react";
import { VoteSession, VoteStats, VoteOption } from "@/types/voting";
import { VotingAPI, GameViewerState } from "@/lib/api/voting";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, PlayCircle } from "lucide-react";

interface ViewerState {
  gameState: GameViewerState | null;
  voteSession: VoteSession | null;
  stats: VoteStats | null;
  userVote: VoteOption | null;
  timeRemaining: number;
  canVote: boolean;
  showResults: boolean;
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
    const response = await VotingAPI.getCurrentVoteSession();
    console.log("API Response:", response);

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

        console.log("Setting VoteSession state");
        setViewerState((prev) => ({
          ...prev,
          gameState: null,
          voteSession,
          timeRemaining,
          canVote: voteSession.isActive && timeRemaining > 0 && !prev.userVote,
          showResults: !voteSession.isActive || timeRemaining === 0,
        }));

        // Pobierz statystyki jeśli głosowanie się skończyło
        if (!voteSession.isActive || timeRemaining === 0) {
          loadVoteStats();
        }
      } else {
        // To jest GameViewerState
        const gameState = data as GameViewerState;
        console.log("Setting GameViewerState:", gameState);
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
        }));
      }
    } else {
      // Brak danych - wyczyść całkowicie stan
      console.log("Brak danych z API - czyszczenie stanu");
      setViewerState({
        gameState: null,
        voteSession: null,
        stats: null,
        userVote: null,
        timeRemaining: 0,
        canVote: false,
        showResults: false,
      });
    }
    setIsLoading(false);
  }, [loadVoteStats]);

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

  // Odśwież stan co 3 sekundy
  React.useEffect(() => {
    loadCurrentState();
    const interval = setInterval(loadCurrentState, 3000);
    return () => clearInterval(interval);
  }, [loadCurrentState]);

  // Formatowanie czasu
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  // Debug: loguj stan gry
  React.useEffect(() => {
    console.log("ViewerState changed:", {
      gameState: !!viewerState.gameState,
      voteSession: !!viewerState.voteSession,
      showResults: viewerState.showResults,
      stats: !!viewerState.stats,
      userVote: viewerState.userVote,
      canVote: viewerState.canVote,
      timeRemaining: viewerState.timeRemaining,
      isLoading: isLoading,
      currentQuestionId: currentQuestionId,
    });
  }, [viewerState, isLoading, currentQuestionId]);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Nagłówek */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">🎮 MILIONERZY - Widzowie</h1>
          <p className="text-xl opacity-90">
            Śledź grę na żywo i głosuj w kole ratunkowym!
          </p>
        </div>

        {/* Stan gry */}
        {viewerState.gameState && (
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Stan Gry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {(viewerState.gameState.gameSession?.currentQuestionIndex ??
                      0) + 1}
                  </div>
                  <div className="text-sm opacity-90">Pytanie</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {viewerState.gameState.gameSession?.totalQuestions}
                  </div>
                  <div className="text-sm opacity-90">Łącznie</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {viewerState.gameState.gameSession?.status === "active"
                      ? "🟢 AKTYWNA"
                      : "🔴 NIEAKTYWNA"}
                  </div>
                  <div className="text-sm opacity-90">Status</div>
                </div>
                <div className="text-center">
                  <div className="flex gap-1 justify-center">
                    <Badge
                      variant={
                        viewerState.gameState.gameSession?.usedLifelines
                          .fiftyFifty
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      50:50
                    </Badge>
                    <Badge
                      variant={
                        viewerState.gameState.gameSession?.usedLifelines
                          .phoneAFriend
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      📞
                    </Badge>
                    <Badge
                      variant={
                        viewerState.gameState.gameSession?.usedLifelines
                          .askAudience
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      👥
                    </Badge>
                  </div>
                  <div className="text-sm opacity-90">Koła</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aktualne pytanie */}
        {(viewerState.gameState?.currentQuestion ||
          viewerState.voteSession?.question) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Aktualne Pytanie</span>
                {/* Pokazuj informację o użytym kole 50:50 */}
                {((viewerState.gameState?.gameSession?.hiddenAnswers?.length ||
                  0) > 0 ||
                  (viewerState.voteSession?.hiddenAnswers?.length || 0) >
                    0) && (
                  <Badge variant="destructive" className="ml-2">
                    🎯 50:50 użyte
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium mb-6">
                {viewerState.voteSession?.question.content ||
                  viewerState.gameState?.currentQuestion?.content}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  let votePercentage = 0;
                  let voteCount = 0;

                  if (viewerState.showResults && viewerState.stats) {
                    votePercentage =
                      viewerState.stats.results[option]?.percentage || 0;
                    voteCount = viewerState.stats.results[option]?.count || 0;
                  }

                  return (
                    <Button
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto p-4 text-left justify-start relative overflow-hidden ${
                        canVoteForThis && !isHidden ? "hover:bg-blue-50" : ""
                      } ${isHidden ? "opacity-30 cursor-not-allowed" : ""}`}
                      onClick={() =>
                        canVoteForThis && !isHidden && handleVote(option)
                      }
                      disabled={!canVoteForThis || isHidden}
                    >
                      {viewerState.showResults && !isHidden && (
                        <div
                          className="absolute inset-0 bg-blue-200/30 transition-all duration-1000"
                          style={{ width: `${votePercentage}%` }}
                        />
                      )}
                      <div className="relative w-full">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-lg mr-2">
                              {option}.
                            </span>
                            <span>
                              {isHidden ? "--- ukryte ---" : answerText}
                            </span>
                          </div>
                          {viewerState.showResults && !isHidden && (
                            <div className="text-right">
                              <div className="font-bold">{votePercentage}%</div>
                              <div className="text-sm opacity-70">
                                ({voteCount})
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
            <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Głosowanie Aktywne!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-2xl font-bold">
                        {formatTime(viewerState.timeRemaining)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (viewerState.timeRemaining /
                          GAME_CONSTANTS.VOTING_TIME_LIMIT) *
                        100
                      }
                      className="h-2 bg-white/20"
                    />
                  </div>

                  {viewerState.userVote ? (
                    <div className="text-center">
                      <p className="text-lg">
                        ✅ Twój głos: <strong>{viewerState.userVote}</strong>
                      </p>
                      <p className="text-sm opacity-90">Czekaj na wyniki...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-lg">👆 Wybierz odpowiedź powyżej</p>
                      <p className="text-sm opacity-90">
                        Czas na głosowanie: {GAME_CONSTANTS.VOTING_TIME_LIMIT}{" "}
                        sekund
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Wyniki głosowania */}
        {viewerState.showResults && viewerState.stats && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Wyniki Głosowania
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-2xl font-bold">
                  Łącznie głosów: {viewerState.stats.totalVotes}
                </p>
              </div>

              <div className="space-y-2">
                {(["A", "B", "C", "D"] as VoteOption[]).map((option) => {
                  const result = viewerState.stats!.results[option];
                  const isUserVote = viewerState.userVote === option;

                  return (
                    <div
                      key={option}
                      className={`flex items-center justify-between p-3 rounded ${
                        isUserVote ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      <span className="font-bold">
                        {option}. {result.percentage}%
                      </span>
                      <span>({result.count} głosów)</span>
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
          <Card>
            <CardContent className="text-center py-12">
              <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Brak aktywnej gry</h2>
              <p className="text-gray-600">
                Czekaj aż administrator rozpocznie nową grę...
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
