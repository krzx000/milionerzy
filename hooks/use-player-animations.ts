"use client";

import * as React from "react";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";

export interface AnimationState {
  // Podstawowe animacje
  questionAppear: boolean;
  answerSelect: boolean;
  answerReveal: boolean;
  prizeUpdate: boolean;

  // Animacje timera
  timerWarning: boolean;
  timerCritical: boolean;

  // Animacje koł ratunkowych
  lifelineUsed: boolean;

  // Animacje połączenia
  connectionLost: boolean;
  connectionRestored: boolean;

  // Animacje wyników
  correctAnswer: boolean;
  incorrectAnswer: boolean;
  gameWon: boolean;
  gameLost: boolean;
}

export interface AnimationActions {
  // Uruchom konkretną animację
  triggerAnimation: (
    animation: keyof AnimationState,
    duration?: number
  ) => void;

  // Wyczyść wszystkie animacje
  clearAllAnimations: () => void;

  // Wyczyść konkretną animację
  clearAnimation: (animation: keyof AnimationState) => void;

  // Sprawdź czy animacja jest aktywna
  isAnimationActive: (animation: keyof AnimationState) => boolean;

  // Uruchom sekwencję animacji
  triggerSequence: (
    animations: Array<{
      animation: keyof AnimationState;
      delay?: number;
      duration?: number;
    }>
  ) => void;
}

const initialAnimationState: AnimationState = {
  questionAppear: false,
  answerSelect: false,
  answerReveal: false,
  prizeUpdate: false,
  timerWarning: false,
  timerCritical: false,
  lifelineUsed: false,
  connectionLost: false,
  connectionRestored: false,
  correctAnswer: false,
  incorrectAnswer: false,
  gameWon: false,
  gameLost: false,
};

export function usePlayerAnimations() {
  const [animationState, setAnimationState] = React.useState<AnimationState>(
    initialAnimationState
  );
  const timeoutsRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Wyczyść timeouty przy unmount
  React.useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeouts.clear();
    };
  }, []);

  const actions: AnimationActions = React.useMemo(
    () => ({
      triggerAnimation: (
        animation: keyof AnimationState,
        duration: number = PLAYER_CONSTANTS.ANIMATION_DURATION
      ) => {
        // Wyczyść poprzedni timeout dla tej animacji
        const existingTimeout = timeoutsRef.current.get(animation);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // Uruchom animację
        setAnimationState((prev) => ({
          ...prev,
          [animation]: true,
        }));

        // Ustaw timeout do wyłączenia animacji
        const timeout = setTimeout(() => {
          setAnimationState((prev) => ({
            ...prev,
            [animation]: false,
          }));
          timeoutsRef.current.delete(animation);
        }, duration);

        timeoutsRef.current.set(animation, timeout);
      },

      clearAllAnimations: () => {
        // Wyczyść wszystkie timeouty
        timeoutsRef.current.forEach((timeout) => {
          clearTimeout(timeout);
        });
        timeoutsRef.current.clear();

        // Wyłącz wszystkie animacje
        setAnimationState(initialAnimationState);
      },

      clearAnimation: (animation: keyof AnimationState) => {
        // Wyczyść timeout dla tej animacji
        const existingTimeout = timeoutsRef.current.get(animation);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          timeoutsRef.current.delete(animation);
        }

        // Wyłącz animację
        setAnimationState((prev) => ({
          ...prev,
          [animation]: false,
        }));
      },

      isAnimationActive: (animation: keyof AnimationState) => {
        return animationState[animation];
      },

      triggerSequence: (animations) => {
        animations.forEach(({ animation, delay = 0, duration }) => {
          setTimeout(() => {
            actions.triggerAnimation(animation, duration);
          }, delay);
        });
      },
    }),
    [animationState]
  );

  // Funkcje pomocnicze do łączenia klas CSS
  const getAnimationClass = React.useCallback(
    (baseClass: string, animation: keyof AnimationState): string => {
      if (animationState[animation]) {
        return `${baseClass} ${
          PLAYER_CONSTANTS.ANIMATION_CLASSES[
            animation.toUpperCase() as keyof typeof PLAYER_CONSTANTS.ANIMATION_CLASSES
          ] || "animate"
        }`;
      }
      return baseClass;
    },
    [animationState]
  );

  const getQuestionClass = React.useCallback(
    (baseClass: string = "question"): string => {
      return getAnimationClass(baseClass, "questionAppear");
    },
    [getAnimationClass]
  );

  const getAnswerClass = React.useCallback(
    (
      baseClass: string = "answer-option",
      isSelected: boolean = false
    ): string => {
      let className = baseClass;

      if (animationState.questionAppear) {
        className += " question-appear";
      }

      if (isSelected && animationState.answerSelect) {
        className += " answer-select";
      }

      if (animationState.answerReveal) {
        className += " answer-reveal";
      }

      return className;
    },
    [animationState]
  );

  const getTimerClass = React.useCallback(
    (baseClass: string = "timer", timeRemaining: number): string => {
      let className = baseClass;

      if (
        timeRemaining <= PLAYER_CONSTANTS.CRITICAL_TIME_THRESHOLD ||
        animationState.timerCritical
      ) {
        className += " timer-critical";
      } else if (
        timeRemaining <= PLAYER_CONSTANTS.WARNING_TIME_THRESHOLD ||
        animationState.timerWarning
      ) {
        className += " timer-warning";
      }

      return className;
    },
    [animationState]
  );

  const getConnectionClass = React.useCallback(
    (baseClass: string = "connection-status"): string => {
      let className = baseClass;

      if (animationState.connectionLost) {
        className += " connection-lost";
      }

      if (animationState.connectionRestored) {
        className += " connection-restored";
      }

      return className;
    },
    [animationState]
  );

  const getResultClass = React.useCallback(
    (baseClass: string = "result", isCorrect?: boolean): string => {
      let className = baseClass;

      if (isCorrect === true && animationState.correctAnswer) {
        className += " correct-answer";
      }

      if (isCorrect === false && animationState.incorrectAnswer) {
        className += " incorrect-answer";
      }

      if (animationState.gameWon) {
        className += " game-won";
      }

      if (animationState.gameLost) {
        className += " game-lost";
      }

      return className;
    },
    [animationState]
  );

  return {
    // Stan animacji
    animationState,

    // Akcje
    ...actions,

    // Funkcje pomocnicze dla klas CSS
    getAnimationClass,
    getQuestionClass,
    getAnswerClass,
    getTimerClass,
    getConnectionClass,
    getResultClass,

    // Funkcje sprawdzające stan
    isQuestionAnimating: animationState.questionAppear,
    isAnswerAnimating:
      animationState.answerSelect || animationState.answerReveal,
    isTimerAnimating:
      animationState.timerWarning || animationState.timerCritical,
    isConnectionAnimating:
      animationState.connectionLost || animationState.connectionRestored,
    isResultAnimating:
      animationState.correctAnswer ||
      animationState.incorrectAnswer ||
      animationState.gameWon ||
      animationState.gameLost,
  };
}
