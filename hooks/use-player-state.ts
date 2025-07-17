"use client";

import * as React from "react";
import { useServerSentEvents } from "@/hooks/use-sse";
import type { GameEventType } from "@/types/events";
import type { GameSession } from "@/lib/db/game-session";
import type { Question } from "@/types/question";
import { getCurrentPrize, getWinningPrize } from "@/lib/utils/prize";

export interface PlayerGameState {
  // Podstawowe informacje o grze
  session: GameSession | null;
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;
  currentPrize: string;
  gameStatus: "waiting" | "active" | "paused" | "ended";

  // Stan odpowiedzi
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isAnswerRevealed: boolean;
  answerLocked: boolean;
  showFinalAnswer: boolean;

  // Timer i czas
  timeRemaining: number;
  isTimeUp: boolean;
  questionStartTime: Date | null;

  // Wyniki gry
  winnings: string;
  finalResult: "win" | "lose" | null;

  // Koła ratunkowe
  lifelinesUsed: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askAudience: boolean;
  };
  hiddenAnswers: string[];
  audienceVotingActive: boolean;

  // Animacje i efekty
  showQuestionAnimation: boolean;
  showAnswerAnimation: boolean;
  showPrizeAnimation: boolean;

  // Historia odpowiedzi
  answerHistory: Array<{
    questionIndex: number;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeUsed: number;
  }>;
}

export interface PlayerActions {
  // Akcje gracza (tylko do wyświetlania, nie wykonują prawdziwych akcji)
  showAnswerSelection: (answer: string) => void;
  showAnswerLocking: () => void;
  showAnswerReveal: (correctAnswer: string) => void;
  resetAnimations: () => void;
}

const initialState: PlayerGameState = {
  session: null,
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  currentPrize: "0 zł",
  gameStatus: "waiting",
  selectedAnswer: null,
  correctAnswer: null,
  isAnswerRevealed: false,
  answerLocked: false,
  showFinalAnswer: false,
  timeRemaining: 0,
  isTimeUp: false,
  questionStartTime: null,
  winnings: "0 zł",
  finalResult: null,
  lifelinesUsed: {
    fiftyFifty: false,
    phoneAFriend: false,
    askAudience: false,
  },
  hiddenAnswers: [],
  audienceVotingActive: false,
  showQuestionAnimation: false,
  showAnswerAnimation: false,
  showPrizeAnimation: false,
  answerHistory: [],
};

