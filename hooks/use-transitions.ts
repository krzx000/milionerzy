import * as React from "react";
import { TransitionAPI } from "@/lib/transition/api";

export function useTransitions() {
  /**
   * Pokaż transition między pytaniami
   */
  const showQuestionTransition = React.useCallback(
    (duration: number = 3200) => {
      TransitionAPI.showTimed(duration, {
        type: "question-change",
      });
    },
    []
  );

  /**
   * Pokaż transition startu gry
   */
  const showGameStartTransition = React.useCallback(
    (duration: number = 3200) => {
      TransitionAPI.showTimed(duration, {
        type: "game-start",
      });
    },
    []
  );

  /**
   * Pokaż transition zakończenia gry
   */
  const showGameEndTransition = React.useCallback((duration: number = 3200) => {
    TransitionAPI.showTimed(duration, {
      type: "game-end",
    });
  }, []);

  /**
   * Pokaż transition powrotu do oczekiwania
   */
  const showBackToWaitingTransition = React.useCallback(
    (duration: number = 3200) => {
      TransitionAPI.showTimed(duration, {
        type: "back-to-waiting",
      });
    },
    []
  );

  /**
   * Pokaż transition zamknięcia sesji
   */
  const showSessionClosedTransition = React.useCallback(
    (duration: number = 3200) => {
      TransitionAPI.showTimed(duration, {
        type: "session-closed",
      });
    },
    []
  );

  /**
   * Pokaż transition pauzy
   */
  const showPauseTransition = React.useCallback((duration: number = 1500) => {
    TransitionAPI.showTimed(duration, {
      type: "pause",
    });
  }, []);

  /**
   * Pokaż transition wznowienia
   */
  const showResumeTransition = React.useCallback((duration: number = 1500) => {
    TransitionAPI.showTimed(duration, {
      type: "resume",
    });
  }, []);

  /**
   * Pokaż transition pauzy gry (z callback)
   */
  const showGamePausedTransition = React.useCallback(
    (callback?: () => void) => {
      if (callback) {
        TransitionAPI.showWithCallback(callback, 1500, {
          type: "game-pause",
        });
      } else {
        TransitionAPI.showTimed(1500, {
          type: "game-pause",
        });
      }
    },
    []
  );

  /**
   * Pokaż transition wznowienia gry (z callback)
   */
  const showGameResumedTransition = React.useCallback(
    (callback?: () => void) => {
      if (callback) {
        TransitionAPI.showWithCallback(callback, 1500, {
          type: "game-resume",
        });
      } else {
        TransitionAPI.showTimed(1500, {
          type: "game-resume",
        });
      }
    },
    []
  );

  /**
   * Pokaż transition wyników głosowania
   */
  const showVotingResultsTransition = React.useCallback(
    (callback?: () => void) => {
      if (callback) {
        TransitionAPI.showWithCallback(callback, 1500, {
          type: "voting-results",
        });
      } else {
        TransitionAPI.showTimed(1500, {
          type: "voting-results",
        });
      }
    },
    []
  );

  /**
   * Pokaż transition resetu gry
   */
  const showGameResetTransition = React.useCallback((callback?: () => void) => {
    if (callback) {
      TransitionAPI.showWithCallback(callback, 3200, {
        type: "game-reset",
      });
    } else {
      TransitionAPI.showTimed(3200, {
        type: "game-reset",
      });
    }
  }, []);

  /**
   * Pokaż transition z custom tekstem
   */
  const showCustomTransition = React.useCallback(
    (text: string, duration: number = 3200) => {
      TransitionAPI.showTimed(duration, {
        type: "custom",
      });
    },
    []
  );

  /**
   * Pokaż transition i wykonaj callback w środku
   */
  const showTransitionWithCallback = React.useCallback(
    (
      callback: () => void | Promise<void>,
      text?: string,
      showDuration: number = 1600
    ) => {
      TransitionAPI.showWithCallback(callback, showDuration, {
        type: "callback",
      });
    },
    []
  );

  /**
   * Natychmiastowe ukrycie transition
   */
  const hideTransition = React.useCallback(() => {
    TransitionAPI.hide();
  }, []);

  /**
   * Ręczne pokazanie transition
   */
  const showTransition = React.useCallback(() => {
    TransitionAPI.show({
      type: "manual",
    });
  }, []);

  return {
    showQuestionTransition,
    showGameStartTransition,
    showGameEndTransition,
    showBackToWaitingTransition,
    showSessionClosedTransition,
    showPauseTransition,
    showResumeTransition,
    showGamePausedTransition,
    showGameResumedTransition,
    showVotingResultsTransition,
    showGameResetTransition,
    showCustomTransition,
    showTransitionWithCallback,
    showTransition,
    hideTransition,
  };
}
