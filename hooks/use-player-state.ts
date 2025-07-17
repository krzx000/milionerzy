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
          const questionIndex = gameStartData.questionIndex as number;
          const totalQuestions = gameStartData.totalQuestions as number;

          setState((prev) => ({
            ...prev,
            session,
            currentQuestion,
            questionIndex: questionIndex || session?.currentQuestionIndex || 0,
            totalQuestions: totalQuestions || 0,
            currentPrize: getCurrentPrize(
              questionIndex || session?.currentQuestionIndex || 0
            ),
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
          const newTotalQuestions =
            (questionData.totalQuestions as number) || 0;
          const newHiddenAnswers =
            (questionData.hiddenAnswers as string[]) || [];

          console.log(
            "🎮 Player: question-changed - aktualizacja stanu do aktywnego"
          );

          // Jeśli nie ma pytania w event'cie, pobierz sesję z API
          if (!newQuestion) {
            console.log(
              "🎮 Player: Brak pytania w question-changed, pobieranie z API..."
            );
            fetch("/api/game/session")
              .then((response) => response.json())
              .then((result) => {
                if (result.success && result.data) {
                  const sessionWithQuestions = result.data;
                  const currentQuestion = sessionWithQuestions.currentQuestion;

                  setState((prev) => ({
                    ...prev,
                    session: sessionWithQuestions,
                    currentQuestion,
                    questionIndex: newQuestionIndex,
                    totalQuestions:
                      newTotalQuestions > 0
                        ? newTotalQuestions
                        : sessionWithQuestions.totalQuestions ||
                          prev.totalQuestions,
                    currentPrize: getCurrentPrize(newQuestionIndex),
                    gameStatus: "active",
                    selectedAnswer: null,
                    correctAnswer: null,
                    isAnswerRevealed: false,
                    answerLocked: false,
                    showFinalAnswer: false,
                  }));

                  triggerAnimation("showQuestionAnimation");
                  triggerAnimation("showPrizeAnimation");
                  startTimer(30);
                }
              })
              .catch((error) => {
                console.error("🎮 Player: Błąd pobierania sesji z API:", error);
              });
          } else {
            setState((prev) => ({
              ...prev,
              currentQuestion: newQuestion,
              questionIndex: newQuestionIndex,
              totalQuestions:
                newTotalQuestions > 0 ? newTotalQuestions : prev.totalQuestions,
              currentPrize: getCurrentPrize(newQuestionIndex),
              gameStatus: "active",
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
          }
          break;

        case "answer-selected":
          const selectedAnswer = data.selectedAnswer as string;

          setState((prev) => ({
            ...prev,
            selectedAnswer,
          }));
          triggerAnimation("showAnswerAnimation");

          // Jeśli nie mamy aktualnego pytania, ale otrzymujemy answer-selected,
          // oznacza to że gra jest aktywna - pobierz aktualne pytanie
          setState((prevState) => {
            if (
              !prevState.currentQuestion &&
              prevState.gameStatus === "waiting"
            ) {
              console.log(
                "🎮 Player: answer-selected bez pytania - pobieranie sesji z API..."
              );
              fetch("/api/game/session")
                .then((response) => response.json())
                .then((result) => {
                  if (result.success && result.data) {
                    const sessionWithQuestions = result.data;
                    const currentQuestion =
                      sessionWithQuestions.currentQuestion;

                    setState((prev) => ({
                      ...prev,
                      session: sessionWithQuestions,
                      currentQuestion,
                      questionIndex:
                        sessionWithQuestions.currentQuestionIndex || 0,
                      totalQuestions: sessionWithQuestions.totalQuestions || 0,
                      currentPrize: getCurrentPrize(
                        sessionWithQuestions.currentQuestionIndex || 0
                      ),
                      gameStatus: "active",
                      selectedAnswer,
                      correctAnswer: null,
                      isAnswerRevealed: false,
                      answerLocked: false,
                      showFinalAnswer: false,
                    }));

                    triggerAnimation("showQuestionAnimation");
                    startTimer(30);
                  }
                })
                .catch((error) => {
                  console.error(
                    "🎮 Player: Błąd pobierania sesji po answer-selected:",
                    error
                  );
                });
            }
            return prevState;
          });
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

          setState((prev) => {
            const timeUsed = prev.questionStartTime
              ? Math.floor(
                  (new Date().getTime() - prev.questionStartTime.getTime()) /
                    1000
                )
              : 0;

            return {
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
            };
          });
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

          setState((prev) => {
            const isWin = result === "win";
            const winnings = isWin
              ? getWinningPrize(finalQuestionIndex, prev.totalQuestions)
              : getWinningPrize(
                  Math.max(0, finalQuestionIndex - 1),
                  prev.totalQuestions
                );

            return {
              ...prev,
              gameStatus: "ended",
              finalResult: result,
              winnings,
            };
          });
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

          setState((prevState) => {
            if (prevState.timeRemaining > 0) {
              startTimer(prevState.timeRemaining);
            }
            return prevState;
          });
          break;

        case "game-reset":
          setState(initialState);
          stopTimer();
          break;

        default:
          break;
      }
    },
    [startTimer, stopTimer, triggerAnimation]
  );

  // Hook SSE
  const { isConnected } = useServerSentEvents({
    clientType: "player",
    onEvent: handleGameEvent,
    onConnect: () => {
      console.log("🎮 Player: SSE połączone, żądanie aktualnego stanu...");

      // Krótkie opóźnienie żeby upewnić się że SSE jest w pełni gotowe
      setTimeout(() => {
        // Automatycznie żądaj aktualnego stanu po połączeniu
        fetch("/api/player/action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "request-current-state",
          }),
        })
          .then((response) => {
            console.log(
              "🎮 Player: Odpowiedź na request-current-state:",
              response.status
            );
            return response.json();
          })
          .then((data) => {
            console.log("🎮 Player: Dane z request-current-state:", data);
          })
          .catch((error) => {
            console.error(
              "🎮 Player: Błąd żądania stanu po połączeniu SSE:",
              error
            );
          });
      }, 100);
    },
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

  // Dodatkowy hook do sprawdzenia stanu gry po połączeniu SSE
  React.useEffect(() => {
    // Jeśli SSE jest połączone, ale nie mamy aktywnej gry, sprawdź stan
    if (
      isConnected &&
      state.gameStatus === "waiting" &&
      !state.currentQuestion
    ) {
      console.log(
        "🎮 Player: SSE połączone ale brak aktywnej gry - sprawdzanie stanu z /api/game/session"
      );

      setTimeout(() => {
        fetch("/api/game/session")
          .then((response) => response.json())
          .then((result) => {
            if (result.success && result.data && result.data.currentQuestion) {
              console.log(
                "🎮 Player: Znaleziono aktywną sesję przez fallback:",
                result.data
              );
              const sessionData = result.data;

              setState((prev) => ({
                ...prev,
                session: sessionData,
                currentQuestion: sessionData.currentQuestion,
                questionIndex: sessionData.currentQuestionIndex || 0,
                totalQuestions: sessionData.totalQuestions || 0,
                currentPrize: getCurrentPrize(
                  sessionData.currentQuestionIndex || 0
                ),
                gameStatus:
                  sessionData.status === "active" ? "active" : "waiting",
                lifelinesUsed: {
                  fiftyFifty: sessionData.usedLifelines?.fiftyFifty || false,
                  phoneAFriend:
                    sessionData.usedLifelines?.phoneAFriend || false,
                  askAudience: sessionData.usedLifelines?.askAudience || false,
                },
                hiddenAnswers:
                  sessionData.hiddenAnswers?.[
                    sessionData.currentQuestionIndex
                  ] || [],
              }));

              triggerAnimation("showQuestionAnimation");
              startTimer(30);
            } else {
              console.log("🎮 Player: Brak aktywnej sesji w fallback");
            }
          })
          .catch((error) => {
            console.error("🎮 Player: Błąd fallback sprawdzenia sesji:", error);
          });
      }, 2000); // 2 sekundy opóźnienia
    }
  }, [
    isConnected,
    state.gameStatus,
    state.currentQuestion,
    triggerAnimation,
    startTimer,
  ]);

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