export function usePlayerState() {
  const [state, setState] = React.useState<PlayerGameState>(initialState);
  const timeIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Funkcje animacji
  const triggerAnimation = React.useCallback(
    (
      type: keyof Pick<
        PlayerGameState,
        "showQuestionAnimation" | "showAnswerAnimation" | "showPrizeAnimation"
      >
    ) => {
      setState((prev) => ({ ...prev, [type]: true }));

      // Automatycznie wyłącz animację po 3 sekundach
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, [type]: false }));
      }, 3000);
    },
    []
  );

  // Funkcje akcji dla gracza (tylko wizualne)
  const actions: PlayerActions = React.useMemo(
    () => ({
      showAnswerSelection: (answer: string) => {
        setState((prev) => ({
          ...prev,
          selectedAnswer: answer,
        }));
        triggerAnimation("showAnswerAnimation");
      },

      showAnswerLocking: () => {
        setState((prev) => ({
          ...prev,
          answerLocked: true,
        }));
      },

      showAnswerReveal: (correctAnswer: string) => {
        setState((prev) => ({
          ...prev,
          correctAnswer,
          isAnswerRevealed: true,
          showFinalAnswer: true,
        }));
      },

      resetAnimations: () => {
        setState((prev) => ({
          ...prev,
          showQuestionAnimation: false,
          showAnswerAnimation: false,
          showPrizeAnimation: false,
        }));
      },
    }),
    [triggerAnimation]
  );

  // Funkcja do aktualizacji czasu
  const updateTimer = React.useCallback(() => {
    setState((prev) => {
      if (prev.timeRemaining <= 0) {
        return {
          ...prev,
          isTimeUp: true,
        };
      }
      return {
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
      };
    });
  }, []);

  // Rozpoczęcie timera
  const startTimer = React.useCallback(
    (seconds: number) => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }

      setState((prev) => ({
        ...prev,
        timeRemaining: seconds,
        isTimeUp: false,
        questionStartTime: new Date(),
      }));

      timeIntervalRef.current = setInterval(updateTimer, 1000);
    },
    [updateTimer]
  );

  // Zatrzymanie timera
  const stopTimer = React.useCallback(() => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  }, []);

  // Obsługa eventów SSE
  const handleGameEvent = React.useCallback(
    (event: GameEventType, data: Record<string, unknown>) => {
      console.log("🎮 Player received event:", event, data);

      switch (event) {
        case "game-started":
          const gameStartData = data as Record<string, unknown>;
          const session = gameStartData.session as GameSession;
          const currentQuestion = gameStartData.currentQuestion as Question;
          const hiddenAnswers = (gameStartData.hiddenAnswers as string[]) || [];

          setState((prev) => ({
            ...prev,
            session,
            currentQuestion,
            questionIndex: session?.currentQuestionIndex || 0,
            totalQuestions: session?.totalQuestions || 0,
            currentPrize: getCurrentPrize(session?.currentQuestionIndex || 0),
            gameStatus: "active",
            selectedAnswer: null,
            correctAnswer: null,
            isAnswerRevealed: false,
            finalResult: null,
            lifelinesUsed: {
              fiftyFifty: session?.usedLifelines?.fiftyFifty || false,
              phoneAFriend: session?.usedLifelines?.phoneAFriend || false,
              askAudience: session?.usedLifelines?.askAudience || false,
            },
            hiddenAnswers,
            answerLocked: false,
            showFinalAnswer: false,
          }));

          triggerAnimation("showQuestionAnimation");
          startTimer(30); // 30 sekund na pytanie
          break;

        case "question-changed":
          const questionData = data as Record<string, unknown>;
          const newQuestion = questionData.currentQuestion as Question;
          const newQuestionIndex = (questionData.questionIndex as number) || 0;
          const newHiddenAnswers =
            (questionData.hiddenAnswers as string[]) || [];

          setState((prev) => ({
            ...prev,
            currentQuestion: newQuestion,
            questionIndex: newQuestionIndex,
            currentPrize: getCurrentPrize(newQuestionIndex),
            selectedAnswer: null,
            correctAnswer: null,
            isAnswerRevealed: false,
            hiddenAnswers:
              newHiddenAnswers.length > 0
                ? newHiddenAnswers
                : prev.hiddenAnswers,
            answerLocked: false,
            showFinalAnswer: false,
          }));

          triggerAnimation("showQuestionAnimation");
          triggerAnimation("showPrizeAnimation");
          startTimer(30);
          break;

        case "answer-selected":
          const selectedAnswer = data.selectedAnswer as string;
          setState((prev) => ({
            ...prev,
            selectedAnswer,
          }));
          triggerAnimation("showAnswerAnimation");
          break;

        case "answer-locked":
          setState((prev) => ({
            ...prev,
            answerLocked: true,
          }));
          stopTimer();
          break;

        case "answer-revealed":
          const correctAnswer = data.correctAnswer as string;
          const timeUsed = state.questionStartTime
            ? Math.floor(
                (new Date().getTime() - state.questionStartTime.getTime()) /
                  1000
              )
            : 0;

          setState((prev) => ({
            ...prev,
            correctAnswer,
            isAnswerRevealed: true,
            showFinalAnswer: true,
            answerHistory: [
              ...prev.answerHistory,
              {
                questionIndex: prev.questionIndex,
                selectedAnswer: prev.selectedAnswer || "",
                correctAnswer,
                isCorrect: prev.selectedAnswer === correctAnswer,
                timeUsed,
              },
            ],
          }));
          stopTimer();
          break;

        case "lifeline-used":
          const lifelineData = data as Record<string, unknown>;
          const lifeline = lifelineData.lifeline as string;

          if (lifeline === "fiftyFifty") {
            const hiddenAnswersLifeline =
              (lifelineData.hiddenAnswers as string[]) || [];
            setState((prev) => ({
              ...prev,
              lifelinesUsed: {
                ...prev.lifelinesUsed,
                fiftyFifty: true,
              },
              hiddenAnswers: hiddenAnswersLifeline,
            }));
          } else if (lifeline === "askAudience") {
            setState((prev) => ({
              ...prev,
              lifelinesUsed: {
                ...prev.lifelinesUsed,
                askAudience: true,
              },
              audienceVotingActive: true,
            }));
          } else if (lifeline === "phoneAFriend") {
            setState((prev) => ({
              ...prev,
              lifelinesUsed: {
                ...prev.lifelinesUsed,
                phoneAFriend: true,
              },
            }));
          }
          break;

        case "voting-started":
          setState((prev) => ({
            ...prev,
            audienceVotingActive: true,
          }));
          break;

        case "voting-ended":
          setState((prev) => ({
            ...prev,
            audienceVotingActive: false,
          }));
          break;

        case "game-ended":
          const gameEndData = data as Record<string, unknown>;
          const result = gameEndData.result as "win" | "lose";
          const finalQuestionIndex =
            (gameEndData.finalQuestionIndex as number) || 0;

          const isWin = result === "win";
          const winnings = isWin
            ? getWinningPrize(finalQuestionIndex, state.totalQuestions)
            : getWinningPrize(
                Math.max(0, finalQuestionIndex - 1),
                state.totalQuestions
              );

          setState((prev) => ({
            ...prev,
            gameStatus: "ended",
            finalResult: result,
            winnings,
          }));
          stopTimer();
          break;

        case "game-paused":
          setState((prev) => ({
            ...prev,
            gameStatus: "paused",
          }));
          stopTimer();
          break;

        case "game-resumed":
          setState((prev) => ({
            ...prev,
            gameStatus: "active",
          }));
          if (state.timeRemaining > 0) {
            startTimer(state.timeRemaining);
          }
          break;

        case "game-reset":
          setState(initialState);
          stopTimer();
          break;

        default:
          break;
      }
    },
    [
      startTimer,
      stopTimer,
      state.totalQuestions,
      state.questionStartTime,
      state.timeRemaining,
      triggerAnimation,
    ]
  );

  // Hook SSE
  const { isConnected } = useServerSentEvents({
    clientType: "player",
    onEvent: handleGameEvent,
  });

  // Czyszczenie timerów przy unmount
  React.useEffect(() => {
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Funkcje pomocnicze
  const formatTime = React.useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const isAnswerHidden = React.useCallback(
    (answer: string) => {
      return state.hiddenAnswers.includes(answer);
    },
    [state.hiddenAnswers]
  );

  const getAnswerClass = React.useCallback(
    (answer: string) => {
      const baseClass = "answer-option";

      if (isAnswerHidden(answer)) {
        return `${baseClass} hidden`;
      }

      if (state.selectedAnswer === answer) {
        return `${baseClass} selected`;
      }

      if (state.isAnswerRevealed && state.correctAnswer === answer) {
        return `${baseClass} correct`;
      }

      if (
        state.isAnswerRevealed &&
        state.selectedAnswer === answer &&
        state.correctAnswer !== answer
      ) {
        return `${baseClass} incorrect`;
      }

      return baseClass;
    },
    [
      state.selectedAnswer,
      state.correctAnswer,
      state.isAnswerRevealed,
      isAnswerHidden,
    ]
  );

  const getGameProgress = React.useCallback(() => {
    if (state.totalQuestions === 0) return 0;
    return Math.round((state.questionIndex / state.totalQuestions) * 100);
  }, [state.questionIndex, state.totalQuestions]);

  return {
    ...state,
    actions,
    isConnected,
    // Funkcje pomocnicze
    formatTime,
    isAnswerHidden,
    getAnswerClass,
    getGameProgress,
  };
}
