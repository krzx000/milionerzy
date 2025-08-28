"use client";

import * as React from "react";
import { IMAGES } from "@/lib/utils/game-assets";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import { ConnectionBadge } from "@/components/ui/connection-badge";
import { WaitingScreen } from "@/components/views/WaitingScreen";
import { WinScreen } from "@/components/views/WinScreen";
import { LifelinesDisplay } from "@/components/views/LifelinesDisplay";
import { AudienceVotingDisplay } from "@/components/views/AudienceVotingDisplay";
import { GamePausedModal } from "@/components/views/GamePausedModal";
import { QuestionDisplay } from "@/components/views/QuestionDisplay";
import { AnswersDisplay } from "@/components/views/AnswersDisplay";
import { GameLogo } from "@/components/views/GameLogo";
import { TransitionOverlay } from "@/components/ui/transition-overlay";
import { ImagePreloader } from "@/components/ui/image-preloader";
import { usePlayerLogic } from "@/hooks/use-player-logic";
import { useTransitions } from "@/hooks/use-transitions";
import { AuthGuard } from "@/components/auth/AuthGuard";

function PlayerView() {
  const {
    // Stan gry
    session,
    currentQuestion,
    questionIndex,
    currentPrize,
    gameStatus,
    // Stan odpowiedzi
    selectedAnswer,
    correctAnswer,
    isAnswerRevealed,
    // Wyniki
    winnings,
    finalResult,
    // Koła ratunkowe
    lifelinesUsed,
    hiddenAnswers,
    audienceVotingActive,
    audienceVotingResults,
    showVotingResults,
    // Stan połączenia
    isInitialized,
    connectionStatus,
    isConnected,
    // Stan lokalny
    lifelineResult,
    showWinScreen,
    isTransitioning,
    showGameContent,
    displayQuestionText,
  } = usePlayerLogic();

  // Hook do zarządzania transition
  const transitions = useTransitions();

  // Stan dla przejść między widokami
  const [currentView, setCurrentView] = React.useState<
    "waiting" | "game" | "win" | "error"
  >("waiting");

  // Efekt do zarządzania przejściami między widokami
  React.useEffect(() => {
    const determineCurrentView = (): "waiting" | "game" | "win" | "error" => {
      if (connectionStatus === PLAYER_CONSTANTS.CONNECTION_STATES.ERROR) {
        return "error";
      }

      if (finalResult === "win" && gameStatus === "ended") {
        return "win";
      }

      if (gameStatus === "active" && session && currentQuestion) {
        return "game";
      }

      return "waiting";
    };

    const newView = determineCurrentView();

    if (newView !== currentView) {
      // Pokaż transition przed zmianą widoku
      transitions.showTransitionWithCallback(() => {
        setCurrentView(newView);
      });
    }
  }, [
    connectionStatus,
    gameStatus,
    finalResult,
    session,
    currentQuestion,
    currentView,
    transitions,
  ]);

  // Jeśli nie jest jeszcze zainicjalizowane
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Łączenie z grą...</p>
      </div>
    );
  }

  // Renderowanie widoków na podstawie currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case "error":
        return (
          <div className="min-h-screen flex items-center justify-center flex-col">
            <h2>Błąd połączenia</h2>
            <p>Nie udało się połączyć z serwerem gry.</p>
            <button onClick={() => window.location.reload()}>
              Spróbuj ponownie
            </button>
          </div>
        );

      case "win":
        return <WinScreen isConnected={isConnected} winnings={winnings} />;

      case "waiting":
        return <WaitingScreen isConnected={isConnected} />;

      case "game":
        return (
          <div
            className="min-h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
          >
            {/* Status połączenia w prawym górnym rogu */}
            <div className="fixed top-6 right-6 z-50">
              <ConnectionBadge isConnected={isConnected} />
            </div>

            {/* GŁÓWNA ZAWARTOŚĆ GRY */}
            <div
              className={`h-screen flex flex-col justify-end transition-all duration-500 ${
                isTransitioning ? "opacity-75" : "opacity-100"
              }`}
            >
              {/* Logo */}
              <GameLogo isTransitioning={isTransitioning} />

              <QuestionDisplay
                currentQuestion={currentQuestion}
                showGameContent={showGameContent}
                isTransitioning={isTransitioning}
                showWinScreen={showWinScreen}
                currentPrize={currentPrize}
                displayQuestionText={displayQuestionText}
              />

              {/* Koła ratunkowe (graficzne) */}
              <LifelinesDisplay
                lifelinesUsed={lifelinesUsed}
                showGameContent={showGameContent}
                showWinScreen={showWinScreen}
                isTransitioning={isTransitioning}
              />

              <div></div>

              {/* Odpowiedzi */}
              {currentQuestion && (
                <AnswersDisplay
                  currentQuestion={currentQuestion}
                  questionIndex={questionIndex}
                  showGameContent={showGameContent}
                  showWinScreen={showWinScreen}
                  isTransitioning={isTransitioning}
                  selectedAnswer={selectedAnswer}
                  correctAnswer={correctAnswer}
                  isAnswerRevealed={isAnswerRevealed}
                  lifelineResult={lifelineResult}
                />
              )}

              {/* Stan głosowania publiczności */}
              <AudienceVotingDisplay
                isActive={audienceVotingActive}
                showResults={showVotingResults}
                results={audienceVotingResults}
                currentQuestion={currentQuestion}
                hiddenAnswers={hiddenAnswers}
              />

              {/* Stan pauzy */}
              <GamePausedModal isPaused={gameStatus === "paused"} />

              {/* Preloadowanie wszystkich obrazków tła odpowiedzi */}
              <ImagePreloader />
            </div>
          </div>
        );

      default:
        return <WaitingScreen isConnected={isConnected} />;
    }
  };

  return (
    <>
      {renderCurrentView()}
      {/* TRANSITION OVERLAY */}
      <TransitionOverlay />
    </>
  );
}

export default function PlayerViewPage() {
  return (
    <AuthGuard requiredRole="player">
      <PlayerView />
    </AuthGuard>
  );
}
