"use client";

import { GameTransitionOverlay } from "@/components/ui/game-transition-overlay";

interface TransitionOverlaysProps {
  showTransitionScreen: boolean;
  isBackToWaitingTransition: boolean;
  showWinScreen: boolean;
  isSessionClosedTransition: boolean;
  isGameStartTransition: boolean;
}

export function TransitionOverlays({
  showTransitionScreen,
  isBackToWaitingTransition,
  showWinScreen,
  isSessionClosedTransition,
  isGameStartTransition,
}: TransitionOverlaysProps) {
  return (
    <>
      {/* Przejście między pytaniami */}
      <GameTransitionOverlay
        isVisible={showTransitionScreen}
        logoAlt="Logo Milionerzy - Przejście między pytaniami"
      />

      {/* Przejście z wygranej */}
      <GameTransitionOverlay
        isVisible={isBackToWaitingTransition && showWinScreen}
        logoAlt="Logo Milionerzy - Przejście z wygranej"
      />

      {/* Zamknięcie sesji */}
      <GameTransitionOverlay
        isVisible={isSessionClosedTransition && !showWinScreen}
        logoAlt="Logo Milionerzy - Zamknięcie sesji"
      />

      {/* Start gry */}
      <GameTransitionOverlay
        isVisible={isGameStartTransition}
        logoAlt="Logo Milionerzy - Start gry"
      />
    </>
  );
}
