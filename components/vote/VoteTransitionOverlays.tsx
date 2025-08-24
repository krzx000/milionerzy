"use client";

import { GameTransitionOverlay } from "@/components/ui/game-transition-overlay";

interface VoteTransitionOverlaysProps {
  isGameStartTransition: boolean;
  isQuestionChangeTransition: boolean;
  isGameEndTransition: boolean;
  isVotingStartTransition: boolean;
  isVotingEndTransition: boolean;
}

export function VoteTransitionOverlays({
  isGameStartTransition,
  isQuestionChangeTransition,
  isGameEndTransition,
  isVotingStartTransition,
  isVotingEndTransition,
}: VoteTransitionOverlaysProps) {
  return (
    <>
      {/* Start gry */}
      <GameTransitionOverlay
        isVisible={isGameStartTransition}
        logoAlt="Logo Milionerzy - Start gry"
      />

      {/* Zmiana pytania */}
      <GameTransitionOverlay
        isVisible={isQuestionChangeTransition}
        logoAlt="Logo Milionerzy - Zmiana pytania"
      />

      {/* Koniec gry */}
      <GameTransitionOverlay
        isVisible={isGameEndTransition}
        logoAlt="Logo Milionerzy - Koniec gry"
      />

      {/* Start głosowania */}
      <GameTransitionOverlay
        isVisible={isVotingStartTransition}
        logoAlt="Logo Milionerzy - Start głosowania"
      />

      {/* Koniec głosowania */}
      <GameTransitionOverlay
        isVisible={isVotingEndTransition}
        logoAlt="Logo Milionerzy - Koniec głosowania"
      />
    </>
  );
}
