import * as React from "react";
import { TransitionAPI } from "@/lib/transition/api";
import { TRANSITION_CONSTANTS } from "@/lib/constants/transitions";

export function useTransitions() {
  /**
   * Pokaż transition między pytaniami
   */
  const showQuestionTransition = React.useCallback(
    (
      duration: number = TRANSITION_CONSTANTS.SPECIFIC_DURATIONS
        .QUESTION_TRANSITION
    ) => {
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
    (
      duration: number = TRANSITION_CONSTANTS.SPECIFIC_DURATIONS
        .GAME_START_TRANSITION
    ) => {
      TransitionAPI.showTimed(duration, {
        type: "game-start",
      });
    },
    []
  );

  /**
   * Pokaż transition zakończenia gry
   */
  const showGameEndTransition = React.useCallback(
    (
      duration: number = TRANSITION_CONSTANTS.SPECIFIC_DURATIONS
        .GAME_END_TRANSITION
    ) => {
      TransitionAPI.showTimed(duration, {
        type: "game-end",
      });
    },
    []
  );

  /**
   * Pokaż transition powrotu do oczekiwania
   */
  const showBackToWaitingTransition = React.useCallback(
    (
      duration: number = TRANSITION_CONSTANTS.SPECIFIC_DURATIONS
        .ANSWER_TRANSITION
    ) => {
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
    (
      duration: number = TRANSITION_CONSTANTS.SPECIFIC_DURATIONS
        .ANSWER_TRANSITION
    ) => {
      TransitionAPI.showTimed(duration, {
        type: "session-closed",
      });
    },
    []
  );

  /**
   * Pokaż transition pauzy
   */
  const showPauseTransition = React.useCallback(
    (
      duration: number = TRANSITION_CONSTANTS.SPECIFIC_DURATIONS
        .PAUSE_TRANSITION
    ) => {
      TransitionAPI.showTimed(duration, {
        type: "pause",
      });
    },
    []
  );

  /**
   * Pokaż transition wznowienia
   */
  const showResumeTransition = React.useCallback(
    (
      duration: number = TRANSITION_CONSTANTS.SPECIFIC_DURATIONS
        .RESUME_TRANSITION
    ) => {
      TransitionAPI.showTimed(duration, {
        type: "resume",
      });
    },
    []
  );

  /**
   * Pokaż transition pauzy gry (z callback)
   */
  const showGamePausedTransition = React.useCallback(
    (callback?: () => void) => {
      if (callback) {
        TransitionAPI.showWithCallback(
          callback,
          TRANSITION_CONSTANTS.SPECIFIC_DURATIONS.PAUSE_TRANSITION,
          {
            type: "game-pause",
          }
        );
      } else {
        TransitionAPI.showTimed(
          TRANSITION_CONSTANTS.SPECIFIC_DURATIONS.PAUSE_TRANSITION,
          {
            type: "game-pause",
          }
        );
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
        TransitionAPI.showWithCallback(
          callback,
          TRANSITION_CONSTANTS.SPECIFIC_DURATIONS.RESUME_TRANSITION,
          {
            type: "game-resume",
          }
        );
      } else {
        TransitionAPI.showTimed(
          TRANSITION_CONSTANTS.SPECIFIC_DURATIONS.RESUME_TRANSITION,
          {
            type: "game-resume",
          }
        );
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
        TransitionAPI.showWithCallback(
          callback,
          TRANSITION_CONSTANTS.DURATIONS.SHORT,
          {
            type: "voting-results",
          }
        );
      } else {
        TransitionAPI.showTimed(TRANSITION_CONSTANTS.DURATIONS.SHORT, {
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
      TransitionAPI.showWithCallback(
        callback,
        TRANSITION_CONSTANTS.DURATIONS.DEFAULT,
        {
          type: "game-reset",
        }
      );
    } else {
      TransitionAPI.showTimed(TRANSITION_CONSTANTS.DURATIONS.DEFAULT, {
        type: "game-reset",
      });
    }
  }, []);

  /**
   * Pokaż transition z custom tekstem
   */
  const showCustomTransition = React.useCallback(
    (duration: number = TRANSITION_CONSTANTS.DURATIONS.DEFAULT) => {
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
    (callback: () => void | Promise<void>, showDuration: number = TRANSITION_CONSTANTS.DURATIONS.SHORT) => {
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

  return React.useMemo(
    () => ({
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
    }),
    [
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
    ]
  );
}
