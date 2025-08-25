"use client";

import * as React from "react";
import { IMAGES } from "@/lib/utils/game-assets";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import { ConnectionBadge } from "@/components/ui/connection-badge";
import { WaitingScreen } from "@/components/views/WaitingScreen";
import { WinScreen } from "@/components/views/WinScreen";
import { WinTransitionScreen } from "@/components/views/WinTransitionScreen";
import { LifelinesDisplay } from "@/components/views/LifelinesDisplay";
import { AudienceVotingDisplay } from "@/components/views/AudienceVotingDisplay";
import { GamePausedModal } from "@/components/views/GamePausedModal";
import { QuestionDisplay } from "@/components/views/QuestionDisplay";
import { AnswersDisplay } from "@/components/views/AnswersDisplay";
import { GameLogo } from "@/components/views/GameLogo";
import { TransitionOverlays } from "@/components/views/TransitionOverlays";
import { ImagePreloader } from "@/components/ui/image-preloader";
import { usePlayerLogic } from "@/hooks/use-player-logic";
import { AuthGuard } from "@/components/auth/AuthGuard";

function PlayerView() {
  // Cała logika biznesowa w custom hook
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
    // Animacje
    showTransitionScreen,
    // Stan połączenia
    isInitialized,
    connectionStatus,
    isConnected,
    // Stan lokalny
    lifelineResult,
    showWinScreen,
    showWinTransition,
    isTransitioning,
    isGameStartTransition,
    isBackToWaitingTransition,
    isSessionClosedTransition,
    showGameContent,
    displayQuestionText,
  } = usePlayerLogic();

  // Jeśli nie jest jeszcze zainicjalizowane
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Łączenie z grą...</p>
      </div>
    );
  }

  // Jeśli wystąpił błąd połączenia
  if (connectionStatus === PLAYER_CONSTANTS.CONNECTION_STATES.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2>Błąd połączenia</h2>
        <p>Nie udało się połączyć z serwerem gry.</p>
        <button onClick={() => window.location.reload()}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // Jeśli gra nie została jeszcze rozpoczęta (ale nie podczas przejścia lub gdy gra jest aktywna)
  if (
    (gameStatus === "waiting" || !session) &&
    !isGameStartTransition &&
    !isSessionClosedTransition &&
    gameStatus !== "active"
  ) {
    console.log("Player page: Rendering waiting screen", {
      gameStatus,
      hasSession: !!session,
      hasCurrentQuestion: !!currentQuestion,
    });

    return (
      <WaitingScreen
        isConnected={isConnected}
        isBackToWaitingTransition={isBackToWaitingTransition}
        isSessionClosedTransition={isSessionClosedTransition}
      />
    );
  }

  // Jeśli gra się zakończyła wygraną (tylko gdy gra jest rzeczywiście zakończona)
  if (finalResult === "win" && gameStatus === "ended") {
    console.log("Player page: Game won, rendering win screen", {
      finalResult,
      gameStatus,
    });

    return (
      <WinScreen
        isConnected={isConnected}
        isBackToWaitingTransition={isBackToWaitingTransition}
        winnings={winnings}
      />
    );
  }

  // Jeśli pokazujemy ekran przejściowy do wygranej
  if (showWinTransition) {
    return <WinTransitionScreen />;
  }

  // ============== GŁÓWNY WIDOK GRY - TUTAJ ZBUDUJ SWÓJ INTERFEJS ==============

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
          isTransitioning || isGameStartTransition || isSessionClosedTransition
            ? "opacity-75"
            : "opacity-100"
        }`}
      >
        {/* Logo */}
        <GameLogo
          isTransitioning={isTransitioning}
          isGameStartTransition={isGameStartTransition}
          isSessionClosedTransition={isSessionClosedTransition}
        />

        <QuestionDisplay
          currentQuestion={currentQuestion}
          showGameContent={showGameContent}
          isTransitioning={isTransitioning}
          isGameStartTransition={isGameStartTransition}
          isSessionClosedTransition={isSessionClosedTransition}
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
          isGameStartTransition={isGameStartTransition}
          isSessionClosedTransition={isSessionClosedTransition}
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
            isGameStartTransition={isGameStartTransition}
            isSessionClosedTransition={isSessionClosedTransition}
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

      {/* TRANSITION OVERLAYS */}
      <TransitionOverlays
        showTransitionScreen={showTransitionScreen}
        isBackToWaitingTransition={isBackToWaitingTransition}
        showWinScreen={showWinScreen}
        isSessionClosedTransition={isSessionClosedTransition}
        isGameStartTransition={isGameStartTransition}
      />
    </div>
  );
}

export default function PlayerViewPage() {
  return (
    <AuthGuard requiredRole="player">
      <PlayerView />
    </AuthGuard>
  );
}
